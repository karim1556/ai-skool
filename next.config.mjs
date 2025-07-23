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
  // Configure SQLite for serverless environment
  experimental: {
    serverComponentsExternalPackages: ['sqlite3', 'sqlite', 'better-sqlite3'],
    // Exclude native dependencies from bundling to prevent build issues
    outputFileTracingExcludes: {
      '*': [
        'node_modules/better-sqlite3/deps/**/*',
        'node_modules/sqlite3/deps/**/*',
        'node_modules/sqlite3/lib/binding/**/*',
        'node_modules/better-sqlite3/build/**/*'
      ],
    },
  },
  // Add webpack configuration to handle SQLite in serverless
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Mark sqlite3 and better-sqlite3 as external to prevent bundling issues
      config.externals = [...config.externals, 'sqlite3', 'better-sqlite3'];
    }
    return config;
  }
}

export default nextConfig
