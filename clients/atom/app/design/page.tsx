'use client';

import React from 'react';
import { Typography, Card, Row, Col, Button, Divider, Tag } from 'antd';
import {
  RocketOutlined,
  AppstoreAddOutlined,
  ApiOutlined,
  GithubOutlined,
} from '@ant-design/icons';

const { Title, Paragraph } = Typography;

export default function DesignPage() {
  return (
    <div className="container mx-auto">
      <div className="text-center mb-12">
        <Title level={2} className="dark:text-gray-100">IG DESIGN</Title>
        <Paragraph className="text-gray-500 dark:text-gray-400 text-lg max-w-2xl mx-auto">
          基于 ANT DESIGN 的业务组件库，为企业级应用提供一致的UI解决方案
        </Paragraph>
        <div className="mt-6 space-x-4">
          <Button type="primary" icon={<RocketOutlined />} size="large">
            快速开始
          </Button>
          <Button icon={<GithubOutlined />} size="large">
            GitHub
          </Button>
        </div>
      </div>

      <Divider className="my-12" />

      <div className="mb-12">
        <Title level={3} className="text-center mb-8 dark:text-gray-100">
          为什么选择 IG DESIGN?
        </Title>
        <Row gutter={[24, 24]}>
          <Col xs={24} md={8}>
            <Card className="h-full dark:bg-gray-800 dark:border-gray-700">
              <Title level={4} className="flex items-center dark:text-white">
                <AppstoreAddOutlined className="mr-2 text-blue-500" /> 丰富的组件
              </Title>
              <Paragraph className="dark:text-gray-400">
                提供50+高质量组件，覆盖管理后台所需的各类场景，快速构建企业级应用。
              </Paragraph>
            </Card>
          </Col>
          <Col xs={24} md={8}>
            <Card className="h-full dark:bg-gray-800 dark:border-gray-700">
              <Title level={4} className="flex items-center dark:text-white">
                <ApiOutlined className="mr-2 text-green-500" /> 业务导向
              </Title>
              <Paragraph className="dark:text-gray-400">
                基于真实业务场景打造，提供完整解决方案而非单一组件，大幅提升开发效率。
              </Paragraph>
            </Card>
          </Col>
          <Col xs={24} md={8}>
            <Card className="h-full dark:bg-gray-800 dark:border-gray-700">
              <Title level={4} className="flex items-center dark:text-white">
                <RocketOutlined className="mr-2 text-purple-500" /> 持续更新
              </Title>
              <Paragraph className="dark:text-gray-400">
                定期发布新版本，持续改进既有组件，并根据业务需求不断推出新组件。
              </Paragraph>
            </Card>
          </Col>
        </Row>
      </div>

      <div className="mb-12">
        <Title level={3} className="text-center mb-8 dark:text-gray-100">
          组件概览
        </Title>
        <Row gutter={[16, 16]}>
          {['数据展示', '数据录入', '导航', '反馈', '布局', '其他'].map(
            (category, index) => (
              <Col xs={12} sm={8} md={6} lg={4} key={index}>
                <Card
                  className="text-center hover:shadow-md transition-shadow dark:bg-gray-800 dark:border-gray-700"
                  hoverable
                >
                  <div className="font-medium dark:text-white">{category}</div>
                  <div className="text-gray-500 text-sm mt-1 dark:text-gray-400">
                    {Math.floor(Math.random() * 10) + 5}个组件
                  </div>
                </Card>
              </Col>
            )
          )}
        </Row>
      </div>

      <div className="bg-blue-50 p-6 rounded-lg dark:bg-blue-900 dark:bg-opacity-20">
        <Title level={4} className="dark:text-white">最新版本：v1.5.2</Title>
        <div className="flex flex-wrap gap-2 mb-4">
          <Tag color="blue">新增功能</Tag>
          <Tag color="green">Bug修复</Tag>
          <Tag color="orange">优化</Tag>
        </div>
        <Paragraph className="dark:text-gray-300">
          新增高级表格组件，支持虚拟滚动、行列冻结、单元格合并等功能；优化表单组件性能；修复多个已知问题。
        </Paragraph>
        <Button type="link" className="p-0">查看更新日志</Button>
      </div>
    </div>
  );
} 