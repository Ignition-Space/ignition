# 原子组件库

原子组件库（Atom）是火石平台的基础UI组件库，提供了一系列可复用的UI组件，用于快速构建统一风格的应用界面。

## 核心特性

- **丰富组件**: 提供表单、表格、图表、布局等多种常用组件
- **主题定制**: 支持自定义主题和品牌定制
- **响应式设计**: 适配多种屏幕尺寸和设备类型
- **无障碍支持**: 符合Web内容无障碍指南（WCAG）
- **TypeScript支持**: 完善的类型定义
- **文档示例**: 丰富的组件使用示例和文档
- **状态管理集成**: 易于与各类状态管理库集成

## 技术架构

- 基于React构建
- 使用Next.js框架
- 采用TailwindCSS进行样式管理
- 支持按需引入

## 启动组件库开发环境

```bash
# 开发环境启动
pnpm dev-client:atom

# 或者使用turbo启动
pnpm dev:atom
```

启动后访问组件库文档：

```
http://localhost:3001/
```

## 组件分类

原子组件库包含以下几类组件：

- **基础组件**: Button、Input、Icon等
- **布局组件**: Grid、Layout、Space等
- **导航组件**: Menu、Tabs、Breadcrumb等
- **数据录入**: Form、Select、DatePicker等
- **数据展示**: Table、List、Card等
- **反馈组件**: Modal、Notification、Message等
- **图表组件**: Line、Bar、Pie等
- **特殊组件**: 特定业务场景下的专用组件

## 使用方式

### 安装

```bash
pnpm add @ignition/atom
```

### 引入组件

```jsx
import { Button, Input } from '@ignition/atom';

function App() {
  return (
    <div>
      <Input placeholder="请输入内容" />
      <Button type="primary">确认</Button>
    </div>
  );
}
```

## 目录结构

```
atom/
├── components/       # 组件源码
├── hooks/            # React Hooks
├── app/              # 文档网站
├── lib/              # 工具函数
└── public/           # 静态资源
```

## 主题定制

原子组件库支持主题定制，可以通过配置文件修改主题：

```javascript
// theme.config.js
module.exports = {
  colors: {
    primary: '#1890ff',
    success: '#52c41a',
    warning: '#faad14',
    error: '#f5222d',
  },
  fonts: {
    base: '"PingFang SC", "Helvetica Neue", Arial, sans-serif',
  },
  // 其他配置
};
```

## 开发新组件

1. 在`components`目录下创建新组件目录
2. 实现组件功能和样式
3. 编写组件测试用例
4. 添加组件文档和示例
5. 将组件导出到入口文件

## 版本管理

原子组件库遵循语义化版本规范（SemVer）：

- **主版本号**: 不兼容的API变更
- **次版本号**: 向下兼容的功能性新增
- **修订号**: 向下兼容的问题修正

## 后续计划

- [ ] 增加更多专业图表组件
- [ ] 优化组件体积和性能
- [ ] 增强主题定制能力
- [ ] 添加更多业务场景组件 