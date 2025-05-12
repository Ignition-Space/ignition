'use client';

import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Progress, Typography, Avatar } from 'antd';
import {
  UserOutlined,
  TeamOutlined,
  AppstoreOutlined,
  SafetyCertificateOutlined,
  RiseOutlined,
  FallOutlined,
  LineChartOutlined,
  ClockCircleOutlined,
  BellOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';
import { useUser } from '../hooks/useUser';

const { Title, Text } = Typography;

const Dashboard = () => {
  const { user } = useUser();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // 添加入场动画效果
    const timer = setTimeout(() => {
      setVisible(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  // 模拟数据
  const totalUsers = user?.totalUsers || 128;
  const activeUsers = Math.round(totalUsers * 0.72);
  const systemCount = 12;
  const privilegeRules = 56;

  // 系统使用情况
  const systemUsage = [
    { name: '用户管理', percent: 78 },
    { name: '权限分配', percent: 65 },
    { name: '资源调度', percent: 42 },
    { name: '系统监控', percent: 89 },
  ];

  // 生成随机活动数据
  const generateActivities = () => {
    const activities = [
      {
        type: '登录系统',
        user: '管理员',
        time: '10分钟前',
        icon: <UserOutlined />,
      },
      {
        type: '创建用户',
        user: '系统管理员',
        time: '30分钟前',
        icon: <TeamOutlined />,
      },
      {
        type: '更新权限',
        user: '安全审计员',
        time: '1小时前',
        icon: <SafetyCertificateOutlined />,
      },
      {
        type: '系统配置',
        user: '系统管理员',
        time: '2小时前',
        icon: <AppstoreOutlined />,
      },
      {
        type: '数据备份',
        user: '系统管理员',
        time: '5小时前',
        icon: <CheckCircleOutlined />,
      },
    ];

    return activities;
  };

  // 统计卡片样式
  const statCardStyle = {
    borderRadius: '16px',
    overflow: 'hidden',
    transition: 'all 0.3s',
    height: '100%',
  };

  return (
    <div
      className={`p-6 transition-all duration-500 ${visible ? 'opacity-100' : 'opacity-0'}`}
    >
      <div className="flex items-center justify-between mb-8">
        <Title level={4} className="page-title mb-0">
          系统仪表盘
        </Title>
        <div className="flex items-center">
          <BellOutlined className="text-xl text-gray-500 cursor-pointer hover:text-blue-500 transition-colors duration-300 mr-4" />
          <span className="text-gray-500">
            <ClockCircleOutlined className="mr-2" />
            {new Date().toLocaleDateString('zh-CN')}
          </span>
        </div>
      </div>

      {/* 核心统计数据 */}
      <Row gutter={[24, 24]} className="mb-8">
        <Col xs={24} sm={12} md={6}>
          <Card
            style={statCardStyle}
            hoverable
            className="rounded-2xl overflow-hidden"
          >
            <div className="flex items-center">
              <div className="flex-1">
                <Text type="secondary" className="block mb-1">
                  总用户数
                </Text>
                <Title level={3} className="my-0 text-blue-600">
                  {totalUsers}
                </Title>
                <div className="mt-2 text-xs flex items-center text-blue-400">
                  <RiseOutlined className="mr-1" /> 较上月增长 8%
                </div>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <UserOutlined className="text-2xl text-blue-600" />
              </div>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <Card
            style={statCardStyle}
            hoverable
            className="rounded-2xl overflow-hidden"
          >
            <div className="flex items-center">
              <div className="flex-1">
                <Text type="secondary" className="block mb-1">
                  活跃用户
                </Text>
                <Title level={3} className="my-0 text-emerald-600">
                  {activeUsers}
                </Title>
                <div className="mt-2 text-xs flex items-center text-emerald-400">
                  <RiseOutlined className="mr-1" /> 较上周增长 5%
                </div>
              </div>
              <div className="bg-emerald-100 p-3 rounded-full">
                <TeamOutlined className="text-2xl text-emerald-600" />
              </div>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <Card
            style={statCardStyle}
            hoverable
            className="rounded-2xl overflow-hidden"
          >
            <div className="flex items-center">
              <div className="flex-1">
                <Text type="secondary" className="block mb-1">
                  系统数量
                </Text>
                <Title level={3} className="my-0 text-purple-600">
                  {systemCount}
                </Title>
                <div className="mt-2 text-xs flex items-center text-purple-400">
                  本月新增 2 个系统
                </div>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <AppstoreOutlined className="text-2xl text-purple-600" />
              </div>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <Card
            style={statCardStyle}
            hoverable
            className="rounded-2xl overflow-hidden"
          >
            <div className="flex items-center">
              <div className="flex-1">
                <Text type="secondary" className="block mb-1">
                  权限规则
                </Text>
                <Title level={3} className="my-0 text-amber-600">
                  {privilegeRules}
                </Title>
                <div className="mt-2 text-xs flex items-center text-amber-400">
                  <FallOutlined className="mr-1" /> 较上月减少 3 条
                </div>
              </div>
              <div className="bg-amber-100 p-3 rounded-full">
                <SafetyCertificateOutlined className="text-2xl text-amber-600" />
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      <Row gutter={[24, 24]}>
        {/* 系统使用情况 */}
        <Col xs={24} lg={12}>
          <Card
            title={<span className="font-bold">系统使用情况</span>}
            extra={<LineChartOutlined className="text-gray-500" />}
            className="rounded-2xl"
          >
            <Row gutter={[24, 24]}>
              {systemUsage.map((item, index) => (
                <Col key={index} xs={12} sm={12} md={12}>
                  <div className="mb-2">
                    <div className="flex justify-between mb-1">
                      <Text strong>{item.name}</Text>
                      <Text type="secondary">{item.percent}%</Text>
                    </div>
                    <Progress
                      percent={item.percent}
                      size="small"
                      strokeColor={{
                        '0%': '#2563eb',
                        '100%':
                          item.percent > 70
                            ? '#10b981'
                            : item.percent > 50
                              ? '#f59e0b'
                              : '#ef4444',
                      }}
                    />
                  </div>
                </Col>
              ))}
            </Row>
          </Card>
        </Col>

        {/* 用户活动 */}
        <Col xs={24} lg={12}>
          <Card
            title={<span className="font-bold">最近系统活动</span>}
            className="rounded-2xl"
          >
            <div className="space-y-5">
              {generateActivities().map((activity, index) => (
                <div key={index} className="flex items-start">
                  <Avatar
                    icon={activity.icon}
                    className={`mr-3 ${index % 5 === 0
                        ? 'bg-blue-500'
                        : index % 5 === 1
                          ? 'bg-green-500'
                          : index % 5 === 2
                            ? 'bg-purple-500'
                            : index % 5 === 3
                              ? 'bg-amber-500'
                              : 'bg-red-500'
                      }`}
                  />
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <Text strong>{activity.type}</Text>
                      <Text type="secondary" className="text-xs">
                        {activity.time}
                      </Text>
                    </div>
                    <Text type="secondary" className="text-sm">
                      {activity.user}
                    </Text>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default function DashboardPage() {
  return <Dashboard />;
}
