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
  experimental: {
    webVitalsAttribution: ['CLS', 'LCP'],
  },
  // Enable compression
  compress: true,
  // Optimize for mobile
  poweredByHeader: false,
}

export default nextConfig
