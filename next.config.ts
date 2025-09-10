import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  
  // Ignorer les erreurs de typage lors du build
  typescript: {
    // !! ATTENTION !!
    // Ignorer les erreurs de typage est dangereux et ne devrait être fait que temporairement
    ignoreBuildErrors: true,
  },
  // Autres configurations
  reactStrictMode: true,
  // Retirer swcMinify qui cause un avertissement
  // swcMinify: true,
};

export default nextConfig;
