# HOUSHI

<p align="center">一站式工程化解决方案</p>

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
```

2. 启动项目
```
pnpm dev
```

3. 浏览器打开链接
```
http://localhost:3000/doc // 服务端 Api 地址
http://localhost:8000/siteList // 客户端界面
```

## 技术

服务端：NestJS
客户端：ReactJS + And

## 支持

有想催更跟建议的朋友可以添加我的微信: **Cookieboty** 进群同步消息