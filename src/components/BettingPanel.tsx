"use client";

import { useState } from "react";
import { parseEther, formatEther } from "viem";
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { CONTRACTS, ExPoolABI, ExTokenABI } from "@/lib/contracts";

interface BettingPanelProps {
  marketId: bigint;
  outcomes: readonly string[] | string[];
  outcomePools: bigint[];
  totalPool: bigint;
  resolved: boolean;
  deadline: bigint;
}

export function BettingPanel({ marketId, outcomes, outcomePools, totalPool, resolved, deadline }: BettingPanelProps) {
  const { address } = useAccount();
  const [selectedOutcome, setSelectedOutcome] = useState<number | null>(null);
  const [amount, setAmount] = useState("");

  const { writeContract: approve, data: approveTx } = useWriteContract();
  const { writeContract: placeBet, data: betTx } = useWriteContract();
  const { isLoading: approving } = useWaitForTransactionReceipt({ hash: approveTx });
  const { isLoading: betting } = useWaitForTransactionReceipt({ hash: betTx });

  const isExpired = deadline <= BigInt(Math.floor(Date.now() / 1000));
  const disabled = resolved || isExpired || !address;

  const total = Number(formatEther(totalPool));
  const betAmount = amount ? Number(amount) : 0;

  function potentialPayout(): string {
    if (selectedOutcome === null || betAmount <= 0 || total <= 0) return "0";
    const outcomePool = Number(formatEther(outcomePools[selectedOutcome] ?? 0n));
    const newTotal = total + betAmount;
    const newOutcomePool = outcomePool + betAmount;
    const netPool = newTotal * 0.93; // 5% platform + 2% creator
    const payout = (netPool * betAmount) / newOutcomePool;
    return payout.toFixed(2);
  }

  async function handleBet() {
    if (selectedOutcome === null || !amount) return;
    const wei = parseEther(amount);

    approve({
      address: CONTRACTS.ExToken,
      abi: ExTokenABI,
      functionName: "approve",
      args: [CONTRACTS.ExPool, wei],
    });
  }

  function executeBet() {
    if (selectedOutcome === null || !amount) return;
    placeBet({
      address: CONTRACTS.ExPool,
      abi: ExPoolABI,
      functionName: "placeBet",
      args: [marketId, selectedOutcome, parseEther(amount)],
    });
  }

  return (
    <div className="rounded-xl border border-drama-border bg-drama-card p-5">
      <h3 className="mb-4 text-lg font-semibold">Place Your Bet</h3>

      {disabled && (
        <p className="mb-4 text-sm text-drama-muted">
          {resolved ? "Market resolved" : isExpired ? "Betting closed" : "Connect wallet to bet"}
        </p>
      )}

      <div className="mb-4 space-y-2">
        {outcomes.map((outcome, i) => {
          const pool = Number(formatEther(outcomePools[i] ?? 0n));
          const pct = total > 0 ? (pool / total) * 100 : 0;

          return (
            <button
              key={i}
              onClick={() => !disabled && setSelectedOutcome(i)}
              disabled={disabled}
              className={`w-full rounded-lg border p-3 text-left transition ${
                selectedOutcome === i
                  ? "border-drama-pink bg-drama-pink/10"
                  : "border-drama-border hover:border-drama-purple/50"
              } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              <div className="flex justify-between">
                <span className="font-medium">{outcome}</span>
                <span className="text-drama-muted">{pct.toFixed(1)}%</span>
              </div>
              <div className="mt-1 text-xs text-drama-muted">{pool.toFixed(0)} EX</div>
            </button>
          );
        })}
      </div>

      {!disabled && selectedOutcome !== null && (
        <>
          <div className="mb-4">
            <label className="mb-1 block text-sm text-drama-muted">Amount (EX)</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0"
              min="1"
              className="w-full rounded-lg border border-drama-border bg-drama-dark px-3 py-2 text-white outline-none focus:border-drama-purple"
            />
          </div>

          {betAmount > 0 && (
            <div className="mb-4 rounded-lg bg-drama-dark/50 p-3 text-sm">
              <div className="flex justify-between">
                <span className="text-drama-muted">Potential payout</span>
                <span className="font-semibold text-green-400">{potentialPayout()} EX</span>
              </div>
            </div>
          )}

          <div className="flex gap-2">
            <button
              onClick={handleBet}
              disabled={approving || !amount}
              className="flex-1 rounded-lg gradient-drama px-4 py-2.5 font-medium hover:opacity-90 transition disabled:opacity-50"
            >
              {approving ? "Approving..." : "Approve"}
            </button>
            <button
              onClick={executeBet}
              disabled={betting || !amount}
              className="flex-1 rounded-lg border border-drama-pink px-4 py-2.5 font-medium text-drama-pink hover:bg-drama-pink/10 transition disabled:opacity-50"
            >
              {betting ? "Betting..." : "Bet"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
