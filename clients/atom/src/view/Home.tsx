import { Button, Checkbox, Form, Input } from 'antd';
import React from 'react';

const Test = () => {
  const onFinish = (values) => {
    console.log('Success:', values);
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <Form
      name="basic"
      labelCol={{
        span: 8,
      }}
      wrapperCol={{
        span: 16,
      }}
      initialValues={{
        remember: true,
      }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
    >
      <Form.Item label="站点id" name="id">
        <Input placeholder="63183f3635609a2d4965ccaa" />
      </Form.Item>

      <Form.Item label="解析URL" name="url">
        <Input placeholder="http://localhost:3004/api/doc-json" />
      </Form.Item>

      <Form.Item label="解析接口来源" name="apiType">
        <Input placeholder="0" />
      </Form.Item>

      <Form.Item label="站点名称" name="name">
        <Input placeholder="搭建服务" />
      </Form.Item>

      <Form.Item label="站点类型" name="type">
        <Input placeholder="0" />
      </Form.Item>

      <Form.Item
        wrapperCol={{
          offset: 8,
          span: 16,
        }}
      >
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};

export default Test;
