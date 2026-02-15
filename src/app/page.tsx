"use client";

import { useState } from "react";
import { useReadContract, useReadContracts } from "wagmi";
import { CONTRACTS, ExPoolABI } from "@/lib/contracts";
import { StoryCard } from "@/components/StoryCard";

type Filter = "active" | "resolved" | "all";
type Sort = "newest" | "pool" | "ending";

export default function FeedPage() {
  const [filter, setFilter] = useState<Filter>("active");
  const [sort, setSort] = useState<Sort>("newest");

  const { data: nextMarketId } = useReadContract({
    address: CONTRACTS.ExPool,
    abi: ExPoolABI,
    functionName: "nextMarketId",
  });

  const count = Number(nextMarketId ?? 0);
  const ids = Array.from({ length: count }, (_, i) => BigInt(i));

  const { data: marketsData } = useReadContracts({
    contracts: ids.flatMap((id) => [
      {
        address: CONTRACTS.ExPool,
        abi: ExPoolABI,
        functionName: "getMarket" as const,
        args: [id],
      },
      {
        address: CONTRACTS.ExPool,
        abi: ExPoolABI,
        functionName: "getOutcomeLabels" as const,
        args: [id],
      },
    ]),
  });

  // Also fetch outcome pools for each market
  const outcomePoolContracts = ids.flatMap((id) => {
    const marketIdx = Number(id) * 2;
    const marketResult = marketsData?.[marketIdx];
    const numOutcomes = marketResult?.status === "success" ? Number((marketResult.result as any)[3]) : 2;
    return Array.from({ length: numOutcomes }, (_, oi) => ({
      address: CONTRACTS.ExPool,
      abi: ExPoolABI,
      functionName: "outcomePools" as const,
      args: [id, oi] as const,
    }));
  });

  const { data: poolsData } = useReadContracts({ contracts: outcomePoolContracts });

  // Parse markets
  type Market = {
    id: bigint;
    creator: string;
    title: string;
    body: string;
    numOutcomes: number;
    deadline: bigint;
    resolved: boolean;
    winningOutcome: number;
    totalPool: bigint;
    dramaTier: number;
    outcomes: string[];
    outcomePools: bigint[];
  };

  const markets: Market[] = [];
  let poolOffset = 0;

  for (let i = 0; i < count; i++) {
    const mResult = marketsData?.[i * 2];
    const oResult = marketsData?.[i * 2 + 1];

    if (mResult?.status !== "success" || oResult?.status !== "success") continue;

    const m = mResult.result as any;
    const numOutcomes = Number(m[3]);

    const outcomePools: bigint[] = [];
    for (let oi = 0; oi < numOutcomes; oi++) {
      const r = poolsData?.[poolOffset + oi];
      outcomePools.push(r?.status === "success" ? (r.result as bigint) : 0n);
    }
    poolOffset += numOutcomes;

    markets.push({
      id: BigInt(i),
      creator: m[0],
      title: m[1],
      body: m[2],
      numOutcomes,
      deadline: m[4],
      resolved: m[5],
      winningOutcome: Number(m[6]),
      totalPool: m[7],
      dramaTier: Number(m[8]),
      outcomes: oResult.result as string[],
      outcomePools,
    });
  }

  // Filter
  const now = BigInt(Math.floor(Date.now() / 1000));
  const filtered = markets.filter((m) => {
    if (filter === "active") return !m.resolved && m.deadline > now;
    if (filter === "resolved") return m.resolved;
    return true;
  });

  // Sort
  filtered.sort((a, b) => {
    if (sort === "newest") return Number(b.id - a.id);
    if (sort === "pool") return Number(b.totalPool - a.totalPool);
    if (sort === "ending") return Number(a.deadline - b.deadline);
    return 0;
  });

  return (
    <div>
      <div className="mb-6">
        <h1 className="mb-2 text-3xl font-bold">
          <span className="gradient-drama bg-clip-text text-transparent">Drama Feed</span>
        </h1>
        <p className="text-drama-muted">Bet on the outcomes of real relationship drama</p>
      </div>

      <div className="mb-6 flex flex-wrap items-center gap-4">
        <div className="flex gap-1 rounded-lg bg-drama-card p-1">
          {(["active", "resolved", "all"] as Filter[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-md px-3 py-1.5 text-sm capitalize transition ${
                filter === f ? "gradient-drama text-white" : "text-drama-muted hover:text-white"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as Sort)}
          className="rounded-lg border border-drama-border bg-drama-card px-3 py-1.5 text-sm text-white outline-none"
        >
          <option value="newest">Newest</option>
          <option value="pool">Most Bets</option>
          <option value="ending">Ending Soon</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-xl border border-drama-border bg-drama-card p-12 text-center">
          <p className="text-lg text-drama-muted">No drama yet. Be the first to submit a story.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {filtered.map((m) => (
            <StoryCard
              key={m.id.toString()}
              marketId={m.id}
              creator={m.creator}
              title={m.title}
              outcomes={m.outcomes}
              outcomePools={m.outcomePools}
              totalPool={m.totalPool}
              deadline={m.deadline}
              dramaTier={m.dramaTier}
              resolved={m.resolved}
              winningOutcome={m.winningOutcome}
            />
          ))}
        </div>
      )}
    </div>
  );
}
