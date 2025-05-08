/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  transpilePackages: [
    '@ant-design/pro-components',
    '@ant-design/icons',
    'antd',
    'lodash',
    'dayjs',
  ],
  images: {
    domains: ['localhost'],
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:4000/api/:path*',
      },
    ];
  },
  webpack: (config) => {
    // 支持monaco-editor
    config.resolve.alias = {
      ...config.resolve.alias,
      'next/router': require.resolve('next/router'),
      'next/navigation': require.resolve('next/navigation'),
    };
    return config;
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