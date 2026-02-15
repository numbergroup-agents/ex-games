"use client";

import { useState } from "react";
import { parseEther, formatEther } from "viem";
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { CONTRACTS, ExTokenABI } from "@/lib/contracts";
import { getAlias, TIER_NAMES, TIER_EMOJIS } from "@/lib/aliases";

export default function ProfilePage() {
  const { address } = useAccount();
  const [stakeAmount, setStakeAmount] = useState("");
  const [unstakeAmount, setUnstakeAmount] = useState("");

  const { data: balance } = useReadContract({
    address: CONTRACTS.ExToken,
    abi: ExTokenABI,
    functionName: "balanceOf",
    args: [address ?? "0x0000000000000000000000000000000000000000"],
  });

  const { data: stakedBalance } = useReadContract({
    address: CONTRACTS.ExToken,
    abi: ExTokenABI,
    functionName: "stakedBalance",
    args: [address ?? "0x0000000000000000000000000000000000000000"],
  });

  const { data: tier } = useReadContract({
    address: CONTRACTS.ExToken,
    abi: ExTokenABI,
    functionName: "getTier",
    args: [address ?? "0x0000000000000000000000000000000000000000"],
  });

  const { writeContract: stake, data: stakeTx } = useWriteContract();
  const { isLoading: staking } = useWaitForTransactionReceipt({ hash: stakeTx });

  const { writeContract: unstake, data: unstakeTx } = useWriteContract();
  const { isLoading: unstaking } = useWaitForTransactionReceipt({ hash: unstakeTx });

  if (!address) {
    return (
      <div className="rounded-xl border border-drama-border bg-drama-card p-12 text-center">
        <p className="text-lg text-drama-muted">Connect your wallet to view your profile</p>
      </div>
    );
  }

  const tierIdx = Number(tier ?? 0);
  const bal = balance ? Number(formatEther(balance)) : 0;
  const staked = stakedBalance ? Number(formatEther(stakedBalance)) : 0;

  function handleStake() {
    if (!stakeAmount) return;
    stake({
      address: CONTRACTS.ExToken,
      abi: ExTokenABI,
      functionName: "stake",
      args: [parseEther(stakeAmount)],
    });
    setStakeAmount("");
  }

  function handleUnstake() {
    if (!unstakeAmount) return;
    unstake({
      address: CONTRACTS.ExToken,
      abi: ExTokenABI,
      functionName: "unstake",
      args: [parseEther(unstakeAmount)],
    });
    setUnstakeAmount("");
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-3xl font-bold">
        <span className="gradient-drama bg-clip-text text-transparent">Profile</span>
      </h1>

      {/* Identity */}
      <div className="rounded-xl border border-drama-border bg-drama-card p-6">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full gradient-drama text-2xl">
            {TIER_EMOJIS[tierIdx]}
          </div>
          <div>
            <h2 className="text-xl font-bold">{getAlias(address)}</h2>
            <p className="text-sm text-drama-muted">
              {TIER_EMOJIS[tierIdx]} {TIER_NAMES[tierIdx]} Tier
            </p>
          </div>
        </div>
      </div>

      {/* Balances */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-drama-border bg-drama-card p-5">
          <p className="text-sm text-drama-muted">Available Balance</p>
          <p className="mt-1 text-2xl font-bold">{bal.toLocaleString()} EX</p>
        </div>
        <div className="rounded-xl border border-drama-border bg-drama-card p-5">
          <p className="text-sm text-drama-muted">Staked Balance</p>
          <p className="mt-1 text-2xl font-bold">{staked.toLocaleString()} EX</p>
        </div>
      </div>

      {/* Staking */}
      <div className="rounded-xl border border-drama-border bg-drama-card p-6">
        <h3 className="mb-4 text-lg font-semibold">Stake / Unstake</h3>

        <div className="mb-4 rounded-lg bg-drama-dark/50 p-3 text-sm">
          <p className="mb-1 text-drama-muted">Tier Thresholds:</p>
          <div className="space-y-1">
            <p>👀 Gossip - 0 EX (default)</p>
            <p>🔮 Advisor - 1,000+ EX staked</p>
            <p>🌟 Oracle - 10,000+ EX staked (can community resolve)</p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm text-drama-muted">Stake</label>
            <div className="flex gap-2">
              <input
                type="number"
                value={stakeAmount}
                onChange={(e) => setStakeAmount(e.target.value)}
                placeholder="Amount"
                className="flex-1 rounded-lg border border-drama-border bg-drama-dark px-3 py-2 text-white outline-none focus:border-drama-purple"
              />
              <button
                onClick={handleStake}
                disabled={staking || !stakeAmount}
                className="rounded-lg gradient-drama px-4 py-2 text-sm font-medium hover:opacity-90 transition disabled:opacity-50"
              >
                {staking ? "..." : "Stake"}
              </button>
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm text-drama-muted">Unstake</label>
            <div className="flex gap-2">
              <input
                type="number"
                value={unstakeAmount}
                onChange={(e) => setUnstakeAmount(e.target.value)}
                placeholder="Amount"
                className="flex-1 rounded-lg border border-drama-border bg-drama-dark px-3 py-2 text-white outline-none focus:border-drama-purple"
              />
              <button
                onClick={handleUnstake}
                disabled={unstaking || !unstakeAmount}
                className="rounded-lg border border-drama-pink px-4 py-2 text-sm font-medium text-drama-pink hover:bg-drama-pink/10 transition disabled:opacity-50"
              >
                {unstaking ? "..." : "Unstake"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
