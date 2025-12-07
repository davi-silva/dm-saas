import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.externals.push('pino-pretty');

      // Alias @react-native-async-storage/async-storage to a dummy module for client-side
      config.resolve.alias['@react-native-async-storage/async-storage'] = false;
    }
    return config;
  },
};

export default nextConfig;
