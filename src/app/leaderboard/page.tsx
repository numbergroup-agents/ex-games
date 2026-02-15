"use client";

import { getAlias } from "@/lib/aliases";

// Placeholder leaderboard — in production this would read from contract events
// and compute stats client-side or via an indexer
export default function LeaderboardPage() {
  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-6 text-3xl font-bold">
        <span className="gradient-drama bg-clip-text text-transparent">Leaderboard</span>
      </h1>

      <div className="space-y-6">
        {/* Top Predictors */}
        <div className="rounded-xl border border-drama-border bg-drama-card p-6">
          <h2 className="mb-4 text-lg font-semibold">Top Predictors</h2>
          <p className="text-sm text-drama-muted">
            Rankings will populate as markets are resolved. Accuracy is tracked per user based on winning bets vs total bets.
          </p>
          <div className="mt-4 space-y-2">
            <LeaderboardPlaceholder />
          </div>
        </div>

        {/* Top Earners */}
        <div className="rounded-xl border border-drama-border bg-drama-card p-6">
          <h2 className="mb-4 text-lg font-semibold">Top Earners</h2>
          <p className="text-sm text-drama-muted">
            Ranked by total EX won from prediction markets.
          </p>
          <div className="mt-4 space-y-2">
            <LeaderboardPlaceholder />
          </div>
        </div>

        {/* Most Active */}
        <div className="rounded-xl border border-drama-border bg-drama-card p-6">
          <h2 className="mb-4 text-lg font-semibold">Most Active</h2>
          <p className="text-sm text-drama-muted">
            Most bets placed across all markets.
          </p>
          <div className="mt-4 space-y-2">
            <LeaderboardPlaceholder />
          </div>
        </div>
      </div>
    </div>
  );
}

function LeaderboardPlaceholder() {
  // Demo entries
  const demoAddresses = [
    "0x1234567890abcdef1234567890abcdef12345678",
    "0xabcdef1234567890abcdef1234567890abcdef12",
    "0x9876543210fedcba9876543210fedcba98765432",
  ];

  return (
    <div className="space-y-2">
      {demoAddresses.map((addr, i) => (
        <div
          key={addr}
          className="flex items-center justify-between rounded-lg bg-drama-dark/50 px-4 py-3"
        >
          <div className="flex items-center gap-3">
            <span className="text-lg font-bold text-drama-muted">#{i + 1}</span>
            <span className="text-sm font-medium">{getAlias(addr)}</span>
          </div>
          <span className="text-sm text-drama-muted">--</span>
        </div>
      ))}
    </div>
  );
}
