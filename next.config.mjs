/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Add this configuration
  experimental: {
    serverComponentsExternalPackages: ['sqlite3', 'sqlite'],
  }
}

export default nextConfig
