"use client";

import { useParams } from "next/navigation";
import { useAccount, useReadContract, useReadContracts, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { formatEther } from "viem";
import { CONTRACTS, ExPoolABI } from "@/lib/contracts";
import { BettingPanel } from "@/components/BettingPanel";
import { CommentSection } from "@/components/CommentSection";
import { getAlias, DRAMA_TIER_EMOJIS, DRAMA_TIER_LABELS } from "@/lib/aliases";

export default function StoryDetailPage() {
  const { id } = useParams<{ id: string }>();
  const marketId = BigInt(id);
  const { address } = useAccount();

  const { data: marketData } = useReadContract({
    address: CONTRACTS.ExPool,
    abi: ExPoolABI,
    functionName: "getMarket",
    args: [marketId],
  });

  const { data: outcomes } = useReadContract({
    address: CONTRACTS.ExPool,
    abi: ExPoolABI,
    functionName: "getOutcomeLabels",
    args: [marketId],
  });

  const creator = marketData?.[0] ?? "";
  const title = marketData?.[1] ?? "";
  const body = marketData?.[2] ?? "";
  const numOutcomes = Number(marketData?.[3] ?? 0);
  const deadline = marketData?.[4] ?? 0n;
  const resolved = marketData?.[5] ?? false;
  const winningOutcome = Number(marketData?.[6] ?? 0);
  const totalPool = marketData?.[7] ?? 0n;
  const dramaTier = Number(marketData?.[8] ?? 0);

  // Fetch outcome pools
  const outcomePoolContracts = Array.from({ length: numOutcomes }, (_, i) => ({
    address: CONTRACTS.ExPool,
    abi: ExPoolABI,
    functionName: "outcomePools" as const,
    args: [marketId, i] as const,
  }));

  const { data: poolsData } = useReadContracts({ contracts: outcomePoolContracts });
  const outcomePools = poolsData?.map((r) => (r.status === "success" ? (r.result as bigint) : 0n)) ?? [];

  // Check if user has claimed
  const { data: hasClaimed } = useReadContract({
    address: CONTRACTS.ExPool,
    abi: ExPoolABI,
    functionName: "claimed",
    args: [marketId, address ?? "0x0000000000000000000000000000000000000000"],
  });

  const { writeContract: resolveMarket, data: resolveTx } = useWriteContract();
  const { isLoading: resolving } = useWaitForTransactionReceipt({ hash: resolveTx });

  const { writeContract: claimWinnings, data: claimTx } = useWriteContract();
  const { isLoading: claiming } = useWaitForTransactionReceipt({ hash: claimTx });

  const isCreator = address?.toLowerCase() === creator.toLowerCase();
  const isExpired = deadline <= BigInt(Math.floor(Date.now() / 1000));

  if (!title) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-drama-muted">Loading story...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Story Header */}
      <div className="rounded-xl border border-drama-border bg-drama-card p-6">
        <div className="mb-4 flex items-center gap-3">
          <span className="text-2xl">{DRAMA_TIER_EMOJIS[dramaTier]}</span>
          <span className="rounded-full bg-drama-purple/20 px-3 py-1 text-sm text-drama-pink">
            {DRAMA_TIER_LABELS[dramaTier]}
          </span>
          {resolved && (
            <span className="rounded-full bg-green-500/20 px-3 py-1 text-sm text-green-400">Resolved</span>
          )}
        </div>

        <h1 className="mb-2 text-2xl font-bold">{title}</h1>
        <p className="mb-4 text-sm text-drama-muted">Posted by {getAlias(creator)}</p>
        <div className="rounded-lg bg-drama-dark/50 p-4 text-sm leading-relaxed whitespace-pre-wrap">{body}</div>

        <div className="mt-4 flex items-center gap-6 text-sm text-drama-muted">
          <span>{Number(formatEther(totalPool)).toFixed(0)} EX total pool</span>
          <span>{numOutcomes} outcomes</span>
          <span>
            {isExpired
              ? "Betting closed"
              : `Ends ${new Date(Number(deadline) * 1000).toLocaleDateString()}`}
          </span>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Betting */}
        <BettingPanel
          marketId={marketId}
          outcomes={outcomes ?? []}
          outcomePools={outcomePools}
          totalPool={totalPool}
          resolved={resolved}
          deadline={deadline}
        />

        {/* Creator / Claim Controls */}
        <div className="space-y-4">
          {isCreator && isExpired && !resolved && (
            <div className="rounded-xl border border-drama-border bg-drama-card p-5">
              <h3 className="mb-3 text-lg font-semibold">Resolve Market</h3>
              <p className="mb-3 text-sm text-drama-muted">Select the winning outcome:</p>
              <div className="space-y-2">
                {(outcomes ?? []).map((outcome, i) => (
                  <button
                    key={i}
                    onClick={() =>
                      resolveMarket({
                        address: CONTRACTS.ExPool,
                        abi: ExPoolABI,
                        functionName: "resolveMarket",
                        args: [marketId, i],
                      })
                    }
                    disabled={resolving}
                    className="w-full rounded-lg border border-drama-border p-3 text-left hover:border-green-500/50 transition disabled:opacity-50"
                  >
                    {outcome}
                  </button>
                ))}
              </div>
            </div>
          )}

          {resolved && !hasClaimed && address && (
            <div className="rounded-xl border border-drama-border bg-drama-card p-5">
              <h3 className="mb-3 text-lg font-semibold">Claim Winnings</h3>
              <p className="mb-3 text-sm text-drama-muted">
                Winning outcome: <span className="font-semibold text-green-400">{outcomes?.[winningOutcome]}</span>
              </p>
              <button
                onClick={() =>
                  claimWinnings({
                    address: CONTRACTS.ExPool,
                    abi: ExPoolABI,
                    functionName: "claimWinnings",
                    args: [marketId],
                  })
                }
                disabled={claiming}
                className="w-full rounded-lg gradient-drama px-4 py-2.5 font-medium hover:opacity-90 transition disabled:opacity-50"
              >
                {claiming ? "Claiming..." : "Claim Winnings"}
              </button>
            </div>
          )}

          {resolved && hasClaimed && (
            <div className="rounded-xl border border-green-500/30 bg-green-500/10 p-5 text-center">
              <p className="text-green-400">Winnings claimed!</p>
            </div>
          )}
        </div>
      </div>

      {/* Comments */}
      <CommentSection marketId={marketId} comments={[]} />
    </div>
  );
}
