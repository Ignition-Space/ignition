# DevOps系统

DevOps系统是火石平台的自动化部署与持续集成服务，为项目提供全流程的CI/CD能力。

## 核心功能

- **自动化构建**: 支持多种项目类型的自动构建
- **持续集成**: 与GitHub等代码仓库集成，实现代码提交后自动触发构建
- **持续部署**: 支持多环境一键部署
- **环境管理**: 提供开发、测试、预发布、生产等环境管理
- **流水线配置**: 可视化配置CI/CD流水线
- **构建监控**: 实时监控构建状态和日志
- **质量门禁**: 支持代码质量检测和测试覆盖率要求

## 技术架构

- 基于NestJS框架构建
- 使用MySQL存储配置信息和任务记录
- 集成Jenkins/GitHub Actions等CI/CD工具
- 支持Docker容器化部署

## 启动服务

```bash
# 开发环境启动
pnpm dev-server:devops
```

## API文档

启动服务后，访问以下地址查看API文档：

```
http://localhost:3000/doc
```

## 数据库设计

DevOps系统使用MySQL数据库，主要包含以下表结构：

- `projects`: 项目信息
- `pipelines`: 流水线配置
- `builds`: 构建记录
- `deployments`: 部署记录
- `environments`: 环境配置

## 使用流程

1. 创建项目并配置代码仓库
2. 配置构建和部署流水线
3. 触发构建（手动或Git提交触发）
4. 查看构建状态和日志
5. 选择目标环境进行部署

## 与其他系统的集成

DevOps系统与以下系统进行了集成：

- **用户系统**: 获取用户认证和权限信息
- **物料系统**: 实现物料的自动构建和发布
- **点火服务**: 提供服务部署状态信息

## 支持的项目类型

- React/Vue前端项目
- Node.js服务端项目
- Java/Spring Boot项目
- 容器化应用

## 流水线示例

```yaml
# 基本流水线示例
name: 基础Web应用流水线
stages:
  - name: 构建
    steps:
      - name: 安装依赖
        command: pnpm install
      - name: 代码检查
        command: pnpm lint
      - name: 单元测试
        command: pnpm test
      - name: 构建
        command: pnpm build
  - name: 部署
    environments:
      - dev
      - test
      - prod
    steps:
      - name: 部署
        command: deploy.sh ${ENV}
```

## 后续计划

- [ ] 支持更多CI/CD工具集成
- [ ] 增强监控和报警功能
- [ ] 实现自动回滚
- [ ] 添加部署审批流程 