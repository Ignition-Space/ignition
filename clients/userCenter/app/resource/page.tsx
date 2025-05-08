'use client';

import React, { useEffect, useState } from 'react';
import {
  Table,
  Button,
  Space,
  Tag,
  Card,
  Modal,
  Form,
  Input,
  Select,
  message,
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useResource } from '../hooks/useAdmin';
import {
  createResource,
  updateResource,
  deleteResource,
  ResourceData,
} from '../../lib/services/resourceService';
import { getSystemList } from '../../lib/services/systemService';

// 系统数据接口
interface ISystem {
  id: number;
  name: string;
  description: string;
}

const ResourcePage = () => {
  const { list, loading, fetchList } = useResource();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentResource, setCurrentResource] = useState<ResourceData | null>(
    null,
  );
  const [form] = Form.useForm();
  const [systemList, setSystemList] = useState<ISystem[]>([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchList();
    fetchSystemList();
  }, [fetchList]);

  // 获取系统列表
  const fetchSystemList = async () => {
    try {
      const result = (await getSystemList()) as unknown as ISystem[];
      setSystemList(result || []);
    } catch (error) {
      message.error('获取系统列表失败');
    }
  };

  // 打开新增/编辑弹窗
  const showModal = (record?: ResourceData) => {
    if (record) {
      setEditMode(true);
      setCurrentResource(record);
      form.setFieldsValue({
        name: record.name,
        key: record.key,
        type: record.type,
        description: record.description,
        parentId: record.parentId || 0,
        systemId: record.systemId,
      });
    } else {
      setEditMode(false);
      setCurrentResource(null);
      form.resetFields();
      form.setFieldsValue({
        parentId: 0,
        type: 'menu',
      });
    }
    setIsModalVisible(true);
  };

  // 关闭弹窗
  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  // 处理表单提交
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setSubmitting(true);

      if (editMode && currentResource) {
        // 更新资源
        await updateResource({
          ...values,
          id: currentResource.id,
        });
        message.success('更新资源成功');
      } else {
        // 创建资源
        await createResource(values);
        message.success('创建资源成功');
      }

      setIsModalVisible(false);
      fetchList();
    } catch (error) {
      console.error('提交失败:', error);
      message.error('操作失败');
    } finally {
      setSubmitting(false);
    }
  };

  // 删除资源
  const handleDelete = async (id: number) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这个资源吗？删除后将无法恢复。',
      okText: '确认',
      cancelText: '取消',
      onOk: async () => {
        try {
          await deleteResource(id);
          message.success('删除成功');
          fetchList();
        } catch (error) {
          message.error('删除失败');
        }
      },
    });
  };

  const columns = [
    {
      title: '资源名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '资源标识',
      dataIndex: 'key',
      key: 'key',
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => (
        <Tag color={type === 'menu' ? 'blue' : 'green'}>
          {type === 'menu' ? '菜单' : '接口'}
        </Tag>
      ),
    },
    {
      title: '所属系统',
      dataIndex: 'systemId',
      key: 'systemId',
      render: (systemId: number) => {
        const system = systemList.find((s) => s.id === systemId);
        return system?.name || '未知系统';
      },
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: ResourceData) => (
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
        <h1 className="text-2xl font-bold page-title mb-0">资源管理</h1>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          size="large"
          onClick={() => showModal()}
        >
          添加资源
        </Button>
      </div>

      <Card className="page-container">
        <Table
          columns={columns}
          dataSource={list}
          rowKey="id"
          loading={loading}
          pagination={{
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条记录`,
          }}
        />
      </Card>

      {/* 资源表单弹窗 */}
      <Modal
        title={editMode ? '编辑资源' : '添加资源'}
        open={isModalVisible}
        onCancel={handleCancel}
        onOk={handleSubmit}
        confirmLoading={submitting}
        okText={editMode ? '更新' : '添加'}
        cancelText="取消"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="资源名称"
            rules={[{ required: true, message: '请输入资源名称' }]}
          >
            <Input placeholder="请输入资源名称" />
          </Form.Item>
          <Form.Item
            name="key"
            label="资源标识"
            rules={[{ required: true, message: '请输入资源标识' }]}
          >
            <Input placeholder="请输入资源标识" />
          </Form.Item>
          <Form.Item
            name="type"
            label="资源类型"
            rules={[{ required: true, message: '请选择资源类型' }]}
          >
            <Select>
              <Select.Option value="menu">菜单</Select.Option>
              <Select.Option value="nomal">接口</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="systemId"
            label="所属系统"
            rules={[{ required: true, message: '请选择所属系统' }]}
          >
            <Select placeholder="请选择所属系统">
              {systemList.map((system) => (
                <Select.Option key={system.id} value={system.id}>
                  {system.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="parentId" label="父级资源" initialValue={0}>
            <Select>
              <Select.Option value={0}>无</Select.Option>
              {list.map((item: ResourceData) => (
                <Select.Option key={item.id} value={item.id}>
                  {item.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="description"
            label="资源描述"
            rules={[{ required: true, message: '请输入资源描述' }]}
          >
            <Input.TextArea placeholder="请输入资源描述" rows={3} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default function Resource() {
  return <ResourcePage />;
}
