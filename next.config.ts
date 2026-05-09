import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Experimental features for Next.js 15
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client', 'prisma'],
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons', 'recharts'],
  },

  // Image domains for avatars and uploads
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'img.clerk.com',
      },
      {
        protocol: 'https',
        hostname: 'images.clerk.dev',
      },
      {
        protocol: 'https',
        hostname: '*.supabase.co',
      },
      {
        protocol: 'https',
        hostname: '*.amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: 'quanbylegal.com',
      },
    ],
  },

  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains',
          },
        ],
      },
      {
        // Allow PDF rendering in iframes for document viewer
        source: '/api/documents/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
        ],
      },
    ]
  },

  // Rewrites for API versioning
  async rewrites() {
    return []
  },

  // Webpack config for @react-pdf/renderer
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        canvas: false,
        fs: false,
        path: false,
        stream: false,
      }
    }
    return config
  },

  // Output configuration
  output: 'standalone',

  // Powered by header (remove for security)
  poweredByHeader: false,

  // Compression
  compress: true,
}

export default nextConfig
