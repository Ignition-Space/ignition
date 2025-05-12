# MongoDB 迁移指南

本文档提供了将 Ignition 平台从 MySQL 迁移到 MongoDB 的详细指南。

## 迁移概述

Ignition 平台已完成从 MySQL 到 MongoDB 的迁移，以便统一数据存储解决方案，简化应用架构并提高开发效率。

### 迁移范围

- **已完成**: DevOps服务已完全迁移到 MongoDB
- **已完成**: 物料服务已完全迁移到 MongoDB
- **已完成**: 用户服务和点火服务本就使用 MongoDB，无需迁移

## 迁移方法

迁移过程遵循以下步骤:

1. **实体转换**: 将 MySQL 实体类转换为 MongoDB 兼容的实体类
2. **数据访问层调整**: 修改服务和仓库以适应 MongoDB 的查询语法
3. **依赖注入配置**: 更新模块配置以使用 MongoDB 仓库
4. **数据迁移**: 从 MySQL 导出数据并导入到 MongoDB
5. **验证与测试**: 确保所有功能在迁移后正常工作

## 实体转换示例

### MySQL 实体 (旧):

```typescript
// project.entity.ts
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Project {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;
  
  @Column('simple-array')
  projectTypes: string[];
}
```

### MongoDB 实体 (新):

```typescript
// project.mongo.entity.ts
import { Entity, ObjectIdColumn, Column, ObjectId } from 'typeorm';

@Entity()
export class Project {
  @ObjectIdColumn()
  id: ObjectId;

  @Column()
  name: string;
  
  @Column('simple-array')
  projectTypes: string[];
}
```

## 数据访问层调整

### 注入方式变化:

```typescript
// 旧版
constructor(
  @Inject('PROJECT_REPOSITORY')
  private readonly projectRepository: Repository<Project>
) {}

// 新版
constructor(
  @Inject('PROJECT_REPOSITORY')
  private readonly projectRepository: MongoRepository<Project>
) {}
```

### 查询语法变化:

```typescript
// 旧版 (MySQL)
findById(id: number) {
  return this.projectRepository.findOne({
    where: { id }
  });
}

// 新版 (MongoDB)
findById(id: string) {
  return this.projectRepository.findOne({
    where: { _id: new ObjectId(id) }
  });
}

// 旧版 IN 查询 (MySQL)
findByTypes(types: string[]) {
  return this.projectRepository.find({
    where: {
      projectType: In(types)
    }
  });
}

// 新版 IN 查询 (MongoDB)
findByTypes(types: string[]) {
  return this.projectRepository.find({
    where: {
      projectType: { $in: types }
    }
  });
}
```

## 模块配置调整

```typescript
// 旧版
@Module({
  providers: [
    {
      provide: 'PROJECT_REPOSITORY',
      useFactory: (connection) => connection.getRepository(Project),
      inject: ['MYSQL_DEVOPS_DATA_SOURCE'],
    },
    ProjectService,
  ],
})

// 新版
@Module({
  providers: [
    {
      provide: 'PROJECT_REPOSITORY',
      useFactory: async (AppDataSource) => 
        await AppDataSource.getRepository(Project),
      inject: ['MONGODB_DATA_SOURCE'],
    },
    ProjectService,
  ],
})
```

## 关系型数据在 MongoDB 中的表示

### 一对一关系

```typescript
// MongoDB 文档
{
  _id: ObjectId("123"),
  name: "项目1",
  configuration: {  // 嵌入式文档表示一对一关系
    deployConfig: { /* 部署配置 */ },
    nacosConfig: { /* nacos配置 */ }
  }
}
```

### 一对多关系

```typescript
// 项目文档
{
  _id: ObjectId("123"),
  name: "项目1"
}

// 任务文档引用项目
{
  _id: ObjectId("456"),
  projectId: "123",  // 引用项目ID
  name: "任务1"
}
```

### 多对多关系

```typescript
// 项目与项目类型的多对多关系
{
  _id: ObjectId("123"),
  name: "项目1",
  projectTypes: ["web", "mobile", "desktop"]  // 引用数组
}
```

## 注意事项

1. **主键类型变更**: 从数字ID变为MongoDB的ObjectId
2. **查询语法差异**: MongoDB查询使用`$`操作符
3. **关系处理**: 根据关系类型选择不同的关系表示方法
4. **数据迁移**: 注意ID字段的转换和关系重建
5. **性能优化**: 确保为常用查询创建适当的索引

## 迁移后的优势

1. **统一数据存储**: 所有服务使用相同的数据库技术，简化部署和维护
2. **灵活的数据模型**: MongoDB的文档模型适应性更强，更容易应对需求变化
3. **横向扩展**: MongoDB原生支持分片和复制集，更容易实现系统扩展
4. **开发效率提升**: 统一的数据访问方式减少了上下文切换成本

## 常见问题排查

1. **ID类型错误**: MongoDB使用ObjectId而非数字ID，注意转换
2. **查询结果为空**: 检查查询条件是否使用了正确的MongoDB语法
3. **关系数据不完整**: 确保关系引用的ID正确转换

## 参考资源

- [TypeORM MongoDB文档](https://typeorm.io/#/mongodb)
- [MongoDB官方文档](https://docs.mongodb.com/)
- [NestJS文档](https://docs.nestjs.com/) 