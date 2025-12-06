"use client";

import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import Signer from "@/components/Signer";
import { Login } from "@/components";

export default function Home() {
  const { handleLogOut, user, primaryWallet } = useDynamicContext();

  if (user) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-24">
        <div className="w-full max-w-md">
          <button
            onClick={() => handleLogOut()}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 mb-6"
          >
            Log Out
          </button>
          <div className="flex justify-between items-center mb-4">
            <div>
              <p className="text-sm text-gray-400">Connected as:</p>
              <p className="text-lg font-semibold">{user.email}</p>
              {primaryWallet && (
                <p className="text-sm text-gray-400">
                  Wallet:{" "}
                  <span className="font-mono break-all">
                    {primaryWallet.address}
                  </span>
                </p>
              )}
            </div>
          </div>
          <Signer />
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <Login />
    </main>
  );
}
