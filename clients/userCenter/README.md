# 用户中心客户端

## API 更新说明

本次更新将接口从旧版本调整为新的 API 接口（`http://localhost:4000/doc-json`）。主要完成了以下任务：

### 1. 服务接口更新

- **用户服务 (userService.ts)**
  - 更新了用户数据接口定义
  - 调整了 getUserRoles 方法为新的参数结构
  - 新增 getAllUserRoles 方法获取用户所有角色

- **角色服务 (roleService.ts)**
  - 更新了角色数据接口定义
  - 调整了 getRolePrivileges 方法的参数结构
  - 重命名 getRoleListWithSystem 为 getRoleSystemTree

- **权限服务 (privilegeService.ts)**
  - 更新了权限数据接口定义
  - 调整了参数类型和方法结构
  - 重命名 getPrivilegesBySystemId 为 getAllPrivilegesBySystem

- **系统服务 (systemService.ts)**
  - 更新了系统数据接口定义
  - 调整了方法参数结构

- **资源服务 (resourceService.ts)**
  - 更新了资源数据接口定义
  - 调整了方法参数结构

- **认证服务 (authService.ts)**
  - 重构为符合新 API 的接口
  - 新增 login2, loginWithGoogle, loginWithFeishu 等方法
  - 简化认证流程实现

- **管理服务 (admin.ts)**
  - 创建统一的管理服务导出接口
  - 整合各个服务的方法和类型

### 2. 状态管理更新

- **用户原子 (userAtom.ts)**
  - 新增 isAuthenticated 状态跟踪登录状态
  - 添加 checkAuthAtom 自动检查登录状态
  - 调整用户数据结构

- **用户管理原子 (userManageAtom.ts)**
  - 添加 searchKeyword 字段
  - 新增读取派生原子
  - 添加初始状态常量

- **系统原子 (systemAtom.ts)**
  - 重构系统模态窗口状态
  - 更新搜索状态结构

- **管理员原子 (adminAtoms.ts)**
  - 重构所有管理相关状态接口
  - 为各个实体添加独立的模态窗口状态
  - 添加派生原子便于状态访问
  - 增强类型安全性

## 使用新 API 的注意事项

1. 所有 API 请求都使用 POST 方法
2. 接口统一返回格式包含 success, msg, data 字段
3. 请求地址统一为 `http://localhost:4000/api/*`
4. 认证使用 JWT 令牌，存储在 localStorage 中
5. 接口支持 Github, Google, 飞书等三方登录

## 后续优化建议

1. 添加请求错误重试机制
2. 优化状态管理，减少不必要的渲染
3. 实现数据预取和缓存策略
4. 完善类型定义，增强类型安全
5. 添加单元测试覆盖关键功能 