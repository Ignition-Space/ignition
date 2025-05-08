'use client';

import React, { useEffect, useState } from 'react';
import { Table, Button, Space, message, Modal, Form, Input, Card } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useSystem } from '../hooks/useSystem';
import { createSystem, updateSystem } from '../../lib/services/systemService';

// 系统数据接口
interface ISystem {
  id: number;
  name: string;
  description: string;
  status?: number;
  createTime?: string;
}

const SystemPage = () => {
  const { list, loading, fetchSystemList, deleteSystemItem } = useSystem();
  const [modalVisible, setModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState('添加系统');
  const [form] = Form.useForm();
  const [currentSystem, setCurrentSystem] = useState<ISystem | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchSystemList();
  }, [fetchSystemList]);

  // 删除系统
  const handleDelete = async (id: number) => {
    Modal.confirm({
      title: '确认删除',
      content: '删除系统将同时删除相关的角色和权限，确定要删除吗？',
      okText: '确认',
      cancelText: '取消',
      onOk: async () => {
        try {
          await deleteSystemItem(id);
          message.success('删除成功');
        } catch (error) {
          message.error('删除失败');
        }
      },
    });
  };

  // 显示添加/编辑弹窗
  const showModal = (record?: ISystem) => {
    if (record) {
      setModalTitle('编辑系统');
      setCurrentSystem(record);
      form.setFieldsValue({
        name: record.name,
        description: record.description,
      });
    } else {
      setModalTitle('添加系统');
      setCurrentSystem(null);
      form.resetFields();
    }
    setModalVisible(true);
  };

  // 关闭弹窗
  const handleCancel = () => {
    setModalVisible(false);
    form.resetFields();
  };

  // 提交表单
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setSubmitting(true);

      if (currentSystem?.id) {
        // 编辑系统
        await updateSystem({
          id: currentSystem.id,
          ...values,
        });
        message.success('系统更新成功');
      } else {
        // 添加系统
        await createSystem(values);
        message.success('系统添加成功');
      }

      setModalVisible(false);
      fetchSystemList();
    } catch (error) {
      console.error('提交失败:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const columns = [
    {
      title: '系统名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: number) => (status === 1 ? '启用' : '禁用'),
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: ISystem) => (
        <Space size="middle">
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => showModal(record)}
          >
            编辑
          </Button>
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id)}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold page-title mb-0">系统管理</h1>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          size="large"
          onClick={() => showModal()}
        >
          添加系统
        </Button>
      </div>

      <Card className="page-container">
        <Table
          columns={columns}
          dataSource={list as ISystem[]}
          rowKey="id"
          loading={loading}
          pagination={{
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条记录`,
          }}
        />
      </Card>

      {/* 系统表单弹窗 */}
      <Modal
        title={modalTitle}
        open={modalVisible}
        onCancel={handleCancel}
        onOk={handleSubmit}
        confirmLoading={submitting}
        okText={currentSystem ? '更新' : '添加'}
        cancelText="取消"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="系统名称"
            rules={[{ required: true, message: '请输入系统名称' }]}
          >
            <Input placeholder="请输入系统名称" />
          </Form.Item>
          <Form.Item
            name="description"
            label="系统描述"
            rules={[{ required: true, message: '请输入系统描述' }]}
          >
            <Input.TextArea placeholder="请输入系统描述" rows={3} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default function System() {
  return <SystemPage />;
}
