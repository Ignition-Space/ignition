# Memory Bank: 依赖更新记录

## 更新时间：2025-05-06

## 概述
本次更新将项目中的所有主要依赖包升级到最新版本，包括前端框架、UI库、工具链和类型定义。同时升级了项目的包管理器从旧版本 pnpm 到最新版本的 pnpm，以提高构建性能和依赖管理效率。

## 详细更新内容

### 包管理变更
- 包管理器从 `pnpm@6.32.4` 更新为 `pnpm@10.5.2`
- 更新了 `.npmrc` 配置，确保使用官方npm注册表
- 添加了 pnpm 性能优化配置：
  - `node-linker=hoisted` 
  - `shamefully-hoist=true`

### 前端框架升级
- Next.js: `^14.1.0` → `^14.2.1`（两个客户端项目）
- React相关类型库同步更新

### UI库升级
- Ant Design: `^5.11.0` → `^5.15.0`（userCenter）/ `^5.9.4` → `^5.15.0`（atom）
- @ant-design/icons: `^5.1.0` → `^5.3.0`（userCenter）/ `^5.2.6` → `^5.3.0`（atom）
- @ant-design/charts: `^2.2.6` → `^2.2.7`（userCenter）
- @ant-design/pro-components: `^2.3.9` → `^2.6.49`（atom）

### 编辑器相关升级（atom项目）
- monaco-editor: `^0.45.0` → `^0.47.0`
- @monaco-editor/react: `^4.6.0` → `^4.6.1`
- react-monaco-editor: `^0.50.1` → `^0.55.0`

### 开发工具链升级
- TypeScript: `^5.0.4` → `^5.3.3`（userCenter）/ `^5.0.2` → `^5.3.3`（atom）
- ESLint: `^8.41.0` → `^8.57.0`（userCenter）/ `^8.45.0` → `^8.57.0`（atom）
- prettier: `^2.8.8` → `^3.2.5`（userCenter）
- Prettier主版本升级（从2.x到3.x）注意事项：
  - 可能需要调整某些格式规则
  - 更严格的引号和缩进检查

### 构建工具升级
- autoprefixer: `^10.4.14` → `^10.4.18`
- postcss: `^8.4.23` → `^8.4.35`（userCenter）/ `^8.4.24` → `^8.4.35`（atom）
- tailwindcss: `^3.3.0` → `^3.4.1`（userCenter）/ `^3.3.2` → `^3.4.1`（atom）
- less: `^4.1.3` → `^4.3.0`（atom）

### 配置文件更新
- `.eslintrc.js` 
  - 添加了 `ecmaVersion: 2022`
  - 简化了Next.js扩展配置
  - 禁用了已弃用的 `@next/next/no-html-link-for-pages` 规则
  - 改进了服务端的未使用变量处理规则
- `turbo.json`
  - 从 `tasks` 更新为 `pipeline`（符合Turbo最新API）
  - 添加了 `globalDependencies` 配置

## 潜在的风险和注意事项
1. **Prettier 2.x → 3.x 升级**：可能需要重新格式化部分代码
2. **Next.js 14.1 → 14.2 升级**：需要检查路由和中间件的兼容性
3. **pnpm 6.x → 10.x 升级**：package.json中的脚本和命令结构可能需要调整

## 后续计划
1. 安装依赖: `pnpm install`
2. 运行构建验证：`pnpm run build`
3. 运行各子项目验证：
   - 用户中心: `pnpm run dev:user`
   - Atom编辑器: `pnpm run dev:atom`
4. 创建更多自动化测试，确保未来依赖升级时能快速验证

## 参考资源
- [Next.js 14.2 更新日志](https://nextjs.org/blog/next-14-2)
- [Prettier 3.0 迁移指南](https://prettier.io/docs/en/option-philosophy)
- [Ant Design 5.15.0 更新日志](https://github.com/ant-design/ant-design/releases/tag/5.15.0)
- [pnpm 10.x 新特性](https://pnpm.io/blog/2023/10/18/pnpm-next) 