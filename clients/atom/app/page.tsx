'use client';

import React from 'react';
import { Card, Typography, Row, Col } from 'antd';
import Link from 'next/link';
import {
  CodeOutlined,
  ToolOutlined,
  AppstoreOutlined,
  CloudServerOutlined,
} from '@ant-design/icons';

const { Title, Paragraph } = Typography;

export default function Home() {
  // 定义产品卡片数据
  const productCards = [
    {
      title: '火石设计 HuoS',
      description: '基于接口管理的低代码生成器',
      icon: <CodeOutlined style={{ fontSize: 24 }} />,
      link: '/',
      color: '#f59e0b',
    },
    {
      title: 'IG CLI',
      description: '插件式 CLI，打造你的专属工具',
      icon: <ToolOutlined style={{ fontSize: 24 }} />,
      link: '/tools/cli',
      color: '#3b82f6',
    },
    {
      title: 'IG DESIGN',
      description: '基于 ANT DESIGN 的业务组件库',
      icon: <AppstoreOutlined style={{ fontSize: 24 }} />,
      link: '/design',
      color: '#10b981',
    },
    {
      title: 'DEVOPS 平台',
      description: '零成本集成项目的 DEVOPS 平台',
      icon: <CloudServerOutlined style={{ fontSize: 24 }} />,
      link: '/devops',
      color: '#8b5cf6',
    },
  ];

  return (
    <div className="container mx-auto py-8">
      <div className="text-center mb-12">
        <Title level={2} className="dark:text-gray-100">欢迎使用火石设计平台</Title>
        <Paragraph className="text-gray-500 dark:text-gray-400 text-lg max-w-2xl mx-auto">
          这是一个集低代码生成、组件库、CLI工具和DevOps平台于一体的综合性开发环境
        </Paragraph>
      </div>

      <Row gutter={[24, 24]} className="px-4">
        {productCards.map((card, index) => (
          <Col xs={24} sm={12} lg={6} key={index}>
            <Link href={card.link} className="block h-full">
              <Card
                hoverable
                className="h-full transition-all duration-300 transform hover:translate-y-[-5px] dark:bg-gray-800 dark:border-gray-700"
                bodyStyle={{ padding: '24px' }}
              >
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center mb-4"
                  style={{ backgroundColor: `${card.color}20`, color: card.color }}
                >
                  {card.icon}
                </div>
                <Title level={4} className="mb-2 dark:text-white">
                  {card.title}
                </Title>
                <Paragraph className="text-gray-500 dark:text-gray-400">
                  {card.description}
                </Paragraph>
              </Card>
            </Link>
          </Col>
        ))}
      </Row>
    </div>
  );
}