"use client";

import { useState } from "react";
import { parseEther } from "viem";
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { CONTRACTS, ExPoolABI, ExTokenABI } from "@/lib/contracts";
import { DRAMA_TIER_EMOJIS, DRAMA_TIER_LABELS } from "@/lib/aliases";

const FEES: Record<number, string> = { 1: "10", 2: "50", 3: "100" };

export default function SubmitPage() {
  const { address } = useAccount();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [dramaTier, setDramaTier] = useState(1);
  const [outcomes, setOutcomes] = useState(["", ""]);
  const [daysUntilDeadline, setDaysUntilDeadline] = useState(7);

  const { writeContract: approve, data: approveTx } = useWriteContract();
  const { isLoading: approving } = useWaitForTransactionReceipt({ hash: approveTx });

  const { writeContract: createMarket, data: createTx } = useWriteContract();
  const { isLoading: creating } = useWaitForTransactionReceipt({ hash: createTx });

  const fee = FEES[dramaTier];
  const deadline = BigInt(Math.floor(Date.now() / 1000) + daysUntilDeadline * 86400);

  function addOutcome() {
    if (outcomes.length < 4) setOutcomes([...outcomes, ""]);
  }

  function removeOutcome(i: number) {
    if (outcomes.length > 2) setOutcomes(outcomes.filter((_, idx) => idx !== i));
  }

  function updateOutcome(i: number, val: string) {
    const next = [...outcomes];
    next[i] = val;
    setOutcomes(next);
  }

  async function handleApprove() {
    approve({
      address: CONTRACTS.ExToken,
      abi: ExTokenABI,
      functionName: "approve",
      args: [CONTRACTS.ExPool, parseEther(fee)],
    });
  }

  async function handleSubmit() {
    const validOutcomes = outcomes.filter((o) => o.trim());
    if (validOutcomes.length < 2) return;

    createMarket({
      address: CONTRACTS.ExPool,
      abi: ExPoolABI,
      functionName: "createMarket",
      args: [title, body, validOutcomes, deadline, dramaTier],
    });
  }

  if (!address) {
    return (
      <div className="rounded-xl border border-drama-border bg-drama-card p-12 text-center">
        <p className="text-lg text-drama-muted">Connect your wallet to submit a story</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-6 text-3xl font-bold">
        <span className="gradient-drama bg-clip-text text-transparent">Submit Drama</span>
      </h1>

      <div className="space-y-6 rounded-xl border border-drama-border bg-drama-card p-6">
        {/* Title */}
        <div>
          <label className="mb-1 block text-sm font-medium">Title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Will Jake and Sarah get back together?"
            className="w-full rounded-lg border border-drama-border bg-drama-dark px-3 py-2 text-white outline-none focus:border-drama-purple"
          />
        </div>

        {/* Body */}
        <div>
          <label className="mb-1 block text-sm font-medium">The Story</label>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Give us the tea... What happened? What's at stake?"
            rows={6}
            className="w-full rounded-lg border border-drama-border bg-drama-dark px-3 py-2 text-white outline-none focus:border-drama-purple resize-none"
          />
        </div>

        {/* Drama Tier */}
        <div>
          <label className="mb-2 block text-sm font-medium">Drama Tier</label>
          <div className="flex gap-2">
            {[1, 2, 3].map((tier) => (
              <button
                key={tier}
                onClick={() => setDramaTier(tier)}
                className={`flex-1 rounded-lg border p-3 text-center transition ${
                  dramaTier === tier
                    ? "border-drama-pink bg-drama-pink/10"
                    : "border-drama-border hover:border-drama-purple/50"
                }`}
              >
                <div className="text-xl">{DRAMA_TIER_EMOJIS[tier]}</div>
                <div className="mt-1 text-xs">{DRAMA_TIER_LABELS[tier]}</div>
                <div className="mt-1 text-xs text-drama-muted">{FEES[tier]} EX</div>
              </button>
            ))}
          </div>
        </div>

        {/* Outcomes */}
        <div>
          <label className="mb-2 block text-sm font-medium">Outcomes (2-4)</label>
          <div className="space-y-2">
            {outcomes.map((outcome, i) => (
              <div key={i} className="flex gap-2">
                <input
                  value={outcome}
                  onChange={(e) => updateOutcome(i, e.target.value)}
                  placeholder={`Outcome ${i + 1}`}
                  className="flex-1 rounded-lg border border-drama-border bg-drama-dark px-3 py-2 text-white outline-none focus:border-drama-purple"
                />
                {outcomes.length > 2 && (
                  <button
                    onClick={() => removeOutcome(i)}
                    className="rounded-lg border border-drama-border px-3 py-2 text-drama-muted hover:text-red-400 transition"
                  >
                    X
                  </button>
                )}
              </div>
            ))}
          </div>
          {outcomes.length < 4 && (
            <button
              onClick={addOutcome}
              className="mt-2 text-sm text-drama-pink hover:underline"
            >
              + Add Outcome
            </button>
          )}
        </div>

        {/* Deadline */}
        <div>
          <label className="mb-1 block text-sm font-medium">Betting Window</label>
          <select
            value={daysUntilDeadline}
            onChange={(e) => setDaysUntilDeadline(Number(e.target.value))}
            className="rounded-lg border border-drama-border bg-drama-dark px-3 py-2 text-white outline-none"
          >
            <option value={1}>1 day</option>
            <option value={3}>3 days</option>
            <option value={7}>7 days</option>
            <option value={14}>14 days</option>
            <option value={30}>30 days</option>
          </select>
        </div>

        {/* Fee Display */}
        <div className="rounded-lg bg-drama-dark/50 p-3 text-sm">
          <div className="flex justify-between">
            <span className="text-drama-muted">Submission fee</span>
            <span className="font-semibold">{fee} EX</span>
          </div>
        </div>

        {/* Submit */}
        <div className="flex gap-2">
          <button
            onClick={handleApprove}
            disabled={approving}
            className="flex-1 rounded-lg border border-drama-pink px-4 py-2.5 font-medium text-drama-pink hover:bg-drama-pink/10 transition disabled:opacity-50"
          >
            {approving ? "Approving..." : `Approve ${fee} EX`}
          </button>
          <button
            onClick={handleSubmit}
            disabled={creating || !title || !body}
            className="flex-1 rounded-lg gradient-drama px-4 py-2.5 font-medium hover:opacity-90 transition disabled:opacity-50"
          >
            {creating ? "Submitting..." : "Submit Story"}
          </button>
        </div>
      </div>
    </div>
  );
}
