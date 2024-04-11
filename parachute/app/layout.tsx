'use client';

import "./globals.css"
import { getDefaultConfig, RainbowKitProvider} from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import {
  hardhat, sepolia, baseSepolia} from 'wagmi/chains';
import { QueryClientProvider, QueryClient,} from "@tanstack/react-query";
import '@rainbow-me/rainbowkit/styles.css';

import {Toaster } from "sonner";
import Navbar from "@/components/Navbar";

const WALLET_CONNECT = process.env.NEXT_PUBLIC_WALLET_CONNECT || "";

const config = getDefaultConfig({
  appName: 'My RainbowKit App',
  projectId: WALLET_CONNECT,
  chains: [hardhat, sepolia, baseSepolia],
  ssr: true,
});

const queryClient = new QueryClient();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body >
        <WagmiProvider config={config}>
          <QueryClientProvider client={queryClient}>
            <RainbowKitProvider>
              <Navbar/>
                <Toaster/>
                <div className="py-28">
                  {children}
                </div>
                <footer className="mt-40 justify-center">
                  <div className="text-center text-sm">
                    Copyright © All rights reserved |{" "}
                    <a
                      href="https://github.com/0xaDanteees"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline"
                    >
                      0xâDanteees
                    </a>
                  </div>
                </footer>
            </RainbowKitProvider>
          </QueryClientProvider>
        </WagmiProvider>
      </body>
    </html>
  );
}