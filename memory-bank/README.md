# Memory Bank 指南

这是点火引擎（Ignition）项目的Memory Bank（记忆库），包含项目规划、架构设计和关键决策文档。

## 文档概述

### 规划文档
- [项目计划](./projectPlan.md) - 项目的总体目标、范围和时间线
- [任务分解](./taskBreakdown.md) - 详细的任务列表和工作分解结构
- [计划状态](./planStatus.md) - 当前项目计划的完成状态
- [任务跟踪](./tasks.md) - 项目各阶段任务的完成情况

### 设计文档
- [设计决策](./designDecisions.md) - 关键技术选择及决策理由
- [组件架构](./componentArchitecture.md) - 系统组件及其交互的详细说明
- [系统模式](./systemPatterns.md) - 项目中使用的设计模式和架构模式

### 创意阶段文档
- [创意阶段概览](./creative/README.md) - 创意阶段设计文档的索引和概述
- [架构设计](./creative/architecturalDesign.md) - 详细的系统架构设计
- [UI/UX设计](./creative/uiDesign.md) - 用户界面和用户体验设计
- [数据模型设计](./creative/dataModel.md) - 实体关系和数据库模式设计
- [算法设计](./creative/algorithmDesign.md) - 关键算法和数据处理流程设计

### 技术文档
- [数据库架构](./databaseSchema.md) - 数据库设计和关系模型
- [开发指南](./developmentGuide.md) - 开发约定和最佳实践
- [风险分析](./riskAnalysis.md) - 项目风险及缓解策略
- [步骤指南](./stepByStepGuide.md) - 开发实施的逐步指导
- [进度跟踪](./progress.md) - 实现阶段的进度跟踪

## 最近更新

- **2024-05-07**: 完成创意阶段设计，创建了[架构设计](./creative/architecturalDesign.md)、[UI/UX设计](./creative/uiDesign.md)、[数据模型设计](./creative/dataModel.md)和[算法设计](./creative/algorithmDesign.md)文档
- **2024-05-07**: 创建了[任务跟踪](./tasks.md)和[进度跟踪](./progress.md)文档，准备进入实现阶段
- **2024-05-06**: 创建了详细的[组件架构](./componentArchitecture.md)文档，定义了系统所有主要组件的结构和交互方式
- **2024-05-06**: 更新了[设计决策](./designDecisions.md)文档，添加了开发工具链和CI/CD管道相关决策

## 使用指南

- 所有文档均使用Markdown格式，可在任何Markdown查看器中阅读
- 文档互相关联，建议通过上述链接进行导航
- 可通过Git历史查看文档的变更历史

## 项目阶段

1. **规划阶段** ✅ - 已完成
   - 完成项目需求分析和任务分解
   - 形成初步架构设计和技术选型

2. **创意阶段** ✅ - 已完成
   - 详细的架构设计
   - UI/UX设计
   - 数据模型设计
   - 算法设计

3. **实现阶段** ⏳ - 准备开始
   - 基础架构搭建
   - 核心服务实现
   - 前端应用实现
   - 集成与测试

4. **部署阶段** 🔜 - 计划中
   - 开发环境部署
   - 测试环境部署
   - 生产环境部署

## 备注

Memory Bank旨在维护项目的集体记忆，确保所有团队成员对项目有统一的理解。

- 请在进行任何重大设计变更前参考这些文档
- 如果发现需要更新或修正，请及时更新相关文档
- 文档更新应该与代码变更保持同步 