# Ignition 创意阶段数据模型设计

## 数据设计概述

Ignition系统使用混合数据存储策略，针对不同类型的数据选择最合适的存储解决方案：
- **MySQL**：存储结构化、关系复杂的数据（用户、角色、权限等）
- **MongoDB**：存储半结构化、模式灵活的数据（材料内容、元数据等）
- **Redis**：用于缓存和临时数据存储

本文档详细说明系统的数据模型设计和数据库模式。

## 实体关系模型

### 核心业务实体

```
┌───────────┐     ┌───────────┐     ┌───────────┐
│  用户     │     │  角色     │     │  权限     │
│ (User)    │─────│ (Role)    │─────│(Permission)│
└───────────┘     └───────────┘     └───────────┘
      │                                   │
      │                                   │
      ▼                                   ▼
┌───────────┐     ┌───────────┐     ┌───────────┐
│ 用户配置  │     │ 用户组    │     │ 操作日志  │
│(UserConfig)│     │(UserGroup)│     │(AuditLog) │
└───────────┘     └───────────┘     └───────────┘
```

### 材料管理实体

```
┌───────────┐     ┌───────────┐     ┌───────────┐
│  材料     │     │  分类     │     │  标签     │
│(Material) │─────│(Category) │─────│  (Tag)    │
└───────────┘     └───────────┘     └───────────┘
      │                 │                │
      └─────────────────┼────────────────┘
                        ▼
                  ┌───────────┐  
                  │ 材料版本  │  
                  │(Version)  │  
                  └───────────┘  
                        │
                        ▼
                  ┌───────────┐
                  │ 附件文件  │
                  │ (File)    │
                  └───────────┘
```

### DevOps管理实体

```
┌───────────┐     ┌───────────┐     ┌───────────┐
│  部署     │     │  配置     │     │  监控     │
│(Deployment)│─────│(Config)   │─────│(Monitoring)│
└───────────┘     └───────────┘     └───────────┘
      │                 │                │
      └─────────────────┼────────────────┘
                        ▼
                  ┌───────────┐  
                  │ 部署历史  │  
                  │(History)  │  
                  └───────────┘  
```

## 关系型数据库模式（MySQL）

### 用户管理模块

#### users表（用户表）

| 字段名          | 数据类型      | 约束           | 描述                   |
|----------------|--------------|----------------|------------------------|
| id             | varchar(36)  | PK             | 用户ID（UUID）          |
| username       | varchar(50)  | UNIQUE, NOT NULL| 用户名                 |
| email          | varchar(100) | UNIQUE, NOT NULL| 电子邮箱               |
| password_hash  | varchar(255) | NOT NULL       | 密码哈希                |
| full_name      | varchar(100) | NULL           | 用户全名                |
| avatar_url     | varchar(255) | NULL           | 头像URL                 |
| is_active      | boolean      | NOT NULL       | 账号是否激活            |
| is_admin       | boolean      | NOT NULL       | 是否管理员              |
| github_id      | varchar(50)  | NULL           | GitHub账号ID            |
| last_login     | timestamp    | NULL           | 最后登录时间            |
| created_at     | timestamp    | NOT NULL       | 创建时间                |
| updated_at     | timestamp    | NOT NULL       | 更新时间                |

#### roles表（角色表）

| 字段名          | 数据类型      | 约束           | 描述                   |
|----------------|--------------|----------------|------------------------|
| id             | varchar(36)  | PK             | 角色ID                 |
| name           | varchar(50)  | UNIQUE, NOT NULL| 角色名称               |
| description    | varchar(255) | NULL           | 角色描述                |
| is_system      | boolean      | NOT NULL       | 是否系统预设角色        |
| created_at     | timestamp    | NOT NULL       | 创建时间                |
| updated_at     | timestamp    | NOT NULL       | 更新时间                |

#### permissions表（权限表）

| 字段名          | 数据类型      | 约束           | 描述                   |
|----------------|--------------|----------------|------------------------|
| id             | varchar(36)  | PK             | 权限ID                 |
| code           | varchar(100) | UNIQUE, NOT NULL| 权限代码               |
| name           | varchar(100) | NOT NULL       | 权限名称                |
| description    | varchar(255) | NULL           | 权限描述                |
| module         | varchar(50)  | NOT NULL       | 所属模块                |
| created_at     | timestamp    | NOT NULL       | 创建时间                |
| updated_at     | timestamp    | NOT NULL       | 更新时间                |

#### user_roles表（用户-角色关联表）

| 字段名          | 数据类型      | 约束                | 描述                   |
|----------------|--------------|---------------------|------------------------|
| id             | varchar(36)  | PK                  | 关联ID                 |
| user_id        | varchar(36)  | FK, NOT NULL        | 用户ID                 |
| role_id        | varchar(36)  | FK, NOT NULL        | 角色ID                 |
| created_at     | timestamp    | NOT NULL            | 创建时间                |

#### role_permissions表（角色-权限关联表）

| 字段名          | 数据类型      | 约束                | 描述                   |
|----------------|--------------|---------------------|------------------------|
| id             | varchar(36)  | PK                  | 关联ID                 |
| role_id        | varchar(36)  | FK, NOT NULL        | 角色ID                 |
| permission_id  | varchar(36)  | FK, NOT NULL        | 权限ID                 |
| created_at     | timestamp    | NOT NULL            | 创建时间                |

#### user_groups表（用户组表）

| 字段名          | 数据类型      | 约束           | 描述                   |
|----------------|--------------|----------------|------------------------|
| id             | varchar(36)  | PK             | 用户组ID               |
| name           | varchar(100) | UNIQUE, NOT NULL| 用户组名称              |
| description    | varchar(255) | NULL           | 用户组描述              |
| created_at     | timestamp    | NOT NULL       | 创建时间                |
| updated_at     | timestamp    | NOT NULL       | 更新时间                |

#### user_group_members表（用户组成员表）

| 字段名          | 数据类型      | 约束                | 描述                   |
|----------------|--------------|---------------------|------------------------|
| id             | varchar(36)  | PK                  | 关联ID                 |
| group_id       | varchar(36)  | FK, NOT NULL        | 用户组ID               |
| user_id        | varchar(36)  | FK, NOT NULL        | 用户ID                 |
| created_at     | timestamp    | NOT NULL            | 创建时间                |

#### audit_logs表（审计日志表）

| 字段名          | 数据类型      | 约束           | 描述                   |
|----------------|--------------|----------------|------------------------|
| id             | varchar(36)  | PK             | 日志ID                 |
| user_id        | varchar(36)  | FK, NULL       | 操作用户ID（可空）      |
| action         | varchar(50)  | NOT NULL       | 操作类型                |
| resource_type  | varchar(50)  | NOT NULL       | 资源类型                |
| resource_id    | varchar(36)  | NULL           | 资源ID                 |
| details        | text         | NULL           | 操作详情（JSON格式）    |
| ip_address     | varchar(45)  | NULL           | IP地址                 |
| user_agent     | varchar(255) | NULL           | 用户代理                |
| created_at     | timestamp    | NOT NULL       | 创建时间                |

### DevOps模块

#### deployments表（部署表）

| 字段名          | 数据类型      | 约束           | 描述                   |
|----------------|--------------|----------------|------------------------|
| id             | varchar(36)  | PK             | 部署ID                 |
| name           | varchar(100) | NOT NULL       | 部署名称                |
| environment    | varchar(50)  | NOT NULL       | 环境（生产/测试/开发）  |
| status         | varchar(50)  | NOT NULL       | 部署状态                |
| service_id     | varchar(36)  | FK, NOT NULL   | 关联服务ID             |
| version        | varchar(50)  | NOT NULL       | 部署版本                |
| config_id      | varchar(36)  | FK, NULL       | 配置ID                 |
| created_by     | varchar(36)  | FK, NOT NULL   | 创建用户ID             |
| created_at     | timestamp    | NOT NULL       | 创建时间                |
| updated_at     | timestamp    | NOT NULL       | 更新时间                |

#### configs表（配置表）

| 字段名          | 数据类型      | 约束           | 描述                   |
|----------------|--------------|----------------|------------------------|
| id             | varchar(36)  | PK             | 配置ID                 |
| name           | varchar(100) | NOT NULL       | 配置名称                |
| environment    | varchar(50)  | NOT NULL       | 环境                   |
| version        | varchar(50)  | NOT NULL       | 配置版本                |
| is_active      | boolean      | NOT NULL       | 是否激活                |
| created_by     | varchar(36)  | FK, NOT NULL   | 创建用户ID             |
| created_at     | timestamp    | NOT NULL       | 创建时间                |
| updated_at     | timestamp    | NOT NULL       | 更新时间                |

#### deployment_history表（部署历史表）

| 字段名          | 数据类型      | 约束           | 描述                   |
|----------------|--------------|----------------|------------------------|
| id             | varchar(36)  | PK             | 历史记录ID             |
| deployment_id  | varchar(36)  | FK, NOT NULL   | 部署ID                 |
| status         | varchar(50)  | NOT NULL       | 部署状态                |
| started_at     | timestamp    | NOT NULL       | 开始时间                |
| ended_at       | timestamp    | NULL           | 结束时间                |
| logs           | text         | NULL           | 部署日志                |
| performed_by   | varchar(36)  | FK, NOT NULL   | 执行用户ID             |
| created_at     | timestamp    | NOT NULL       | 创建时间                |

## 文档型数据库模式（MongoDB）

### 材料管理模块

#### materials集合

```json
{
  "_id": "ObjectId",
  "title": "String",
  "description": "String",
  "type": "String",
  "status": "String",
  "content": "Object",
  "metadata": {
    "author": "String",
    "source": "String",
    "language": "String",
    "keywords": ["String"]
  },
  "categoryIds": ["String"],
  "tagIds": ["String"],
  "coverImage": "String",
  "viewCount": "Number",
  "likeCount": "Number",
  "createdBy": "String",
  "updatedBy": "String",
  "createdAt": "Date",
  "updatedAt": "Date",
  "versions": [{
    "versionNumber": "String",
    "content": "Object",
    "createdBy": "String",
    "createdAt": "Date",
    "comment": "String"
  }],
  "attachments": [{
    "fileId": "String",
    "fileName": "String",
    "fileSize": "Number",
    "fileType": "String",
    "uploadedBy": "String",
    "uploadedAt": "Date"
  }]
}
```

#### categories集合

```json
{
  "_id": "ObjectId",
  "name": "String",
  "description": "String",
  "parentId": "String",
  "path": "String",
  "level": "Number",
  "order": "Number",
  "isActive": "Boolean",
  "createdBy": "String",
  "updatedBy": "String",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

#### tags集合

```json
{
  "_id": "ObjectId",
  "name": "String",
  "description": "String",
  "type": "String",
  "color": "String",
  "usageCount": "Number",
  "createdBy": "String",
  "updatedBy": "String",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

### 监控模块

#### monitoring_metrics集合

```json
{
  "_id": "ObjectId",
  "serviceId": "String",
  "serviceName": "String",
  "metricType": "String",
  "metricName": "String",
  "value": "Number",
  "unit": "String",
  "timestamp": "Date",
  "tags": {
    "environment": "String",
    "instance": "String"
  },
  "createdAt": "Date"
}
```

#### monitoring_alerts集合

```json
{
  "_id": "ObjectId",
  "title": "String",
  "description": "String",
  "severity": "String",
  "status": "String",
  "serviceId": "String",
  "metricName": "String",
  "threshold": "Number",
  "currentValue": "Number",
  "triggeredAt": "Date",
  "resolvedAt": "Date",
  "notifiedUsers": ["String"],
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

## 缓存模型（Redis）

### 缓存键设计

| 键模式                            | 数据类型   | 用途                                | 过期时间  |
|----------------------------------|-----------|-------------------------------------|-----------|
| `auth:token:{userId}`            | String    | 用户JWT令牌                         | 1小时      |
| `auth:refresh:{userId}`          | String    | 刷新令牌                            | 7天        |
| `user:permissions:{userId}`      | Set       | 用户权限缓存                        | 30分钟     |
| `user:profile:{userId}`          | Hash      | 用户基本信息                        | 30分钟     |
| `material:view:{materialId}`     | String    | 材料访问计数器                      | 永久       |
| `material:hot`                   | SortedSet | 热门材料排行榜                      | 1天        |
| `rate:limit:{ip}:{endpoint}`     | String    | API访问频率限制                     | 1分钟      |
| `cache:query:{hash}`             | String    | 查询结果缓存                        | 10分钟     |

## 索引设计

### MySQL索引

#### users表索引
- 主键索引：`id`
- 唯一索引：`username`, `email`
- 普通索引：`is_active`, `created_at`

#### roles表索引
- 主键索引：`id`
- 唯一索引：`name`

#### permissions表索引
- 主键索引：`id`
- 唯一索引：`code`
- 普通索引：`module`

#### user_roles表索引
- 主键索引：`id`
- 复合索引：`(user_id, role_id)`

#### audit_logs表索引
- 主键索引：`id`
- 普通索引：`user_id`, `action`, `resource_type`, `created_at`

### MongoDB索引

#### materials集合索引
```
db.materials.createIndex({ "title": "text", "description": "text" }) // 全文搜索
db.materials.createIndex({ "categoryIds": 1 }) // 按分类查询
db.materials.createIndex({ "tagIds": 1 }) // 按标签查询
db.materials.createIndex({ "createdAt": -1 }) // 按创建时间倒序
db.materials.createIndex({ "status": 1, "createdAt": -1 }) // 复合索引
```

#### categories集合索引
```
db.categories.createIndex({ "parentId": 1 }) // 按父分类查询
db.categories.createIndex({ "path": 1 }) // 按路径查询
```

#### monitoring_metrics集合索引
```
db.monitoring_metrics.createIndex({ "serviceId": 1, "metricName": 1, "timestamp": -1 }) // 复合索引
db.monitoring_metrics.createIndex({ "timestamp": 1 }, { expireAfterSeconds: 2592000 }) // TTL索引，30天后自动删除
```

## 数据迁移和版本控制策略

1. **变更管理**：使用数据库迁移工具管理模式变更
   - 关系型数据库：TypeORM迁移
   - 文档型数据库：基于版本的模式验证器

2. **向后兼容**：设计变更时保证向后兼容性
   - 新增字段设置默认值
   - 避免重命名或删除字段，使用废弃标记
   - 数据库重构分阶段进行

3. **数据迁移工具**：
   - SQL迁移脚本
   - ETL流程定义
   - 数据验证工具

## 数据安全策略

1. **敏感数据加密**：
   - 密码使用bcrypt或Argon2哈希
   - 个人身份信息(PII)使用应用层加密
   - 透明数据加密(TDE)保护数据库文件

2. **数据访问控制**：
   - 数据库用户最小权限原则
   - 基于角色的数据访问控制
   - 行级安全策略(RLS)过滤敏感记录

3. **数据备份与恢复**：
   - 定期完整备份
   - 增量备份策略
   - 应用一致性快照
   - 灾难恢复流程

## 数据一致性策略

1. **事务管理**：
   - MySQL：ACID事务保证
   - MongoDB：在单文档操作上保证原子性

2. **分布式一致性**：
   - 最终一致性模型
   - 两阶段提交（必要时）
   - 补偿事务处理失败

3. **缓存一致性**：
   - 缓存失效策略
   - 写透策略
   - 按需加载

## 下一步工作

1. 细化数据库模式设计，包括约束和触发器
2. 完善索引策略，优化查询性能
3. 设计高级查询和报表功能
4. 制定数据备份和恢复策略
5. 实现数据访问层和ORM映射 