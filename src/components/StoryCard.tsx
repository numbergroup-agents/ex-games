"use client";

import Link from "next/link";
import { formatEther } from "viem";
import { DRAMA_TIER_EMOJIS, DRAMA_TIER_LABELS, getAlias } from "@/lib/aliases";

export interface StoryCardProps {
  marketId: bigint;
  creator: string;
  title: string;
  outcomes: string[];
  outcomePools: bigint[];
  totalPool: bigint;
  deadline: bigint;
  dramaTier: number;
  resolved: boolean;
  winningOutcome: number;
}

function timeRemaining(deadline: bigint): string {
  const now = BigInt(Math.floor(Date.now() / 1000));
  if (deadline <= now) return "Ended";
  const diff = Number(deadline - now);
  const hours = Math.floor(diff / 3600);
  const mins = Math.floor((diff % 3600) / 60);
  if (hours > 24) return `${Math.floor(hours / 24)}d ${hours % 24}h`;
  if (hours > 0) return `${hours}h ${mins}m`;
  return `${mins}m`;
}

export function StoryCard({
  marketId, creator, title, outcomes, outcomePools, totalPool, deadline, dramaTier, resolved, winningOutcome,
}: StoryCardProps) {
  const total = Number(formatEther(totalPool));

  return (
    <Link
      href={`/story/${marketId.toString()}`}
      className="block rounded-xl border border-drama-border bg-drama-card p-5 hover:border-drama-purple/50 transition"
    >
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-lg">{DRAMA_TIER_EMOJIS[dramaTier]}</span>
          <span className="rounded-full bg-drama-purple/20 px-2 py-0.5 text-xs text-drama-pink">
            {DRAMA_TIER_LABELS[dramaTier]}
          </span>
        </div>
        <span className="text-xs text-drama-muted">
          {resolved ? "Resolved" : timeRemaining(deadline)}
        </span>
      </div>

      <h3 className="mb-2 text-lg font-semibold">{title}</h3>
      <p className="mb-3 text-xs text-drama-muted">by {getAlias(creator)}</p>

      <div className="space-y-2">
        {outcomes.map((outcome, i) => {
          const pool = Number(formatEther(outcomePools[i] ?? 0n));
          const pct = total > 0 ? (pool / total) * 100 : 0;
          const isWinner = resolved && winningOutcome === i;

          return (
            <div key={i} className="relative overflow-hidden rounded-lg bg-drama-dark/50 p-2">
              <div
                className={`absolute inset-y-0 left-0 ${isWinner ? "bg-green-500/20" : "bg-drama-purple/10"}`}
                style={{ width: `${pct}%` }}
              />
              <div className="relative flex items-center justify-between text-sm">
                <span className={isWinner ? "font-semibold text-green-400" : ""}>
                  {isWinner && "✓ "}{outcome}
                </span>
                <span className="text-drama-muted">{pct.toFixed(0)}%</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-3 flex items-center justify-between text-xs text-drama-muted">
        <span>{total.toFixed(0)} EX in pool</span>
        <span>{outcomes.length} outcomes</span>
      </div>
    </Link>
  );
}
