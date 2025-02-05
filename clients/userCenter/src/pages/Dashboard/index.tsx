import React from 'react';
import { Card, Row, Col, Statistic } from 'antd';
import {
  UserOutlined,
  RocketOutlined,
  ThunderboltOutlined,
  CloudServerOutlined,
} from '@ant-design/icons';
import { Line, Pie } from '@ant-design/charts';
import { useAtomValue } from 'jotai';
import { userAtom } from '@/atoms/userAtom';
import './index.less';

const Dashboard: React.FC = () => {
  const { user } = useAtomValue(userAtom);

  // 模拟数据
  const lineData = [
    { date: '2024-01', value: 3 },
    { date: '2024-02', value: 4 },
    { date: '2024-03', value: 3.5 },
    { date: '2024-04', value: 5 },
    { date: '2024-05', value: 4.9 },
    { date: '2024-06', value: 6 },
    { date: '2024-07', value: 7 },
  ];

  const pieData = [
    { type: '在线用户', value: 27 },
    { type: '离线用户', value: 25 },
    { type: '未激活', value: 18 },
  ];

  const lineConfig = {
    data: lineData,
    xField: 'date',
    yField: 'value',
    autoFit: true,
    point: {
      size: 5,
      shape: 'diamond',
    },
    label: {
      style: {
        fill: '#aaa',
      },
    },
    smooth: true,
    padding: [20, 20, 50, 50],
  };

  const pieConfig = {
    data: pieData,
    angleField: 'value',
    colorField: 'type',
    autoFit: true,
    radius: 0.8,
    label: {
      type: 'spider',
      labelHeight: 28,
      content: '{name}\n{percentage}',
    },
    interactions: [{ type: 'element-active' }],
    padding: [20, 20, 20, 20],
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-content">
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} lg={6}>
            <Card bordered={false} className="stat-card">
              <Statistic
                title="总用户数"
                value={user?.totalUsers || 0}
                prefix={<UserOutlined />}
                className="cyber-stat"
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card bordered={false} className="stat-card">
              <Statistic
                title="系统负载"
                value={42.3}
                prefix={<RocketOutlined />}
                suffix="%"
                className="cyber-stat"
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card bordered={false} className="stat-card">
              <Statistic
                title="响应时间"
                value={0.28}
                prefix={<ThunderboltOutlined />}
                suffix="ms"
                className="cyber-stat"
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card bordered={false} className="stat-card">
              <Statistic
                title="服务器状态"
                value={99.9}
                prefix={<CloudServerOutlined />}
                suffix="%"
                className="cyber-stat"
              />
            </Card>
          </Col>
        </Row>

        <Row gutter={[16, 16]} className="chart-row">
          <Col xs={24} lg={16}>
            <Card title="系统访问趋势" bordered={false} className="chart-card">
              <div
                style={{ width: '100%', height: '100%', minHeight: '300px' }}
              >
                <Line {...lineConfig} />
              </div>
            </Card>
          </Col>
          <Col xs={24} lg={8}>
            <Card title="用户分布" bordered={false} className="chart-card">
              <div
                style={{ width: '100%', height: '100%', minHeight: '300px' }}
              >
                <Pie {...pieConfig} />
              </div>
            </Card>
          </Col>
        </Row>

        <Row gutter={[16, 16]} className="info-row">
          <Col xs={24} lg={12}>
            <Card title="系统公告" bordered={false} className="info-card">
              <div className="announcement">
                <p>• 系统将于本周六凌晨2点进行例行维护</p>
                <p>• 新版本功能预告：智能数据分析即将上线</p>
                <p>• 安全更新：已修复已知的安全漏洞</p>
              </div>
            </Card>
          </Col>
          <Col xs={24} lg={12}>
            <Card title="活跃用户" bordered={false} className="info-card">
              <div className="active-users">
                <p>• 张三 - 最后登录时间：2分钟前</p>
                <p>• 李四 - 最后登录时间：5分钟前</p>
                <p>• 王五 - 最后登录时间：12分钟前</p>
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default Dashboard;
