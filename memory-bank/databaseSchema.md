# 数据库架构设计

## 概述

点火引擎（Ignition）项目使用两种数据库来满足不同的数据存储需求：

1. **MySQL**: 用于存储关系型数据，如用户、角色、权限等结构化数据
2. **MongoDB**: 用于存储非关系型数据，如材料内容、配置信息等

## MySQL数据库架构

### 用户权限数据库 (user_db)

#### users（用户表）
```sql
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  password VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  github_id VARCHAR(50) UNIQUE,
  avatar_url VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  last_login TIMESTAMP NULL,
  status ENUM('active', 'inactive', 'locked') DEFAULT 'active'
);
```

#### roles（角色表）
```sql
CREATE TABLE roles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE,
  description VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

#### permissions（权限表）
```sql
CREATE TABLE permissions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  code VARCHAR(100) NOT NULL UNIQUE,
  description VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

#### user_roles（用户-角色关联表）
```sql
CREATE TABLE user_roles (
  user_id INT NOT NULL,
  role_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, role_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE
);
```

#### role_permissions（角色-权限关联表）
```sql
CREATE TABLE role_permissions (
  role_id INT NOT NULL,
  permission_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (role_id, permission_id),
  FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
  FOREIGN KEY (permission_id) REFERENCES permissions(id) ON DELETE CASCADE
);
```

### 材料数据库 (material_db)

#### categories（分类表）
```sql
CREATE TABLE categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  parent_id INT NULL,
  description VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (parent_id) REFERENCES categories(id) ON DELETE SET NULL
);
```

#### tags（标签表）
```sql
CREATE TABLE tags (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

#### materials（材料表）
```sql
CREATE TABLE materials (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  summary TEXT,
  category_id INT,
  created_by INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  status ENUM('draft', 'published', 'archived') DEFAULT 'draft',
  content_id VARCHAR(24) NOT NULL, -- 对应MongoDB中的文档ID
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,
  FOREIGN KEY (created_by) REFERENCES users(id)
);
```

#### material_tags（材料-标签关联表）
```sql
CREATE TABLE material_tags (
  material_id INT NOT NULL,
  tag_id INT NOT NULL,
  PRIMARY KEY (material_id, tag_id),
  FOREIGN KEY (material_id) REFERENCES materials(id) ON DELETE CASCADE,
  FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
);
```

### DevOps数据库 (devops_db)

#### deployments（部署记录表）
```sql
CREATE TABLE deployments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  version VARCHAR(50) NOT NULL,
  environment ENUM('dev', 'test', 'staging', 'production') NOT NULL,
  status ENUM('pending', 'in_progress', 'success', 'failed') NOT NULL,
  started_at TIMESTAMP NOT NULL,
  completed_at TIMESTAMP NULL,
  initiated_by INT NOT NULL,
  log_path VARCHAR(255),
  FOREIGN KEY (initiated_by) REFERENCES users(id)
);
```

#### configurations（配置表）
```sql
CREATE TABLE configurations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  environment ENUM('dev', 'test', 'staging', 'production') NOT NULL,
  config_json TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  created_by INT NOT NULL,
  FOREIGN KEY (created_by) REFERENCES users(id)
);
```

## MongoDB数据库架构

### 材料内容数据库 (material_contents)

#### material_contents（材料内容集合）
```json
{
  "_id": ObjectId(), // 对应MySQL materials表中的content_id
  "content": "材料的详细内容，可以是富文本或HTML",
  "attachments": [
    {
      "filename": "attachment1.pdf",
      "path": "/path/to/attachment1.pdf",
      "size": 1024,
      "mimetype": "application/pdf"
    }
  ],
  "metadata": {
    "keywords": ["关键词1", "关键词2"],
    "author": "作者名称",
    "source": "来源"
  },
  "versions": [
    {
      "version": 1,
      "content": "原始内容",
      "updated_at": ISODate("2023-01-01T00:00:00Z"),
      "updated_by": "用户ID"
    }
  ],
  "created_at": ISODate("2023-01-01T00:00:00Z"),
  "updated_at": ISODate("2023-01-01T00:00:00Z")
}
```

### 用户设置数据库 (user_settings)

#### user_preferences（用户偏好设置集合）
```json
{
  "_id": ObjectId(),
  "user_id": 1, // 对应MySQL users表中的id
  "theme": "dark",
  "notification_settings": {
    "email": true,
    "browser": true,
    "mobile": false
  },
  "dashboard_layout": {
    "widgets": [
      {"id": "widget1", "position": {"x": 0, "y": 0, "w": 2, "h": 1}},
      {"id": "widget2", "position": {"x": 2, "y": 0, "w": 2, "h": 2}}
    ]
  },
  "recent_activities": [
    {
      "action": "viewed",
      "target": "material_id",
      "timestamp": ISODate("2023-01-01T00:00:00Z")
    }
  ],
  "updated_at": ISODate("2023-01-01T00:00:00Z")
}
```

### DevOps监控数据库 (devops_monitoring)

#### service_metrics（服务指标集合）
```json
{
  "_id": ObjectId(),
  "service_name": "user-service",
  "instance_id": "instance-001",
  "timestamp": ISODate("2023-01-01T00:00:00Z"),
  "metrics": {
    "cpu_usage": 25.5,
    "memory_usage": 512,
    "request_count": 1000,
    "error_count": 5,
    "response_time_avg": 120
  }
}
```

#### alerts（告警集合）
```json
{
  "_id": ObjectId(),
  "service_name": "user-service",
  "severity": "critical",
  "message": "高CPU使用率",
  "timestamp": ISODate("2023-01-01T00:00:00Z"),
  "resolved": false,
  "resolved_at": null,
  "metrics": {
    "cpu_usage": 95.5
  }
}
```

## 数据库关系图

### MySQL关系图

```
+-------------+       +-------------+       +---------------+
|    users    |       |    roles    |       |  permissions  |
+-------------+       +-------------+       +---------------+
| id          |       | id          |       | id            |
| username    |       | name        |       | name          |
| password    |       | description |       | code          |
| email       |       +-------------+       | description   |
| ...         |             ^               +---------------+
+-------------+             |                     ^
      ^                     |                     |
      |                     |                     |
      |               +------------+        +-------------+
      +-------------->| user_roles |        | role_perms  |
                      +------------+        +-------------+
                      | user_id    |        | role_id     |
                      | role_id    |        | perm_id     |
                      +------------+        +-------------+

+-------------+       +--------------+      +-------------+
|  categories |       |   materials  |      |    tags     |
+-------------+       +--------------+      +-------------+
| id          |       | id           |      | id          |
| name        |       | title        |      | name        |
| parent_id   |<----->| category_id  |      +-------------+
| description |       | created_by   |            ^
+-------------+       | content_id   |            |
                      +--------------+            |
                             |                    |
                             v                    |
                      +--------------+            |
                      | material_tags|------------+
                      +--------------+
                      | material_id  |
                      | tag_id       |
                      +--------------+
```

### MongoDB与MySQL关系图

```
MySQL                           MongoDB
+--------------+                +------------------+
|  materials   |                | material_contents|
+--------------+                +------------------+
| id           |                | _id              |
| title        |                | content          |
| content_id   |--------------->| attachments      |
+--------------+                | metadata         |
                                | versions         |
                                +------------------+

+--------------+                +------------------+
|    users     |                | user_preferences |
+--------------+                +------------------+
| id           |                | user_id          |
| username     |<---------------| theme            |
| email        |                | notifications    |
+--------------+                | dashboard_layout |
                                +------------------+
```

## 索引设计

### MySQL索引

#### users表
```sql
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_github_id ON users(github_id);
CREATE INDEX idx_users_status ON users(status);
```

#### materials表
```sql
CREATE INDEX idx_materials_category ON materials(category_id);
CREATE INDEX idx_materials_created_by ON materials(created_by);
CREATE INDEX idx_materials_status ON materials(status);
CREATE INDEX idx_materials_content_id ON materials(content_id);
```

#### deployments表
```sql
CREATE INDEX idx_deployments_environment ON deployments(environment);
CREATE INDEX idx_deployments_status ON deployments(status);
CREATE INDEX idx_deployments_initiated_by ON deployments(initiated_by);
```

### MongoDB索引

#### material_contents集合
```javascript
db.material_contents.createIndex({ "metadata.keywords": 1 });
db.material_contents.createIndex({ "created_at": 1 });
db.material_contents.createIndex({ "updated_at": 1 });
```

#### service_metrics集合
```javascript
db.service_metrics.createIndex({ "service_name": 1, "timestamp": -1 });
db.service_metrics.createIndex({ "instance_id": 1, "timestamp": -1 });
```

#### alerts集合
```javascript
db.alerts.createIndex({ "service_name": 1, "timestamp": -1 });
db.alerts.createIndex({ "resolved": 1, "severity": 1 });
```

## 数据迁移策略

### 初始化迁移

使用TypeORM的迁移功能创建初始数据库结构：

```typescript
import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1609459200000 implements MigrationInterface {
    name = 'InitialMigration1609459200000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // 创建users表
        await queryRunner.query(`
            CREATE TABLE users (
              id INT AUTO_INCREMENT PRIMARY KEY,
              username VARCHAR(50) NOT NULL UNIQUE,
              password VARCHAR(100) NOT NULL,
              email VARCHAR(100) NOT NULL UNIQUE,
              github_id VARCHAR(50) UNIQUE,
              avatar_url VARCHAR(255),
              created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
              updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
              last_login TIMESTAMP NULL,
              status ENUM('active', 'inactive', 'locked') DEFAULT 'active'
            )
        `);
        
        // 创建其他表...
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // 回滚操作
        await queryRunner.query(`DROP TABLE users`);
        // 删除其他表...
    }
}
```

### 种子数据

使用seed脚本填充初始数据：

```typescript
import { getConnection } from "typeorm";
import { User } from "../entities/user.entity";
import { Role } from "../entities/role.entity";
import { Permission } from "../entities/permission.entity";

async function seedDatabase() {
    // 创建权限
    const permissionsRepository = getConnection().getRepository(Permission);
    const userViewPermission = permissionsRepository.create({
        name: "View Users",
        code: "user:view",
        description: "Can view user list"
    });
    await permissionsRepository.save(userViewPermission);
    
    // 创建角色并分配权限
    const rolesRepository = getConnection().getRepository(Role);
    const adminRole = rolesRepository.create({
        name: "Administrator",
        description: "System administrator",
        permissions: [userViewPermission]
    });
    await rolesRepository.save(adminRole);
    
    // 创建用户并分配角色
    const usersRepository = getConnection().getRepository(User);
    const adminUser = usersRepository.create({
        username: "admin",
        password: "hashed_password", // 实际应用中使用散列密码
        email: "admin@example.com",
        roles: [adminRole]
    });
    await usersRepository.save(adminUser);
}

seedDatabase().catch(error => console.error(error));
```

## 数据备份策略

### MySQL备份计划
- **每日增量备份**: 使用binlog进行增量备份
- **每周完整备份**: 使用mysqldump进行完整备份
- **备份保留期**: 每日备份保留7天，每周备份保留4周
- **备份验证**: 每月进行备份还原测试

### MongoDB备份计划
- **每日备份**: 使用mongodump进行完整备份
- **备份保留期**: 保留7天的每日备份
- **备份验证**: 每月进行备份还原测试

## 数据访问模式

### 用户认证流程
1. 用户登录，查询users表验证凭据
2. 加载用户角色（user_roles和roles表）
3. 加载角色权限（role_permissions和permissions表）
4. 生成JWT令牌，包含用户ID、角色和权限信息

### 材料管理流程
1. 在MySQL中创建material记录，获取自增ID
2. 在MongoDB中创建material_content文档，使用自定义ID
3. 更新MySQL材料记录，设置content_id关联到MongoDB文档

### 查询优化
- 使用Redis缓存热门材料数据
- 实现用户权限的缓存机制
- 对复杂查询结果进行缓存

## 性能考量

### 分库分表策略
对于未来可能的高负载，考虑：
- **水平分表**: 按用户ID对users表进行分片
- **垂直分库**: 将日志和审计数据移至单独的数据库

### 高可用配置
- MySQL主从复制配置
- MongoDB副本集配置

### 监控指标
- 查询响应时间
- 连接池使用情况
- 慢查询日志分析
- 缓存命中率 