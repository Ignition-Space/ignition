## 用户权限系统

基于 Github 作为三方登录的 RBAC 用户权限管理系统

- 启动用户服务
```
pnpm dev:user
```
> 用户系统想要体验完成的流程需要[绑定本地域名](./docs/addLocalHost.md)

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5c4a613a1c774e14a1d70fa8a0f431b3~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2560&h=426&s=62805&e=png&b=fefefe)

## 添加本地域名

#### Mac 添加本地域名

打开终端，输入命令：

```shell
sudo vi /etc/hosts
```

添加 本地域名映射

```shell
127.0.0.1  www.ig-space.com
127.0.0.1  api-space.com
```

`:wq` 保存退出即可

## 技术

服务端：NestJS
客户端：ReactJS + AntD

## 特别声明

用户系统的模板是基于 https://github.com/javaLuo/react-admin 这个项目，有疑问可以与我联系