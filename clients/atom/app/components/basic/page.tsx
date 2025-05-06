'use client';

import { Card, Typography, Divider, Button, Input, Space } from 'antd';

const { Title, Paragraph } = Typography;

export default function BasicComponentsPage() {
  return (
    <div className="space-y-6">
      <Title level={2}>基础组件</Title>
      <Paragraph>
        基础组件是构建用户界面的基本元素，这些组件被设计为高度可复用且与业务逻辑无关。
      </Paragraph>

      <Divider />

      <section className="space-y-4">
        <Title level={3}>按钮</Title>
        <Space wrap>
          <Button type="primary">主要按钮</Button>
          <Button>默认按钮</Button>
          <Button type="dashed">虚线按钮</Button>
          <Button type="text">文本按钮</Button>
          <Button type="link">链接按钮</Button>
        </Space>
      </section>

      <Divider />

      <section className="space-y-4">
        <Title level={3}>输入框</Title>
        <Space direction="vertical" style={{ width: '100%' }}>
          <Input placeholder="基本输入框" />
          <Input.Password placeholder="密码输入框" />
          <Input.TextArea placeholder="文本区域" rows={4} />
        </Space>
      </section>

      <Divider />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card title="表单" hoverable>
          <Paragraph>
            表单组件用于数据收集、校验和提交，支持多种布局和验证规则。
          </Paragraph>
        </Card>

        <Card title="表格" hoverable>
          <Paragraph>
            表格组件用于数据展示，支持排序、筛选、分页等功能。
          </Paragraph>
        </Card>

        <Card title="弹窗" hoverable>
          <Paragraph>
            弹窗组件用于临时展示内容，包括对话框、抽屉、弹出框等。
          </Paragraph>
        </Card>

        <Card title="导航" hoverable>
          <Paragraph>
            导航组件用于页面导航，包括菜单、标签页、面包屑等。
          </Paragraph>
        </Card>
      </div>
    </div>
  );
}