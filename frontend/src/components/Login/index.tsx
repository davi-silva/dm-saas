"use client";

import { useDynamicContext } from "@dynamic-labs/sdk-react-core";

const Login = () => {
  const { setShowAuthFlow } = useDynamicContext();

  const handleLogin = () => {
    setShowAuthFlow(true);
  };

  return (
    <div className="w-full max-w-sm p-8 bg-gray-800 rounded-lg shadow-lg text-center">
      <h1 className="text-2xl font-bold mb-6">Web3 Message Signer</h1>
      <p className="mb-4 text-gray-400">
        Log in with your email to sign and verify messages.
      </p>
      <button
        onClick={handleLogin}
        className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        data-testid="logIn"
      >
        Log In
      </button>
    </div>
  );
};

export default Login;
