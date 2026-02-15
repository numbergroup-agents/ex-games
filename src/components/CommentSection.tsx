"use client";

import { useState } from "react";
import { parseEther, formatEther } from "viem";
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { CONTRACTS, ExCommentsABI, ExTokenABI } from "@/lib/contracts";
import { getAlias } from "@/lib/aliases";

interface Comment {
  id: bigint;
  author: string;
  content: string;
  totalTips: bigint;
}

interface CommentSectionProps {
  marketId: bigint;
  comments: Comment[];
}

export function CommentSection({ marketId, comments }: CommentSectionProps) {
  const { address } = useAccount();
  const [newComment, setNewComment] = useState("");
  const [tipAmount, setTipAmount] = useState("");

  const { writeContract: postComment, data: postTx } = useWriteContract();
  const { isLoading: posting } = useWaitForTransactionReceipt({ hash: postTx });

  const { writeContract: tipComment, data: tipTx } = useWriteContract();
  const { isLoading: tipping } = useWaitForTransactionReceipt({ hash: tipTx });

  function handlePost() {
    if (!newComment.trim()) return;
    postComment({
      address: CONTRACTS.ExComments,
      abi: ExCommentsABI,
      functionName: "postComment",
      args: [marketId, newComment],
    });
    setNewComment("");
  }

  function handleTip(commentId: bigint) {
    if (!tipAmount) return;
    tipComment({
      address: CONTRACTS.ExComments,
      abi: ExCommentsABI,
      functionName: "tipComment",
      args: [commentId, parseEther(tipAmount)],
    });
  }

  return (
    <div className="rounded-xl border border-drama-border bg-drama-card p-5">
      <h3 className="mb-4 text-lg font-semibold">Comments</h3>

      {address && (
        <div className="mb-4 flex gap-2">
          <input
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Drop your take..."
            className="flex-1 rounded-lg border border-drama-border bg-drama-dark px-3 py-2 text-sm text-white outline-none focus:border-drama-purple"
          />
          <button
            onClick={handlePost}
            disabled={posting || !newComment.trim()}
            className="rounded-lg gradient-drama px-4 py-2 text-sm font-medium hover:opacity-90 transition disabled:opacity-50"
          >
            {posting ? "..." : "Post"}
          </button>
        </div>
      )}

      <div className="space-y-3">
        {comments.length === 0 && (
          <p className="text-sm text-drama-muted">No comments yet. Be first to spill.</p>
        )}
        {comments.map((c) => (
          <div key={c.id.toString()} className="rounded-lg bg-drama-dark/50 p-3">
            <div className="mb-1 flex items-center justify-between">
              <span className="text-xs font-medium text-drama-pink">{getAlias(c.author)}</span>
              {Number(c.totalTips) > 0 && (
                <span className="text-xs text-drama-muted">
                  {Number(formatEther(c.totalTips)).toFixed(0)} EX tipped
                </span>
              )}
            </div>
            <p className="mb-2 text-sm">{c.content}</p>
            {address && (
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="Tip EX"
                  value={tipAmount}
                  onChange={(e) => setTipAmount(e.target.value)}
                  className="w-20 rounded border border-drama-border bg-drama-dark px-2 py-1 text-xs outline-none"
                />
                <button
                  onClick={() => handleTip(c.id)}
                  disabled={tipping}
                  className="rounded border border-drama-border px-2 py-1 text-xs hover:bg-drama-border/50 transition"
                >
                  Tip
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
