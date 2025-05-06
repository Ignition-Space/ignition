'use client';

import { Card, Typography, Divider } from 'antd';

const { Title, Paragraph } = Typography;

export default function BusinessComponentsPage() {
  return (
    <div className="space-y-6">
      <Title level={2}>业务组件</Title>
      <Paragraph>
        业务组件是针对特定业务场景开发的复合组件，封装了业务逻辑和数据处理。
      </Paragraph>

      <Divider />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card title="用户表格组件" hoverable>
          <Paragraph>
            封装了用户管理相关的表格展示、筛选、分页等功能的业务组件。
          </Paragraph>
        </Card>

        <Card title="权限选择器" hoverable>
          <Paragraph>
            用于角色权限分配的树形选择组件，支持批量操作和权限预览。
          </Paragraph>
        </Card>

        <Card title="资源上传组件" hoverable>
          <Paragraph>
            支持文件拖拽、进度显示、文件预览等功能的资源上传组件。
          </Paragraph>
        </Card>

        <Card title="数据统计卡片" hoverable>
          <Paragraph>
            针对数据统计展示的卡片组件，支持多种数据可视化图表。
          </Paragraph>
        </Card>
      </div>
    </div>
  );
}
