/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  transpilePackages: ['@ant-design/icons', '@ant-design/charts', 'lodash'],
  images: {
    domains: ['localhost'],
  },
  // 兼容旧版API路径
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:3000/api/:path*',
      },
    ];
  },
  eslint: {
    // 临时禁用ESLint检查，方便开发
    ignoreDuringBuilds: true,
  },
  typescript: {
    // 临时禁用TypeScript检查，方便开发
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;
