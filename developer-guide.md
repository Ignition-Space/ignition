## 开发环境

> 基于 Docker Compose 快速部署，需要你熟悉 Docker 以及 Docker Compose 的使用。

### 安装 Docker

- 安装 Docker: https://docs.docker.com/engine/install/
- 安装 Docker Compose: https://docs.docker.com/compose/install/

### 开发环境（开发者）

```sh
# 构建数据库基础环境
cd docker
docker-compose up -d mysql mongodb
# 关闭数据库基础环境
docker-compose down
```
# 登录 mysql 客户端或者命令行手动创建数据库, 'material_test'
```text
username: root
password: 123456
```
# 新建配置文件.config/.dev.yaml

```sh
cp .config/.dev.yaml.example .config/.dev.yaml
```

# 安装依赖

pnpm install

# 启动项目

pnpm dev

# 打开浏览器访问

http://localhost:3000/doc // 服务端 Api 地址
http://localhost:8000/siteList // 客户端界面

```