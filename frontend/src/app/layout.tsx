"use client";

import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import "./globals.css";

import { DynamicContextProvider } from "@dynamic-labs/sdk-react-core";
import { EthereumWalletConnectors } from "@dynamic-labs/ethereum";
import { DYNAMIC_ENV_ID } from "@/constants";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Web3 Message Signer",
  description: "Sign and verify messages with your wallet",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistMono.variable} antialiased bg-gray-900 text-white`}
      >
        <DynamicContextProvider
          settings={{
            environmentId: DYNAMIC_ENV_ID,
            walletConnectors: [EthereumWalletConnectors],
          }}
        >
          {children}
        </DynamicContextProvider>
      </body>
    </html>
  );
}
