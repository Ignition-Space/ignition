# 物料服务

物料服务是火石平台的核心组件之一，负责管理前端组件、页面模板和样式物料等资源。

## 功能概述

物料服务提供以下核心功能：

- 物料资源管理：注册、发布、更新和删除物料
- 版本控制：管理物料的多版本发布和迭代
- 分类管理：对物料进行分类和标签管理
- 物料审核：维护物料质量和一致性
- 物料搜索：通过关键词和标签快速查找物料
- CDN发布：自动将物料发布到CDN

## 技术架构

- **框架**: NestJS
- **数据库**: MongoDB
- **存储**: MinIO/对象存储
- **缓存**: Redis

## 设计原则

物料服务设计遵循以下原则：

1. **标准化**: 物料结构和接口统一标准
2. **可扩展性**: 支持多种物料类型的扩展
3. **高效检索**: 优化物料查找和推荐机制
4. **版本兼容**: 确保新旧版本物料兼容

## 数据模型

物料系统使用MongoDB数据库，主要包含以下集合结构：

### 物理物料(PhysicalMaterial)

```typescript
// 物理物料集合
{
  _id: ObjectId("..."),
  zhName: "按钮组件",
  usName: "button",
  desc: "通用按钮组件，支持多种样式和状态",
  groupId: ObjectId("..."),  // 所属分组
  materialType: 1,           // 物料类型：0=cdn, 1=npm, 2=code
  createDate: ISODate("2023-01-01T00:00:00Z"),
  updateDate: ISODate("2023-02-01T00:00:00Z"),
  updateUser: "admin",
  tags: ["UI", "交互", "基础组件"]
}
```

### 虚拟物料(VirtualMaterial)

```typescript
// 虚拟物料集合
{
  _id: ObjectId("..."),
  zhName: "登录页模板",
  usName: "login-template",
  desc: "标准登录页面模板，包含多种登录方式",
  groupId: ObjectId("..."),
  createDate: ISODate("2023-01-10T00:00:00Z"),
  updateDate: ISODate("2023-01-15T00:00:00Z"),
  updateUser: "designer1"
}
```

### 物料配置(MaterialConfig)

```typescript
// 物料配置集合
{
  _id: ObjectId("..."),
  materialId: ObjectId("..."),  // 关联物料ID
  env: "production",           // 环境
  version: "1.0.0",            // 版本号
  contain: {                   // 配置内容
    dependencies: {
      "react": "^17.0.0"
    },
    peerDependencies: {
      "lodash": "^4.0.0"
    }
  },
  cdn: "https://cdn.example.com/materials/button/1.0.0/"
}
```

### 物料分组(Group)

```typescript
// 物料分组集合
{
  _id: ObjectId("..."),
  name: "基础组件",
  desc: "系统基础UI组件",
  creatorName: "admin",
  creatorId: 10001,
  createDate: ISODate("2022-12-01T00:00:00Z"),
  updateDate: ISODate("2022-12-01T00:00:00Z"),
  status: 1
}
```

## 主要API

### 物料管理

- `GET /api/materials`: 获取物料列表
- `POST /api/materials`: 创建新物料
- `GET /api/materials/:id`: 获取物料详情
- `PUT /api/materials/:id`: 更新物料信息
- `DELETE /api/materials/:id`: 删除物料

### 版本管理

- `GET /api/materials/:id/versions`: 获取物料版本列表
- `POST /api/materials/:id/versions`: 发布新版本
- `GET /api/materials/:id/versions/:version`: 获取特定版本详情

### 分组管理

- `GET /api/groups`: 获取分组列表
- `POST /api/groups`: 创建新分组
- `PUT /api/groups/:id`: 更新分组信息

## 物料发布流程

1. 开发者创建新物料或更新现有物料
2. 提交物料审核
3. 审核通过后，系统自动构建物料包
4. 生成不同格式的物料资源（NPM包、CDN资源）
5. 更新物料元数据和版本信息
6. 发布成功通知

## 物料使用流程

1. 用户在平台搜索并找到所需物料
2. 查看物料文档和示例
3. 通过NPM安装或直接使用CDN引用
4. 根据文档在项目中集成物料

## 数据库迁移

物料服务已完成从MySQL到MongoDB的迁移，采用以下策略：

1. 创建与MongoDB兼容的实体类(.mongo.entity.ts)
2. 使用MongoDB的查询语法替代MySQL语法
3. 将Repository替换为MongoRepository
4. 将主键从自增ID替换为ObjectId
5. 使用MongoDB文档模型优化了物料数据结构，更好地支持复杂的嵌套属性

MongoDB的优势在物料服务中体现：
- 更灵活地存储不同类型物料的扩展属性
- 更高效地处理物料的嵌套结构数据
- 简化版本控制的实现
- 提高了物料搜索和过滤的性能

## 启动服务

```bash
# 启动物料服务
pnpm dev-server:materials
```

## API文档

启动服务后，访问以下地址查看API文档：

```
http://localhost:3000/doc
```

## 与其他系统的集成

物料系统与以下系统进行了集成：

- **点火服务**: 提供物料给点火服务使用
- **搭建系统**: 为低代码搭建平台提供组件物料
- **DevOps系统**: 实现物料的自动化发布流程

## 后续计划

- [ ] 支持更多物料类型
- [ ] 优化物料搜索和筛选功能
- [ ] 增强物料预览能力
- [ ] 添加物料使用数据统计 