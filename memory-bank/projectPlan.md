# 点火引擎（Ignition）项目规划

## 项目概述

点火引擎是一个基于NestJS的多服务Monorepo项目，使用pnpm和Turborepo进行包管理和构建。项目包含多个微服务和客户端应用，支持用户权限管理、材料管理和DevOps功能。

## 系统架构

### 服务端架构
- **NestJS框架**：用于构建可扩展的服务端应用
- **多服务结构**：
  - `userServer`: 用户认证和权限管理
  - `materialsServer`: 材料管理
  - `devopsServer`: DevOps工具集成
  - `ignitionServer`: 主服务

### 客户端架构
- **React + AntD**：用于构建用户界面
- **前后端分离**：API与UI完全分离

### 数据存储
- **MySQL**：关系型数据存储
- **MongoDB**：文档型数据存储
- **Redis**：缓存服务

## 功能模块

### 用户权限模块
- 基于GitHub的三方登录
- RBAC用户权限管理系统

### 材料管理模块
- 材料资源管理
- 资源分类与检索

### DevOps模块
- CI/CD集成
- 部署管理

## 技术栈

### 后端
- NestJS
- TypeORM
- Mongoose
- JWT认证
- Swagger API文档

### 前端
- React
- AntD组件库
- TypeScript

### 部署与运维
- Docker
- Docker Compose

## 环境配置

### 开发环境
- Node.js (v14+)
- pnpm (v6.32.4)
- Docker & Docker Compose
- MySQL & MongoDB

### 测试环境
- 单元测试：Jest
- E2E测试：Supertest

### 生产环境
- 容器化部署
- 负载均衡

## 数据库设计

### 用户数据库
- 用户表
- 角色表
- 权限表
- 用户-角色关联表
- 角色-权限关联表

### 材料数据库
- 材料表
- 分类表
- 标签表

## 开发流程

### 环境搭建
1. 安装Node.js和pnpm
2. 配置Docker环境
3. 启动MySQL、MongoDB和Redis服务
4. 创建必要的数据库
5. 复制.dev.yaml.example为.dev.yaml并配置

### 开发步骤
1. 服务端API开发
2. 客户端界面开发
3. 集成测试
4. 性能优化

### 构建与部署
1. 使用Turbo进行构建
2. 创建Docker镜像
3. 使用Docker Compose启动服务

## 时间线规划

### 阶段一：环境搭建与基础功能（2周）
- 环境配置
- 用户认证模块
- 基础UI框架

### 阶段二：核心功能开发（4周）
- 用户权限管理
- 材料管理系统
- 基础DevOps集成

### 阶段三：高级功能与优化（3周）
- 高级权限控制
- 报表与分析
- 性能优化

### 阶段四：测试与部署（1周）
- 全面测试
- 生产环境部署
- 监控系统集成

## 风险管理

### 技术风险
- 依赖版本兼容性问题
- 数据库性能瓶颈
- 安全漏洞

### 解决方案
- 明确锁定依赖版本
- 数据库索引优化与分片
- 安全审计与漏洞扫描

## 团队分工

### 后端团队
- NestJS微服务开发
- 数据库设计与优化
- API文档维护

### 前端团队
- React组件开发
- 用户界面设计
- 前后端集成

### DevOps团队
- CI/CD流程建设
- 环境配置管理
- 监控告警系统 