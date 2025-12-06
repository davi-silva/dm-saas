"use client";

import { useState } from "react";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import Signer from "./components/Signer";

export default function Home() {
  const { handleLogOut, setShowAuthFlow, user } = useDynamicContext();
  const [email, setEmail] = useState("");

  const handleLogin = () => {
    setShowAuthFlow(true);
  };

  console.log({ user });

  if (user) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-24">
        <div className="w-full max-w-md">
          <div className="flex justify-between items-center mb-4">
            <div>
              <p className="text-sm text-gray-400">Connected as:</p>
              <p className="text-lg font-semibold">{user.email}</p>
            </div>
            <button
              onClick={() => handleLogOut()}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              Log Out
            </button>
          </div>
          <Signer />
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="w-full max-w-sm p-8 bg-gray-800 rounded-lg shadow-lg text-center">
        <h1 className="text-2xl font-bold mb-6">Web3 Message Signer</h1>
        <p className="mb-4 text-gray-400">
          Log in with your email to sign and verify messages.
        </p>
        <button
          onClick={handleLogin}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Log In
        </button>
      </div>
    </main>
  );
}
