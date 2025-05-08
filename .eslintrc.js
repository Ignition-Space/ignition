module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
    ecmaVersion: 2022,
  },
  plugins: ['@typescript-eslint/eslint-plugin'],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: [
    '.eslintrc.js',
    'node_modules/',
    '**/node_modules/',
    '**/.next/**',
    'dist/',
    '**/dist/**',
  ],
  overrides: [
    {
      files: ['clients/**/*.tsx', 'clients/**/*.ts'],
      extends: ['next/core-web-vitals'],
      rules: {
        // 客户端特定规则
        'react-hooks/rules-of-hooks': 'error',
        'react-hooks/exhaustive-deps': 'warn',
        '@next/next/no-html-link-for-pages': 'off',
      }
    },
    {
      files: ['apps/**/*.ts'],
      rules: {
        // 服务端特定规则
        '@typescript-eslint/no-unused-vars': ['warn', {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_'
        }],
      }
    }
  ],
  rules: {
    "prettier/prettier": ["error", { "endOfLine": "auto" }],
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off'
  },
};
