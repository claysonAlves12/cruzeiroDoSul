import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // Permite todos os domínios com HTTPS
      },
      {
        protocol: 'http',
        hostname: '**', // Permite todos os domínios com HTTP
      },
    ],
  },
};

export default nextConfig;
