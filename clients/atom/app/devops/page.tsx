'use client';

import React from 'react';
import { Typography, Card, Row, Col, Button, Divider, Statistic } from 'antd';
import {
  CloudServerOutlined,
  RocketOutlined,
  SafetyCertificateOutlined,
  DashboardOutlined,
  GithubOutlined,
  TeamOutlined,
} from '@ant-design/icons';

const { Title, Paragraph } = Typography;

export default function DevOpsPage() {
  return (
    <div className="container mx-auto">
      <div className="text-center mb-12">
        <Title level={2} className="dark:text-gray-100">DEVOPS 平台</Title>
        <Paragraph className="text-gray-500 dark:text-gray-400 text-lg max-w-2xl mx-auto">
          零成本集成项目的 DevOps 平台，简化部署、监控和运维流程
        </Paragraph>
        <div className="mt-6 space-x-4">
          <Button type="primary" icon={<RocketOutlined />} size="large">
            开始使用
          </Button>
          <Button icon={<GithubOutlined />} size="large">
            查看文档
          </Button>
        </div>
      </div>

      <Row gutter={[24, 24]} className="mb-12">
        <Col xs={24} sm={12} md={6}>
          <Card className="text-center dark:bg-gray-800 dark:border-gray-700">
            <Statistic
              title={<span className="dark:text-gray-300">部署次数</span>}
              value={2583}
              valueStyle={{ color: '#3b82f6' }}
              prefix={<RocketOutlined />}
              className="dark:text-white"
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card className="text-center dark:bg-gray-800 dark:border-gray-700">
            <Statistic
              title={<span className="dark:text-gray-300">服务器</span>}
              value={128}
              valueStyle={{ color: '#10b981' }}
              prefix={<CloudServerOutlined />}
              className="dark:text-white"
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card className="text-center dark:bg-gray-800 dark:border-gray-700">
            <Statistic
              title={<span className="dark:text-gray-300">监控指标</span>}
              value={568}
              valueStyle={{ color: '#f59e0b' }}
              prefix={<DashboardOutlined />}
              className="dark:text-white"
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card className="text-center dark:bg-gray-800 dark:border-gray-700">
            <Statistic
              title={<span className="dark:text-gray-300">团队成员</span>}
              value={42}
              valueStyle={{ color: '#8b5cf6' }}
              prefix={<TeamOutlined />}
              className="dark:text-white"
            />
          </Card>
        </Col>
      </Row>

      <div className="mb-12">
        <Title level={3} className="text-center mb-8 dark:text-gray-100">
          主要功能
        </Title>
        <Row gutter={[24, 24]}>
          <Col xs={24} md={8}>
            <Card className="h-full dark:bg-gray-800 dark:border-gray-700">
              <Title level={4} className="flex items-center dark:text-white">
                <RocketOutlined className="mr-2 text-blue-500" /> 自动化部署
              </Title>
              <Paragraph className="dark:text-gray-400">
                支持Git触发、定时、手动等多种部署方式，全自动化构建流程，一键回滚，实时部署日志。
              </Paragraph>
              <ul className="list-disc pl-5 dark:text-gray-300 text-sm">
                <li>支持多环境部署配置</li>
                <li>蓝绿部署和灰度发布</li>
                <li>部署审批流程</li>
              </ul>
            </Card>
          </Col>
          <Col xs={24} md={8}>
            <Card className="h-full dark:bg-gray-800 dark:border-gray-700">
              <Title level={4} className="flex items-center dark:text-white">
                <DashboardOutlined className="mr-2 text-green-500" /> 监控与告警
              </Title>
              <Paragraph className="dark:text-gray-400">
                全面监控服务器、应用性能和业务指标，支持自定义监控和告警规则，多渠道告警通知。
              </Paragraph>
              <ul className="list-disc pl-5 dark:text-gray-300 text-sm">
                <li>系统资源监控</li>
                <li>应用性能分析</li>
                <li>异常实时告警</li>
              </ul>
            </Card>
          </Col>
          <Col xs={24} md={8}>
            <Card className="h-full dark:bg-gray-800 dark:border-gray-700">
              <Title level={4} className="flex items-center dark:text-white">
                <SafetyCertificateOutlined className="mr-2 text-purple-500" /> 安全与合规
              </Title>
              <Paragraph className="dark:text-gray-400">
                内置安全扫描和合规检查，保障应用和基础设施安全，支持安全策略自定义。
              </Paragraph>
              <ul className="list-disc pl-5 dark:text-gray-300 text-sm">
                <li>代码安全扫描</li>
                <li>依赖安全检查</li>
                <li>合规审计日志</li>
              </ul>
            </Card>
          </Col>
        </Row>
      </div>

      <div className="mb-12">
        <Title level={3} className="text-center mb-8 dark:text-gray-100">
          服务列表
        </Title>
        <Row gutter={[16, 16]}>
          {[
            '代码仓库', '持续集成', '制品仓库',
            '部署中心', '配置中心', '环境管理',
            '监控中心', '日志中心', '用量统计'
          ].map((service, index) => (
            <Col xs={12} sm={8} md={6} lg={4} key={index}>
              <Card
                className="text-center hover:shadow-md transition-shadow dark:bg-gray-800 dark:border-gray-700"
                hoverable
              >
                <div className="font-medium dark:text-white">{service}</div>
              </Card>
            </Col>
          ))}
        </Row>
      </div>

      <Card className="dark:bg-gray-800 dark:border-gray-700">
        <Row gutter={24} align="middle">
          <Col xs={24} md={16}>
            <Title level={4} className="mb-2 dark:text-white">准备好开始使用了吗？</Title>
            <Paragraph className="dark:text-gray-300">
              现在注册即可获得14天免费试用，无需信用卡，随时可取消。
            </Paragraph>
          </Col>
          <Col xs={24} md={8} className="text-center md:text-right">
            <Button type="primary" size="large" icon={<RocketOutlined />}>
              免费试用
            </Button>
          </Col>
        </Row>
      </Card>
    </div>
  );
} 