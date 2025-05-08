# 开发指南

## 环境设置

### 必要软件
- **Node.js**: v14.0.0 或更高版本
- **pnpm**: v6.32.4（项目指定版本）
- **Docker & Docker Compose**: 最新版本
- **Git**: 最新版本

### 安装pnpm指定版本
```bash
# 安装pnpm
npm install -g pnpm@6.32.4
```

### 克隆项目
```bash
git clone <repository-url>
cd ignition
```

### 安装依赖
```bash
pnpm install
```

### 启动开发环境
1. 启动数据库容器
```bash
cd docker
docker-compose up -d mysql mongodb
```

2. 创建配置文件
```bash
cp .config/.dev.yaml.example .config/.dev.yaml
```
编辑`.config/.dev.yaml`文件，配置数据库连接信息和其他必要配置。

3. 启动开发服务器
```bash
# 启动所有服务
pnpm dev

# 或启动特定服务
pnpm dev:user  # 用户服务
pnpm dev:ig    # Ignition服务
```

## 项目结构

### 主要目录
- `apps/`: 应用服务器
  - `userServer/`: 用户认证和权限管理服务
  - `materialsServer/`: 材料管理服务
  - `devopsServer/`: DevOps工具服务
  - `ignitionServer/`: 主服务
- `clients/`: 客户端应用
- `libs/`: 共享库
- `types/`: 共享类型定义
- `tools/`: 开发工具
- `docker/`: Docker配置
- `.config/`: 项目配置文件

### 重要文件
- `package.json`: 项目依赖和脚本
- `pnpm-workspace.yaml`: pnpm工作区配置
- `turbo.json`: Turborepo配置
- `tsconfig.json`: TypeScript配置
- `nest-cli.json`: NestJS CLI配置

## 开发规范

### 代码风格
项目使用ESLint和Prettier强制执行代码风格：
```bash
# 格式化代码
pnpm format
```

### 提交规范
提交信息格式：
```
<type>(<scope>): <subject>

<body>

<footer>
```

类型（type）:
- `feat`: 新功能
- `fix`: 修复bug
- `docs`: 文档更新
- `style`: 代码风格变更（不影响代码运行）
- `refactor`: 重构（不新增功能也不修复bug）
- `perf`: 性能优化
- `test`: 增加测试
- `chore`: 构建过程或辅助工具变动

### 分支管理
- `main`: 主分支，保持稳定
- `develop`: 开发分支
- `feature/*`: 功能分支
- `bugfix/*`: 修复分支
- `release/*`: 发布分支

## API开发指南

### 创建新模块
```bash
# 创建用户模块
cd apps/userServer
nest g module users
nest g controller users
nest g service users
```

### 定义实体
```typescript
// 用户实体示例
import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable } from 'typeorm';
import { Role } from './role.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column({ unique: true })
  email: string;

  @ManyToMany(() => Role)
  @JoinTable()
  roles: Role[];
}
```

### 创建DTO
```typescript
// 创建用户DTO示例
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsEmail()
  email: string;
}
```

### 实现控制器和服务
```typescript
// 用户控制器示例
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }
}

// 用户服务示例
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = this.userRepository.create(createUserDto);
    return this.userRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findOne(id: number): Promise<User> {
    return this.userRepository.findOneOrFail(id);
  }
}
```

## 前端开发指南

### 创建新组件
```tsx
// React组件示例
import { useState, useEffect } from 'react';
import { Table, Button, message } from 'antd';
import { userService } from '../services/user.service';

export const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await userService.getUsers();
      setUsers(data);
    } catch (error) {
      message.error('获取用户列表失败');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: '用户名',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
    },
    // 更多列...
  ];

  return (
    <div>
      <h1>用户列表</h1>
      <Button type="primary" onClick={fetchUsers} loading={loading}>
        刷新
      </Button>
      <Table dataSource={users} columns={columns} rowKey="id" loading={loading} />
    </div>
  );
};
```

### 创建API服务
```typescript
// API服务示例
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

export const userService = {
  async getUsers() {
    const response = await axios.get(`${API_URL}/users`);
    return response.data;
  },

  async getUserById(id) {
    const response = await axios.get(`${API_URL}/users/${id}`);
    return response.data;
  },

  async createUser(user) {
    const response = await axios.post(`${API_URL}/users`, user);
    return response.data;
  },

  // 其他方法...
};
```

## 测试指南

### 单元测试
使用Jest进行单元测试：
```typescript
// 用户服务测试示例
import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';

describe('UsersService', () => {
  let service: UsersService;
  let mockRepository;

  beforeEach(async () => {
    mockRepository = {
      create: jest.fn(),
      save: jest.fn(),
      find: jest.fn(),
      findOneOrFail: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a user', async () => {
    const createUserDto = {
      username: 'test',
      password: 'password',
      email: 'test@example.com',
    };
    const user = { id: 1, ...createUserDto };
    
    mockRepository.create.mockReturnValue(user);
    mockRepository.save.mockResolvedValue(user);
    
    expect(await service.create(createUserDto)).toEqual(user);
    expect(mockRepository.create).toHaveBeenCalledWith(createUserDto);
    expect(mockRepository.save).toHaveBeenCalledWith(user);
  });
});
```

### 运行测试
```bash
# 运行所有测试
pnpm test

# 运行特定测试
pnpm test -- users.service
```

## 构建与部署

### 构建项目
```bash
# 构建所有应用
pnpm build

# 构建特定应用
pnpm build:user
```

### Docker部署
```bash
# 构建Docker镜像
docker build -t ignition .

# 使用Docker Compose部署
docker-compose up -d
```

## 常见问题排查

### 依赖问题
如果遇到依赖相关错误，尝试：
```bash
# 清理依赖缓存
pnpm clean

# 重新安装依赖
pnpm install
```

### 数据库连接问题
1. 确保MySQL和MongoDB容器正在运行
2. 检查`.config/.dev.yaml`中的数据库配置
3. 验证数据库用户名和密码是否正确

### 端口占用问题
如果端口被占用，可以修改配置文件中的端口设置，或者停止占用端口的进程。 