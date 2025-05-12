'use client';

import React from 'react';
import { Typography, Card, Row, Col, Button, Divider, Space, Steps } from 'antd';
import {
  CodeOutlined,
  CodepenOutlined,
  ThunderboltOutlined,
  AppstoreAddOutlined,
  GithubOutlined,
} from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;

export default function CliPage() {
  return (
    <div className="container mx-auto">
      <div className="text-center mb-12">
        <Title level={2} className="dark:text-gray-100">IG CLI</Title>
        <Paragraph className="text-gray-500 dark:text-gray-400 text-lg max-w-2xl mx-auto">
          插件式命令行工具，让您轻松打造专属的开发工具链
        </Paragraph>
        <div className="mt-6 space-x-4">
          <Button type="primary" icon={<CodepenOutlined />} size="large">
            安装指南
          </Button>
          <Button icon={<GithubOutlined />} size="large">
            GitHub
          </Button>
        </div>
      </div>

      <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg mb-12 font-mono text-sm overflow-x-auto">
        <div className="dark:text-gray-300">
          <Text className="text-green-600 dark:text-green-400">$</Text> npm install -g @ignition-space/cli
        </div>
        <Divider className="my-4 border-gray-300 dark:border-gray-600" />
        <div className="dark:text-gray-300">
          <Text className="text-green-600 dark:text-green-400">$</Text> ig --help
        </div>
      </div>

      <div className="mb-12">
        <Title level={3} className="text-center mb-8 dark:text-gray-100">
          强大特性
        </Title>
        <Row gutter={[24, 24]}>
          <Col xs={24} md={8}>
            <Card className="h-full dark:bg-gray-800 dark:border-gray-700">
              <Title level={4} className="flex items-center dark:text-white">
                <AppstoreAddOutlined className="mr-2 text-blue-500" /> 插件架构
              </Title>
              <Paragraph className="dark:text-gray-400">
                完全插件化设计，支持自定义命令、钩子和中间件，轻松扩展或替换功能。
              </Paragraph>
            </Card>
          </Col>
          <Col xs={24} md={8}>
            <Card className="h-full dark:bg-gray-800 dark:border-gray-700">
              <Title level={4} className="flex items-center dark:text-white">
                <CodeOutlined className="mr-2 text-green-500" /> 代码生成
              </Title>
              <Paragraph className="dark:text-gray-400">
                内置多种代码生成器，支持组件、页面、API等模板，可根据项目需求自定义模板。
              </Paragraph>
            </Card>
          </Col>
          <Col xs={24} md={8}>
            <Card className="h-full dark:bg-gray-800 dark:border-gray-700">
              <Title level={4} className="flex items-center dark:text-white">
                <ThunderboltOutlined className="mr-2 text-purple-500" /> 开发加速
              </Title>
              <Paragraph className="dark:text-gray-400">
                提供项目脚手架、依赖分析、性能优化等工具，全方位提升开发效率。
              </Paragraph>
            </Card>
          </Col>
        </Row>
      </div>

      <div className="mb-12">
        <Title level={3} className="text-center mb-8 dark:text-gray-100">
          快速上手
        </Title>
        <Steps
          direction="vertical"
          items={[
            {
              title: '安装CLI',
              description: (
                <>
                  <Text className="dark:text-gray-300">通过npm全局安装CLI工具</Text>
                  <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded mt-2 font-mono text-sm">
                    <Text className="text-green-600 dark:text-green-400">$</Text> npm install -g @ignition-space/cli
                  </div>
                </>
              ),
            },
            {
              title: '创建项目',
              description: (
                <>
                  <Text className="dark:text-gray-300">使用CLI创建新项目</Text>
                  <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded mt-2 font-mono text-sm">
                    <Text className="text-green-600 dark:text-green-400">$</Text> ig create my-project
                  </div>
                </>
              ),
            },
            {
              title: '安装插件',
              description: (
                <>
                  <Text className="dark:text-gray-300">根据需要安装插件</Text>
                  <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded mt-2 font-mono text-sm">
                    <Text className="text-green-600 dark:text-green-400">$</Text> ig plugin add @ignition-space/plugin-react
                  </div>
                </>
              ),
            },
            {
              title: '开始开发',
              description: (
                <>
                  <Text className="dark:text-gray-300">使用CLI提供的命令进行开发</Text>
                  <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded mt-2 font-mono text-sm">
                    <Text className="text-green-600 dark:text-green-400">$</Text> ig generate component Button
                  </div>
                </>
              ),
            },
          ]}
        />
      </div>

      <Card className="mb-12 dark:bg-gray-800 dark:border-gray-700">
        <Title level={4} className="dark:text-white">可用插件</Title>
        <Row gutter={[16, 16]} className="mt-4">
          {[
            { name: '@ignition-space/plugin-react', desc: 'React组件和应用生成器' },
            { name: '@ignition-space/plugin-vue', desc: 'Vue组件和应用生成器' },
            { name: '@ignition-space/plugin-api', desc: 'RESTful API生成器' },
            { name: '@ignition-space/plugin-deploy', desc: '自动化部署工具' },
            { name: '@ignition-space/plugin-ui', desc: 'UI组件生成工具' },
            { name: '@ignition-space/plugin-test', desc: '测试脚本生成器' },
          ].map((plugin, index) => (
            <Col xs={24} sm={12} md={8} key={index}>
              <Card className="border dark:bg-gray-700 dark:border-gray-600">
                <div className="font-medium dark:text-white">{plugin.name}</div>
                <div className="text-gray-500 text-sm mt-1 dark:text-gray-300">{plugin.desc}</div>
              </Card>
            </Col>
          ))}
        </Row>
      </Card>
    </div>
  );
} 