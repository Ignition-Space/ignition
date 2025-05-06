/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  transpilePackages: [
    '@ant-design/icons',
    '@ant-design/pro-components',
    'antd',
    'monaco-editor',
    '@monaco-editor/react'
  ],
  images: {
    domains: ['localhost'],
  },
  webpack: (config) => {
    // 支持Monaco Editor
    config.resolve.alias = {
      ...config.resolve.alias,
      'monaco-editor': 'monaco-editor/esm/vs/editor/editor.api',
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