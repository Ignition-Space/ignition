# 系统模式

## 架构模式

### 微服务架构
项目采用微服务架构，将不同功能模块拆分为独立的服务，每个服务可以独立开发、部署和扩展。

```
┌────────────────┐   ┌────────────────┐   ┌────────────────┐
│   userServer   │   │ materialsServer│   │  devopsServer  │
└───────┬────────┘   └───────┬────────┘   └───────┬────────┘
        │                    │                    │
        └──────────┬─────────┴──────────┬────────┘
                   │                    │
          ┌────────▼────────┐  ┌────────▼────────┐
          │  API Gateway    │  │  Discovery Svc  │
          └────────┬────────┘  └────────┬────────┘
                   │                    │
                   └──────────┬─────────┘
                              │
                      ┌───────▼────────┐
                      │    Clients     │
                      └────────────────┘
```

### Monorepo结构
使用pnpm Workspace和Turborepo管理多个包和应用，实现代码共享和构建优化。

```
ignition/
├── apps/
│   ├── userServer/
│   ├── materialsServer/
│   ├── devopsServer/
│   └── ignitionServer/
├── clients/
│   └── user-center/
├── libs/
│   ├── shared-ui/
│   ├── shared-utils/
│   └── auth/
├── types/
└── tools/
```

## 设计模式

### 依赖注入模式
NestJS框架使用依赖注入模式，实现松耦合和可测试性。

```typescript
// 服务定义
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}
  
  // 服务方法...
}

// 控制器注入服务
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}
  
  // 控制器方法...
}
```

### 仓储模式
使用TypeORM实现仓储模式，隔离数据访问逻辑。

```typescript
@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async findByUsername(username: string): Promise<User | undefined> {
    return this.findOne({ where: { username } });
  }
  
  // 其他查询方法...
}
```

### 工厂模式
使用工厂模式创建复杂对象。

```typescript
export class LoggerFactory {
  static createLogger(context: string): Logger {
    return new Logger(context);
  }
}
```

### 策略模式
使用策略模式处理不同的认证方式。

```typescript
export interface AuthStrategy {
  validate(credentials: any): Promise<User>;
}

@Injectable()
export class LocalStrategy implements AuthStrategy {
  constructor(private readonly userService: UserService) {}
  
  async validate(credentials: { username: string; password: string }): Promise<User> {
    // 本地验证实现...
  }
}

@Injectable()
export class GithubStrategy implements AuthStrategy {
  constructor(private readonly userService: UserService) {}
  
  async validate(profile: any): Promise<User> {
    // GitHub验证实现...
  }
}
```

## 数据模式

### RBAC权限模型
使用基于角色的访问控制模型管理用户权限。

```
┌──────────┐     ┌──────────┐     ┌──────────┐
│   User   │──┬──│   Role   │──┬──│Permission│
└──────────┘  │  └──────────┘  │  └──────────┘
              │                │
              │  n         n  │
              ▼                ▼
        ┌──────────┐    ┌──────────┐
        │User_Role │    │Role_Perm │
        └──────────┘    └──────────┘
```

### 材料数据模型
材料管理系统的核心数据模型。

```
┌──────────┐     ┌──────────┐
│ Material │──┬──│ Category │
└──────────┘  │  └──────────┘
              │
              │  n
              ▼
        ┌──────────┐
        │   Tag    │
        └──────────┘
```

## 接口模式

### RESTful API
采用RESTful风格设计API，遵循资源命名和HTTP方法语义。

```
GET    /api/users          # 获取用户列表
GET    /api/users/:id      # 获取特定用户
POST   /api/users          # 创建新用户
PUT    /api/users/:id      # 更新特定用户
DELETE /api/users/:id      # 删除特定用户
```

### GraphQL API (可选)
为复杂数据查询提供GraphQL接口。

```graphql
type User {
  id: ID!
  username: String!
  email: String!
  roles: [Role!]!
}

type Role {
  id: ID!
  name: String!
  permissions: [Permission!]!
}

type Query {
  user(id: ID!): User
  users: [User!]!
}

type Mutation {
  createUser(input: CreateUserInput!): User!
  updateUser(id: ID!, input: UpdateUserInput!): User!
  deleteUser(id: ID!): Boolean!
}
```

## 技术选择

### 后端技术栈
- 框架: NestJS
- ORM: TypeORM (MySQL)
- ODM: Mongoose (MongoDB)
- 认证: Passport.js, JWT
- API文档: Swagger
- 缓存: Redis

### 前端技术栈
- 框架: React
- UI库: Ant Design
- 状态管理: Redux/Zustand
- 路由: React Router
- 类型: TypeScript
- 构建: Vite

### DevOps工具链
- 容器化: Docker
- 编排: Docker Compose
- CI/CD: Jenkins
- 监控: Prometheus + Grafana 