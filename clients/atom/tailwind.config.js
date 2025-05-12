/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class', // 启用类名控制的暗色模式
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f6ff',
          100: '#e0edfe',
          200: '#c1dbfc',
          300: '#9bc1f9',
          400: '#759df5',
          500: '#5877ed',
          600: '#4156e0',
          700: '#3542c8',
          800: '#2e39a2',
          900: '#29347d',
          950: '#1c2057',
        },
      },
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          '"Helvetica Neue"',
          'Arial',
          'sans-serif',
        ],
      },
      boxShadow: {
        subtle: '0 2px 8px rgba(0, 0, 0, 0.05)',
        card: '0 4px 12px rgba(0, 0, 0, 0.08)',
      },
    },
  },
  plugins: [],
  // 与Ant Design配合使用
  corePlugins: {
    preflight: false,
  },
  important: true,
}; 