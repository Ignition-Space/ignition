# 依赖管理指南

## 依赖管理工具

本项目使用 **pnpm** 作为包管理工具。必须使用 pnpm 进行所有依赖管理操作，禁止使用其他包管理工具（如 npm 或 yarn）。

当前使用版本：`pnpm@10.5.2`

## 项目结构

项目采用 Monorepo 结构，使用 Turborepo 管理工作区：

- `/apps/*` - 后端服务（NestJS）
- `/clients/*` - 前端应用（Next.js）
- `/libs/*` - 共享库

## 依赖更新流程

### 自动更新（推荐）

我们提供了自动更新脚本，可以一键更新所有项目的依赖：

```bash
./upgrade-pnpm-deps.sh
```

脚本执行以下操作：
1. 检查 pnpm 安装状态
2. 更新根项目依赖
3. 更新所有客户端项目依赖
4. 更新所有服务端项目依赖
5. 清理并重新安装所有依赖
6. 验证项目构建

### 手动更新

如需手动更新特定项目的依赖：

**根项目**：
```bash
pnpm update --latest
```

**特定客户端或服务端项目**：
```bash
cd clients/userCenter
pnpm update --latest
```

## 安装新依赖

### 安装根项目依赖
```bash
pnpm add <package-name> [-D]  # -D 表示开发依赖
```

### 安装特定项目依赖
```bash
pnpm --filter <project-name> add <package-name> [-D]
```

例如：
```bash
# 安装到 user-center 项目
pnpm --filter user-center add axios

# 安装到 atom 项目
pnpm --filter atom add lodash
```

## 依赖版本控制策略

- 对于前端框架（Next.js、React）：使用补丁和小版本自动更新（^x.y.z）
- 对于 UI 库（Ant Design）：使用补丁和小版本自动更新（^x.y.z）
- 对于工具库：使用最新版本，除非有特定兼容性问题
- 对于类型定义：与对应库保持同步版本

## 常见问题排解

### 1. 依赖冲突

如果遇到依赖冲突，可以尝试：

```bash
# 清理所有依赖和缓存
pnpm clean
pnpm store prune
pnpm install
```

### 2. pnpm 版本不匹配

如果提示 pnpm 版本不匹配，请全局安装正确版本：

```bash
npm install -g pnpm@10.5.2
```

### 3. 构建失败

构建失败时，可以尝试：

```bash
# 清理 Turbo 缓存
pnpm clean
rm -rf .turbo
pnpm install
pnpm build
```

## 当前依赖版本

上次依赖更新时间：2025-05-06

主要依赖版本：
- Next.js: ^14.2.1
- React: ^18.2.0
- Ant Design: ^5.15.0
- NestJS: ^10.3.11
- TypeScript: ^5.3.3

完整的依赖更新记录请参阅 [dependencyUpdates.md](./dependencyUpdates.md)。 