# 火石（Ignition）

<p align="center">一站式工程化解决方案</p>

![系统概览](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d720ef26d4234208966dfc3da7f47306~tplv-k3u1fbpfcp-watermark.image?)

## 功能清单

✅ 已完成 ⭐️ 完善中 ❌ 未开始

✅ 用户系统【完善中】- RBAC权限管理与身份认证
✅ 物料系统【已完成】- 组件物料管理
⭐️ Devops 系统【待完善】- CI/CD流程自动化
⭐️ 搭建系统【待完善】- 低代码搭建平台

## 项目结构

```
ignition/
├── apps/                  # 服务端应用
│   ├── userServer/        # 用户服务 - 用户认证与权限管理
│   ├── materialsServer/   # 物料服务 - 组件物料管理
│   ├── ignitionServer/    # 点火服务 - 核心服务
│   └── devopsServer/      # DevOps服务 - CI/CD自动化
├── clients/               # 客户端应用
│   ├── userCenter/        # 用户中心 - 用户界面
│   └── atom/              # 原子组件库 - 基础组件
├── libs/                  # 共享库
├── docs/                  # 文档目录
└── .cursor/rules/         # Cursor规则
```

## 技术栈

- **后端**：NestJS + TypeORM + MongoDB + MySQL
- **前端**：React + Next.js + Ant Design + TailwindCSS
- **工程化**：PNPM Workspace + Turbo + TypeScript

## 安装

```bash
$ pnpm i
```

## 配置

添加 `.config/.dev.yaml` 文件：

```yaml
MONGODB_CONFIG:
  name: "ignition_test"
  type: "mongodb"
  url: "mongodb://127.0.0.1:27017"
  database: "ignition_test"
  entities: "mongo"
  logging: false
  synchronize: true

MYSQL_CONFIG:
  name: "material_test"
  type: "mysql"
  host: "127.0.0.1"
  port: 3306
  database: "material_test"
  username: "root"
  password: "123456"
  entities: "mysql"
  synchronize: true

MYSQL_DEVOPS_CONFIG:
  name: "devops_test"
  type: "mysql"
  host: "127.0.0.1"
  port: 3306
  username: "root"
  password: "123456"
  database: "devops_test"
  entities: "mysql"
  logging: false
  synchronize: true

GITGUB_CONFIG:
  CLIENT_ID: ''
  CLIENT_SECRETS: ''

FEISHU_CONFIG:
  FEISHU_APP_ID: ''
  FEISHU_APP_SECRET: ''
```

## 启动项目

### 启动所有项目
```bash
pnpm dev
```

### 启动特定项目
```bash
# 启动用户系统
pnpm dev:user

# 启动原子组件库
pnpm dev:atom
```

### 访问项目
```
http://localhost:3000/doc   # 服务端 API 文档
http://localhost:8000/      # 客户端界面
```

![系统界面](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d1101a963c784de8b9f970bf86545095~tplv-k3u1fbpfcp-watermark.image?)

## 创建 Demo 项目

解析 URL 可以填入 `http://localhost:3000/doc-json`，将 ignition-server 的服务作为 Demo 演示。

## 子项目文档

- [用户系统](./docs/user-center.md)
- [物料系统](./docs/materials-server.md)
- [点火服务](./docs/ignition-server.md)
- [DevOps系统](./docs/devops-server.md)
- [用户中心客户端](./docs/user-center-client.md)
- [原子组件库](./docs/atom-client.md)

## 支持

有想催更跟建议的朋友可以添加我的微信: **Cookieboty** 进群同步消息。

![微信二维码](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d6fb48debdfe4a88a81fd5bedbbea23f~tplv-k3u1fbpfcp-watermark.image?)
![121663845161_.pic.jpg](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d6fb48debdfe4a88a81fd5bedbbea23f~tplv-k3u1fbpfcp-watermark.image?)