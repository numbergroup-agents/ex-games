"use client";

import Link from "next/link";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { getAlias } from "@/lib/aliases";

export function Navbar() {
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();

  return (
    <nav className="border-b border-drama-border bg-drama-card/80 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link href="/" className="text-xl font-bold gradient-drama bg-clip-text text-transparent">
          Ex Games
        </Link>

        <div className="flex items-center gap-6">
          <Link href="/" className="text-sm text-drama-muted hover:text-white transition">
            Feed
          </Link>
          <Link href="/submit" className="text-sm text-drama-muted hover:text-white transition">
            Submit
          </Link>
          <Link href="/profile" className="text-sm text-drama-muted hover:text-white transition">
            Profile
          </Link>
          <Link href="/leaderboard" className="text-sm text-drama-muted hover:text-white transition">
            Leaderboard
          </Link>

          {isConnected ? (
            <div className="flex items-center gap-3">
              <span className="rounded-full bg-drama-purple/20 px-3 py-1 text-xs text-drama-pink">
                {address ? getAlias(address) : ""}
              </span>
              <button
                onClick={() => disconnect()}
                className="rounded-lg border border-drama-border px-3 py-1.5 text-xs hover:bg-drama-border/50 transition"
              >
                Disconnect
              </button>
            </div>
          ) : (
            <button
              onClick={() => connect({ connector: connectors[0] })}
              className="rounded-lg gradient-drama px-4 py-1.5 text-sm font-medium hover:opacity-90 transition"
            >
              Connect Wallet
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
