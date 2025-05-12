# 点火引擎开发指南 - 一步步教程

本指南将引导您完成点火引擎项目的环境设置、运行和开发流程。

## 第一步：安装必要软件

1. **安装Node.js (v14+)**
   ```bash
   # 使用nvm安装Node.js（推荐）
   curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
   nvm install 14
   nvm use 14
   ```

2. **安装pnpm 6.32.4**
   ```bash
   npm install -g pnpm@6.32.4
   ```

3. **安装Docker和Docker Compose**
   ```bash
   # macOS: 使用Homebrew
   brew install --cask docker
   # 或者从官网下载Docker Desktop
   ```

## 第二步：克隆并准备项目

1. **克隆项目**
   ```bash
   git clone <repository-url>
   cd ignition
   ```

2. **安装项目依赖**
   ```bash
   pnpm install
   ```

## 第三步：配置开发环境

1. **启动数据库容器**
   ```bash
   cd docker
   docker-compose up -d mysql mongodb
   ```

2. **创建和配置环境文件**
   ```bash
   cp .config/.dev.yaml.example .config/.dev.yaml
   ```
   
3. **编辑.config/.dev.yaml**，设置必要的配置：
   - 数据库连接信息
   - GitHub OAuth信息（如需要）
   - 其他必要配置

## 第四步：创建数据库

1. **登录MySQL并创建数据库**
   ```bash
   # 使用docker-compose运行的MySQL容器
   docker exec -it ignition_mysql mysql -u root -p
   ```
   
   在MySQL命令行中：
   ```sql
   CREATE DATABASE user_db;
   CREATE DATABASE material_db;
   CREATE DATABASE devops_db;
   ```

## 第五步：启动项目

1. **启动所有服务**
   ```bash
   pnpm dev
   ```
   
   或者启动特定服务：
   ```bash
   # 启动用户服务
   pnpm dev:user
   
   # 启动Ignition服务
   pnpm dev:ig
   ```

2. **验证服务是否正常运行**
   - 访问 http://localhost:3000/doc 查看API文档
   - 访问 http://localhost:8000/siteList 查看前端界面

## 第六步：开发工作流程

### 创建新功能

1. **创建功能分支**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **实现功能**
   - 编写服务端代码（NestJS）
   - 编写客户端代码（React）

3. **测试功能**
   ```bash
   # 运行测试
   pnpm test
   ```

4. **提交代码**
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   git push origin feature/your-feature-name
   ```

### 修复BUG

1. **创建修复分支**
   ```bash
   git checkout -b bugfix/bug-description
   ```

2. **实现修复**
   - 定位问题
   - 编写修复代码
   - 添加测试

3. **测试修复**
   ```bash
   pnpm test
   ```

4. **提交代码**
   ```bash
   git add .
   git commit -m "fix: fix bug description"
   git push origin bugfix/bug-description
   ```

## 第七步：常见问题与解决方案

### 数据库连接问题

1. **检查Docker容器是否运行**
   ```bash
   docker ps
   ```

2. **检查配置文件中的数据库连接信息**
   ```bash
   cat .config/.dev.yaml
   ```

3. **手动测试数据库连接**
   ```bash
   docker exec -it ignition_mysql mysql -u <username> -p
   ```

### 依赖问题

1. **清理依赖缓存并重新安装**
   ```bash
   pnpm clean
   pnpm install
   ```

2. **检查pnpm版本**
   ```bash
   pnpm --version
   ```

### 端口冲突

1. **查找占用端口的进程**
   ```bash
   # macOS/Linux
   lsof -i :3000
   
   # Windows
   netstat -ano | findstr :3000
   ```

2. **终止进程**
   ```bash
   # macOS/Linux
   kill -9 <PID>
   
   # Windows
   taskkill /F /PID <PID>
   ```

## 第八步：构建和部署

1. **构建项目**
   ```bash
   pnpm build
   ```

2. **Docker部署**
   ```bash
   # 构建Docker镜像
   docker build -t ignition .
   
   # 使用Docker Compose启动服务
   docker-compose up -d
   ```

## 额外资源

- 查看项目文档: `docs/`目录
- 查看API文档: 启动项目后访问`http://localhost:3000/doc`
- 贡献指南: 查看项目根目录的`CONTRIBUTING.md`文件 