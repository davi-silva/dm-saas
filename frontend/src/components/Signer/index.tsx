"use client";

import { useState, useEffect } from "react";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";

import { verifySignature } from "@/services";

import type { VerificationResult } from "@/services/message/types";
import type { HistoryItem } from "./types";

const Signer = () => {
  const { primaryWallet } = useDynamicContext();
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [verificationResult, setVerificationResult] =
    useState<VerificationResult | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>(() => {
    if (typeof window !== "undefined") {
      const storedHistory = localStorage.getItem("signing_history");
      if (storedHistory) {
        return JSON.parse(storedHistory);
      }
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem("signing_history", JSON.stringify(history));
  }, [history]);

  const handleSignMessage = async () => {
    if (!primaryWallet) return;

    setIsLoading(true);
    setVerificationResult(null);

    try {
      // @ts-ignore getSigner() undefined
      const signer = await primaryWallet.connector.getSigner();
      if (!signer) {
        throw new Error("Signer not found");
      }

      const signature = await signer.signMessage({ message });

      const result = await verifySignature(message, signature as string);

      const newHistoryItem: HistoryItem = {
        message,
        signature: signature as string,
        isValid: result.isValid,
        signer: result.signer,
      };
      setHistory([newHistoryItem, ...history]);
      setVerificationResult(result);
    } catch (_error) {
      setVerificationResult({ isValid: false, error: "Signing failed" });
    } finally {
      setIsLoading(false);
    }
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem("signing_history");
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-6">
        <h2 className="text-xl font-semibold mb-4">Sign a New Message</h2>
        <textarea
          className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          rows={4}
          placeholder="Enter the message you want to sign"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button
          className="mt-4 w-full px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 disabled:bg-gray-500 disabled:cursor-not-allowed"
          onClick={handleSignMessage}
          disabled={!message || !primaryWallet || isLoading}
        >
          {isLoading ? "Signing..." : "Sign Message"}
        </button>
      </div>

      {verificationResult && (
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-6">
          <h2 className="text-xl font-semibold mb-4">
            Last Verification Result
          </h2>
          <div
            className={`p-4 rounded-md ${
              verificationResult.isValid ? "bg-green-900/50" : "bg-red-900/50"
            }`}
          >
            <p className="font-bold">
              Signature is {verificationResult.isValid ? "Valid" : "Invalid"}
            </p>
            {verificationResult.signer && (
              <p className="font-mono text-sm break-all">
                Signer: {verificationResult.signer}
              </p>
            )}
            {verificationResult.error && (
              <p className="text-red-400">{verificationResult.error}</p>
            )}
          </div>
        </div>
      )}

      {history.length > 0 && (
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Signing History</h2>
            <button
              onClick={clearHistory}
              className="text-sm text-gray-400 hover:text-white"
              data-testid="clearButton"
            >
              Clear History
            </button>
          </div>
          <ul className="space-y-4">
            {history.map((item, index) => (
              <li key={index} className="border-b border-gray-700 pb-4">
                <p className="font-semibold break-words">
                  Message: {item.message}
                </p>
                <p className="font-mono text-sm break-all text-gray-400">
                  Signature: {item.signature}
                </p>
                <p
                  className={`text-sm font-bold ${
                    item.isValid ? "text-green-400" : "text-red-400"
                  }`}
                >
                  Status: {item.isValid ? "Verified" : "Failed"}
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Signer;
