# DevOps服务

DevOps服务是火石平台的持续集成与持续部署系统。

## 功能概述

DevOps服务提供以下功能：

- 项目管理
- 迭代管理
- 构建部署
- 发布管理
- 第三方小程序管理

## 技术架构

- **框架**: NestJS
- **数据库**: MongoDB
- **CI/CD工具**: Jenkins
- **容器化**: Docker

## 设计原则

1. **自动化优先**: 所有重复任务实现自动化
2. **可追溯性**: 所有操作记录完整日志
3. **可扩展性**: 支持多种项目类型和部署环境
4. **可靠性**: 确保构建和部署过程稳定可靠

## 数据模型

DevOps系统使用MongoDB数据库，主要包含以下集合结构：

### 项目(Project)

```typescript
// 项目集合
{
  _id: ObjectId("..."),
  zhName: "项目中文名",
  usName: "project-english-name",
  desc: "项目描述",
  projectTypes: ["web", "mobile"],
  gitProjectId: 12345,
  gitNamespace: "team-name",
  gitProjectUrl: "https://git.example.com/team-name/project-name",
  gitProjectName: "project-name",
  gitProjectDesc: "Git项目描述",
  creatorName: "创建者",
  creatorId: 10001,
  createTime: ISODate("2023-01-01T00:00:00Z"),
  status: 1
}
```

### 迭代(Iteration)

```typescript
// 迭代集合
{
  _id: ObjectId("..."),
  projectId: ObjectId("..."),
  name: "v1.0.0",
  desc: "第一个版本",
  creatorId: 10001,
  creatorName: "创建者",
  branchName: "release/v1.0.0",
  createTime: ISODate("2023-01-15T00:00:00Z"),
  endTime: ISODate("2023-02-15T00:00:00Z"),
  status: 1
}
```

### 部署任务(Task)

```typescript
// 部署任务集合
{
  _id: ObjectId("..."),
  projectId: ObjectId("..."),
  iterationId: ObjectId("..."),
  processId: "process123",
  branch: "release/v1.0.0",
  env: "test",
  projectType: "web",
  status: 2,
  creatorName: "部署者",
  creatorId: 10001,
  startTime: ISODate("2023-01-20T10:00:00Z"),
  endTime: ISODate("2023-01-20T10:05:00Z"),
  queueId: 45678,
  buildId: 98765,
  desc: "测试环境部署"
}
```

### 操作记录(Operation)

```typescript
// 操作记录集合
{
  _id: ObjectId("..."),
  operationType: 1,
  record: {
    projectId: ObjectId("..."),
    iterationId: ObjectId("...")
  },
  operationTime: ISODate("2023-01-20T10:00:00Z"),
  operatorId: 10001,
  operatorName: "操作者"
}
```

## 主要模块

1. **项目模块**: 管理项目信息和配置
2. **迭代模块**: 管理项目迭代和版本
3. **分支模块**: 管理Git分支
4. **部署模块**: 执行构建和部署任务
5. **系统模块**: 管理系统配置和操作记录

## API接口

DevOps服务提供RESTful API，主要包括：

- `GET /api/projects`: 获取项目列表
- `POST /api/projects`: 创建新项目
- `GET /api/projects/:id`: 获取项目详情
- `PUT /api/projects/:id`: 更新项目信息
- `GET /api/projects/:id/iterations`: 获取项目迭代列表
- `POST /api/iterations`: 创建新迭代
- `POST /api/tasks`: 创建部署任务
- `GET /api/tasks`: 获取任务列表

## 部署流程

1. 接收部署请求
2. 验证参数和权限
3. 创建Jenkins任务
4. 监控任务执行状态
5. 记录部署结果
6. 通知用户部署结果

## 扩展能力

DevOps服务支持多种项目类型的扩展：

- Web前端项目
- 服务端项目
- 移动应用(iOS/Android)
- 小程序
- React Native应用

## 数据库迁移

DevOps服务已完成从MySQL到MongoDB的迁移，采用以下策略：

1. 创建与MongoDB兼容的实体类(.mongo.entity.ts)
2. 使用MongoDB的查询语法替代MySQL语法
3. 将Repository替换为MongoRepository
4. 将主键从自增ID替换为ObjectId
5. 调整关系表示方式，使用引用或嵌入文档

MongoDB的优势包括：
- 文档模型与对象模型更自然匹配
- 灵活的schema支持快速迭代
- 高性能的读写操作
- 易于横向扩展 