# 用户中心客户端

用户中心客户端是火石平台的用户界面，提供用户管理、权限配置、系统设置等功能的可视化操作界面。

## 核心功能

- **用户管理**: 用户信息、角色分配、权限设置
- **角色管理**: 角色创建、权限分配、角色层级
- **权限配置**: 细粒度的功能和数据权限配置
- **登录认证**: 支持多种登录方式（账号密码、GitHub、飞书等）
- **个人中心**: 用户个人信息维护
- **系统设置**: 全局系统配置
- **操作日志**: 记录用户操作

## 技术架构

- 基于Next.js框架构建
- 使用React作为UI库
- 采用Ant Design组件库
- 使用TailwindCSS进行样式管理
- 数据状态管理使用React Context和Hooks

## 启动客户端

```bash
# 开发环境启动
pnpm dev-client:user

# 或者使用turbo启动
pnpm dev:user
```

启动后访问：

```
http://localhost:8000/
```

## 目录结构

```
userCenter/
├── components/       # 组件目录
├── app/              # 页面目录
├── lib/              # 工具函数和通用逻辑
├── clients/          # API客户端
└── public/           # 静态资源
```

## 主要页面

- `/login` - 登录页面
- `/dashboard` - 控制台
- `/users` - 用户管理
- `/roles` - 角色管理
- `/permissions` - 权限管理
- `/settings` - 系统设置
- `/profile` - 个人中心

## 与服务端的交互

用户中心客户端通过API与用户服务进行交互：

```typescript
// 示例：用户登录
async function login(username, password) {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  return response.json();
}
```

## 本地域名配置

为了支持三方登录，需要配置本地域名：

### Mac系统

```bash
sudo vi /etc/hosts
```

添加以下内容：

```
127.0.0.1  www.ig-space.com
127.0.0.1  api-space.com
```

## 主题定制

用户中心支持主题定制，可以通过修改`tailwind.config.js`调整主题颜色：

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: '#1890ff',
        // 自定义其他颜色
      },
    },
  },
  // 其他配置
};
```

## 国际化支持

用户中心支持中英文切换，语言文件位于`/lib/locales/`目录下。

## 后续计划

- [ ] 增加更多三方登录支持
- [ ] 优化移动端适配
- [ ] 增强数据可视化功能
- [ ] 添加更多定制化主题 