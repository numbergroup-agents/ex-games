/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
    };
    // Alias optional wagmi connector dependencies that may not be installed
    config.resolve.alias = {
      ...config.resolve.alias,
      porto: false,
      "@metamask/sdk": false,
      "@coinbase/wallet-sdk": false,
    };
    return config;
  },
};

export default nextConfig;
