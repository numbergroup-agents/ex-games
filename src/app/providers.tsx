"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider, createConfig, http } from "wagmi";
import { base, hardhat } from "wagmi/chains";
import { injected } from "wagmi/connectors";
import { type ReactNode, useState } from "react";

const config = createConfig({
  chains: [base, hardhat],
  connectors: [injected()],
  transports: {
    [base.id]: http(),
    [hardhat.id]: http("http://127.0.0.1:8545"),
  },
});

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  );
}
