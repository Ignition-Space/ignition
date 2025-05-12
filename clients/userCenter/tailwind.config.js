/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        bolt: {
          primary: '#0073E6',
          secondary: '#6B7280',
          success: '#10B981',
          warning: '#FBBF24',
          danger: '#EF4444',
          info: '#3B82F6',
        },
      },
    },
  },
  plugins: [],
  // 与Ant Design配合使用
  corePlugins: {
    preflight: false,
  },
  darkMode: 'class',
  important: true,
};
