'use client';

import { Typography, Button, Card, Row, Col, Space } from 'antd';
import { useRouter } from 'next/navigation';
import { AppstoreOutlined, BlockOutlined, CodeOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow">
        <div className="max-w-6xl mx-auto px-4 py-16">
          <div className="text-center mb-16">
            <Title level={1}>火石原子组件库</Title>
            <Paragraph className="text-lg mt-4 mb-8">
              高质量的React UI组件库，为火石工程化平台提供统一的视觉和交互体验
            </Paragraph>
            <Space size="large">
              <Button
                type="primary"
                size="large"
                onClick={() => router.push('/components/basic')}
              >
                开始使用
              </Button>
              <Button
                size="large"
                onClick={() => router.push('/components/editor')}
              >
                在线编辑器
              </Button>
            </Space>
          </div>

          <Row gutter={[24, 24]}>
            <Col xs={24} md={8}>
              <Card
                hoverable
                className="h-full"
                onClick={() => router.push('/components/basic')}
              >
                <div className="text-center">
                  <AppstoreOutlined className="text-4xl text-blue-500 mb-4" />
                  <Title level={3}>基础组件</Title>
                  <Paragraph>
                    包含按钮、表单、表格等基础UI组件，构建用户界面的基本元素
                  </Paragraph>
                </div>
              </Card>
            </Col>
            <Col xs={24} md={8}>
              <Card
                hoverable
                className="h-full"
                onClick={() => router.push('/components/business')}
              >
                <div className="text-center">
                  <BlockOutlined className="text-4xl text-green-500 mb-4" />
                  <Title level={3}>业务组件</Title>
                  <Paragraph>
                    针对特定业务场景开发的复合组件，封装了业务逻辑和数据处理
                  </Paragraph>
                </div>
              </Card>
            </Col>
            <Col xs={24} md={8}>
              <Card
                hoverable
                className="h-full"
                onClick={() => router.push('/components/editor')}
              >
                <div className="text-center">
                  <CodeOutlined className="text-4xl text-purple-500 mb-4" />
                  <Title level={3}>编辑器组件</Title>
                  <Paragraph>
                    代码编辑器组件，支持语法高亮、代码补全、错误提示等功能
                  </Paragraph>
                </div>
              </Card>
            </Col>
          </Row>
        </div>
      </main>

      <footer className="py-6 bg-gray-100">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <Paragraph className="text-gray-500">
            火石工程化平台 © {new Date().getFullYear()} 原子组件库
          </Paragraph>
        </div>
      </footer>
    </div>
  );
}