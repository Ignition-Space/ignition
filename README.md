# HUOSHI

<p align="center">一站式工程化解决方案</p>

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d720ef26d4234208966dfc3da7f47306~tplv-k3u1fbpfcp-watermark.image?)

## 安装
```jsx
$ pnpm i

```

## 使用

1. 添加 .config/.dev.yaml
```
MONGODB_CONFIG:
  name: "ignition_test"
  type: "mongodb"
  url: "mongodb://127.0.0.1:27017"
  database: "ignition_test"
  entities: "mongo"
  logging: false
  synchronize: true
MYSQL_CONFIG:
  name: "material_test"
  type: "mysql"
  host: "127.0.0.1"
  port: 3306
  database: "material_test"
  username: "root"
  password: "123456"
  entities: "mysql"
  synchronize: true
MYSQL_DEVOPS_CONFIG:
  name: "devops_test"
  type: "mysql"
  host: "127.0.0.1"
  port: 3306
  username: "root"
  password: "123456"
  database: "devops_test"
  entities: "mysql"
  logging: false
  synchronize: true
GITGUB_CONFIG:
  CLIENT_ID: ''
  CLIENT_SECRETS: ''
FEISHU_CONFIG:
  FEISHU_APP_ID: ''
  FEISHU_APP_SECRET: ''
```

2. 启动项目

- 启动所有项目
```
pnpm dev
```

#### 火石基础系统
3. 浏览器打开链接
```
http://localhost:3000/doc // 服务端 Api 地址
http://localhost:8000/siteList // 客户端界面
```

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d1101a963c784de8b9f970bf86545095~tplv-k3u1fbpfcp-watermark.image?)

4. 创建 Demo 项目

解析 URL 可以填入 http://localhost:3000/doc-json，将 ignition-server 的服务作为 Demo 演示。

## 子项目文档请点击
#### [用户系统](https://github.com/Ignition-Space/ignition/blob/main/docs/user-center.md)

## 技术

服务端：NestJS
客户端：ReactJS + AntD

## 支持

有想催更跟建议的朋友可以添加我的微信: **Cookieboty** 进群同步消息。

![121663845161_.pic.jpg](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d6fb48debdfe4a88a81fd5bedbbea23f~tplv-k3u1fbpfcp-watermark.image?)