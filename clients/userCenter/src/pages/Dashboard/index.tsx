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
      fill: '#1890ff',
    },
    line: {
      style: {
        stroke: '#1890ff',
        lineWidth: 3,
      },
    },
    area: {
      style: {
        fill: 'l(270) 0:#1890ff00 1:#1890ff80',
      }
    },
    label: {
      style: {
        fill: '#f0f0f0',
      },
    },
    xAxis: {
      label: {
        style: {
          fill: '#f0f0f0',
        },
      },
      line: {
        style: {
          stroke: '#15395b',
        },
      },
    },
    yAxis: {
      label: {
        style: {
          fill: '#f0f0f0',
        },
      },
      grid: {
        line: {
          style: {
            stroke: '#15395b',
            lineWidth: 1,
            lineDash: [4, 4],
          },
        },
      },
    },
    smooth: true,
    padding: [30, 30, 50, 50],
  };

  const pieConfig = {
    data: pieData,
    angleField: 'value',
    colorField: 'type',
    autoFit: true,
    radius: 0.7,
    theme: {
      colors10: ['#1890ff', '#36cbcb', '#4ecb73'],
    },
    label: {
      type: 'spider',
      labelHeight: 28,
      content: '{name}\n{percentage}',
      style: {
        fill: '#f0f0f0',
      },
    },
    interactions: [{ type: 'element-active' }],
    padding: [20, 20, 20, 20],
    legend: {
      position: 'bottom',
      itemName: {
        style: {
          fill: '#f0f0f0',
        },
      },
    },
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-content">
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} lg={6}>
            <Card bordered={false} className="stat-card" bodyStyle={{ padding: '24px' }}>
              <Statistic
                title="总用户数"
                value={user?.totalUsers || 0}
                prefix={<UserOutlined className="text-blue-400" />}
                valueStyle={{ color: '#f0f0f0', fontSize: '24px' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card bordered={false} className="stat-card" bodyStyle={{ padding: '24px' }}>
              <Statistic
                title="系统负载"
                value={42.3}
                prefix={<RocketOutlined className="text-green-400" />}
                suffix="%"
                valueStyle={{ color: '#f0f0f0', fontSize: '24px' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card bordered={false} className="stat-card" bodyStyle={{ padding: '24px' }}>
              <Statistic
                title="响应时间"
                value={0.28}
                prefix={<ThunderboltOutlined className="text-yellow-400" />}
                suffix="ms"
                valueStyle={{ color: '#f0f0f0', fontSize: '24px' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card bordered={false} className="stat-card" bodyStyle={{ padding: '24px' }}>
              <Statistic
                title="服务器状态"
                value={99.9}
                prefix={<CloudServerOutlined className="text-purple-400" />}
                suffix="%"
                valueStyle={{ color: '#f0f0f0', fontSize: '24px' }}
              />
            </Card>
          </Col>
        </Row>

        <Row gutter={[16, 16]} className="chart-row">
          <Col xs={24} lg={16}>
            <Card title="系统访问趋势" bordered={false} className="chart-card" bodyStyle={{ padding: '12px' }}>
              <div style={{ width: '100%', height: '320px' }}>
                <Line {...lineConfig} />
              </div>
            </Card>
          </Col>
          <Col xs={24} lg={8}>
            <Card title="用户分布" bordered={false} className="chart-card" bodyStyle={{ padding: '12px' }}>
              <div style={{ width: '100%', height: '320px' }}>
                <Pie {...pieConfig} />
              </div>
            </Card>
          </Col>
        </Row>

        <Row gutter={[16, 16]} className="info-row">
          <Col xs={24} lg={12}>
            <Card title="系统公告" bordered={false} className="info-card" bodyStyle={{ padding: '20px' }}>
              <div className="announcement text-gray-300">
                <p className="flex items-center mb-3">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-blue-400 mr-2"></span>
                  系统将于本周六凌晨2点进行例行维护
                </p>
                <p className="flex items-center mb-3">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-400 mr-2"></span>
                  新版本功能预告：智能数据分析即将上线
                </p>
                <p className="flex items-center">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-yellow-400 mr-2"></span>
                  安全更新：已修复已知的安全漏洞
                </p>
              </div>
            </Card>
          </Col>
          <Col xs={24} lg={12}>
            <Card title="活跃用户" bordered={false} className="info-card" bodyStyle={{ padding: '20px' }}>
              <div className="active-users text-gray-300">
                <p className="flex items-center mb-3">
                  <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                  张三 <span className="text-gray-400 ml-2 text-xs">最后登录时间：2分钟前</span>
                </p>
                <p className="flex items-center mb-3">
                  <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                  李四 <span className="text-gray-400 ml-2 text-xs">最后登录时间：5分钟前</span>
                </p>
                <p className="flex items-center">
                  <span className="inline-block w-2 h-2 rounded-full bg-yellow-500 mr-2"></span>
                  王五 <span className="text-gray-400 ml-2 text-xs">最后登录时间：12分钟前</span>
                </p>
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default Dashboard;
