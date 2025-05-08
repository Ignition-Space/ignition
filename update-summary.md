# 依赖更新摘要

## 主要更新内容

### 根项目
- 更新了 `packageManager` 从 `pnpm@6.32.4` 到 `pnpm@10.5.2`
- 更新了 `.npmrc` 配置，优化 pnpm 性能和兼容性
  - 添加了 `node-linker=hoisted` 配置
  - 添加了 `shamefully-hoist=true` 配置

### clients/userCenter
依赖升级：
- Next.js: `^14.1.0` → `^14.2.1`
- Ant Design: `^5.11.0` → `^5.15.0`
- @ant-design/icons: `^5.1.0` → `^5.3.0`
- @ant-design/charts: `^2.2.6` → `^2.2.7`
- axios: `^1.4.0` → `^1.6.7`
- react-use: `^17.4.0` → `^17.5.0`

开发依赖升级：
- TypeScript: `^5.0.4` → `^5.3.3`
- ESLint: `^8.41.0` → `^8.57.0`
- prettier: `^2.8.8` → `^3.2.5`
- eslint-config-next: `^14.1.0` → `^14.2.1`
- 所有 TypeScript 类型 (@types/*) 更新到最新版本

### clients/atom
依赖升级：
- Next.js: `^14.1.0` → `^14.2.1`
- Ant Design: `^5.9.4` → `^5.15.0`
- @ant-design/icons: `^5.2.6` → `^5.3.0`
- @ant-design/pro-components: `^2.3.9` → `^2.6.49`
- monaco-editor: `^0.45.0` → `^0.47.0`
- @monaco-editor/react: `^4.6.0` → `^4.6.1`
- less: `^4.1.3` → `^4.3.0`
- react-monaco-editor: `^0.50.1` → `^0.55.0`

开发依赖升级：
- TypeScript: `^5.0.2` → `^5.3.3`
- Node.js 类型: `^18.15.0` → `^20.12.5`
- ESLint: `^8.45.0` → `^8.57.0`
- autoprefixer: `^10.4.14` → `^10.4.18`
- tailwindcss: `^3.3.2` → `^3.4.1`
- eslint-config-next: `^14.1.0` → `^14.2.1`

### 配置文件更新
- 更新了 `.eslintrc.js`，添加了对 Next.js 的更好支持
  - 添加了 `ecmaVersion: 2022`
  - 禁用了 `@next/next/no-html-link-for-pages` 规则
  - 改进了服务端的未使用变量处理
- 更新了 `turbo.json`，更新了结构以符合 Turbo 最新版本要求
  - 从 `tasks` 更改为 `pipeline`
  - 添加了 `globalDependencies`

## 下一步操作
1. 如果遇到网络问题，请检查网络连接和代理设置
2. 安装依赖: `pnpm install`
3. 验证各个项目是否能够正常运行: 
   - 根项目: `pnpm run dev`
   - userCenter: `pnpm run dev:user`
   - atom: `pnpm run dev:atom`
4. 检查现有代码是否需要适应新版本依赖的变化 