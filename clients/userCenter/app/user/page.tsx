'use client';

import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Space,
  message,
  Input,
  Card,
  Tag,
  Tooltip,
  Dropdown,
  Modal,
  Form,
  Select,
} from 'antd';
import {
  UserAddOutlined,
  EditOutlined,
  DeleteOutlined,
  EllipsisOutlined,
  FilterOutlined,
  ReloadOutlined,
  LockOutlined,
} from '@ant-design/icons';
import { useUserManage } from '../hooks/useUserManage';
import {
  createUser,
  updateUser,
  changeUserStatus,
} from '../../lib/services/userService';

// 用户数据接口 - 本地使用的接口定义
interface IUser {
  id: string | number;
  username: string;
  email: string;
  status: number;
  createdAt?: string;
  avatar?: string;
  role?: string;
}

const UserContainer = () => {
  const {
    userList,
    total,
    currentPage,
    pageSize,
    loading,
    fetchUserList,
    deleteUser,
  } = useUserManage();
  const [searchText, setSearchText] = useState('');
  const [animateIn, setAnimateIn] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentUser, setCurrentUser] = useState<IUser | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchUserList(1, 10);
    // 添加入场动画
    setTimeout(() => setAnimateIn(true), 100);
  }, [fetchUserList]);

  const handleDelete = async (id: string) => {
    Modal.confirm({
      title: '确认删除',
      content: '您确定要删除这个用户吗？此操作不可逆。',
      okText: '确认',
      cancelText: '取消',
      onOk: async () => {
        try {
          await deleteUser(id);
          message.success('删除成功');
        } catch (error) {
          message.error('删除失败');
        }
      },
    });
  };

  const handleSearch = () => {
    fetchUserList(1, pageSize, searchText);
  };

  const handleChangeStatus = async (
    userId: number | string,
    status: number,
  ) => {
    try {
      const numericId = typeof userId === 'string' ? parseInt(userId) : userId;
      await changeUserStatus({
        userId: numericId,
        status: status === 1 ? 0 : 1,
      });
      message.success(`用户状态已${status === 1 ? '禁用' : '激活'}`);
      fetchUserList(currentPage, pageSize);
    } catch (error) {
      message.error('操作失败');
    }
  };

  const showModal = (user?: IUser) => {
    if (user) {
      setEditMode(true);
      setCurrentUser(user);
      form.setFieldsValue({
        username: user.username,
        email: user.email,
        status: user.status,
      });
    } else {
      setEditMode(false);
      setCurrentUser(null);
      form.resetFields();
    }
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (editMode && currentUser) {
        // 更新用户
        await updateUser({
          id:
            typeof currentUser.id === 'string'
              ? parseInt(currentUser.id)
              : currentUser.id,
          ...values,
        });
        message.success('更新成功');
      } else {
        // 创建用户
        await createUser(values);
        message.success('创建成功');
      }
      setIsModalVisible(false);
      fetchUserList(currentPage, pageSize);
    } catch (errorInfo) {
      console.log('表单验证失败:', errorInfo);
    }
  };

  const columns = [
    {
      title: '用户名',
      dataIndex: 'username',
      key: 'username',
      render: (text: string) => (
        <a className="text-primary font-medium">{text}</a>
      ),
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: number) => {
        const statusMap: Record<number, React.ReactNode> = {
          1: <Tag color="success">活跃</Tag>,
          0: <Tag color="default">禁用</Tag>,
          2: <Tag color="warning">待验证</Tag>,
        };

        return statusMap[status] || <Tag color="default">未知</Tag>;
      },
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (createdAt: string) => {
        if (!createdAt) return '-';
        return new Date(createdAt).toLocaleDateString('zh-CN');
      },
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: IUser) => (
        <Space size="middle">
          <Tooltip title="编辑用户">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => showModal(record)}
            />
          </Tooltip>
          <Tooltip title={record.status === 1 ? '禁用用户' : '激活用户'}>
            <Button
              type="text"
              icon={<LockOutlined />}
              onClick={() => handleChangeStatus(record.id, record.status)}
            />
          </Tooltip>
          <Tooltip title="删除用户">
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              onClick={() => handleDelete(record.id.toString())}
            />
          </Tooltip>
          <Dropdown
            menu={{
              items: [
                { key: '1', label: '查看详情' },
                { key: '2', label: '分配角色' },
                { key: '3', label: '重置密码' },
              ],
            }}
            trigger={['click']}
          >
            <Button type="text" icon={<EllipsisOutlined />} />
          </Dropdown>
        </Space>
      ),
    },
  ];

  return (
    <div
      className={`transition-all duration-500 ${animateIn ? 'opacity-100' : 'opacity-0'}`}
    >
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold page-title mb-0">用户管理</h1>
        <Button
          type="primary"
          icon={<UserAddOutlined />}
          size="large"
          onClick={() => showModal()}
        >
          添加用户
        </Button>
      </div>

      <Card className="mb-6">
        <div className="flex flex-wrap gap-4 items-center">
          <Input.Search
            placeholder="搜索用户名或邮箱"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onSearch={handleSearch}
            style={{ width: 300 }}
            allowClear
          />

          <Space>
            <Button icon={<FilterOutlined />}>筛选</Button>
            <Button
              icon={<ReloadOutlined />}
              onClick={() => fetchUserList(1, pageSize)}
            >
              刷新
            </Button>
          </Space>
        </div>
      </Card>

      <Card className="page-container">
        <Table
          columns={columns}
          dataSource={userList as IUser[]}
          rowKey="id"
          loading={loading}
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            total: total,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条记录`,
            onChange: (page, pageSize) => fetchUserList(page, pageSize || 10),
          }}
        />
      </Card>

      {/* 用户表单弹窗 */}
      <Modal
        title={editMode ? '编辑用户' : '添加用户'}
        open={isModalVisible}
        onCancel={handleCancel}
        onOk={handleSubmit}
        okText={editMode ? '更新' : '创建'}
        cancelText="取消"
        maskClosable={false}
      >
        <Form form={form} layout="vertical" initialValues={{ status: 1 }}>
          <Form.Item
            name="username"
            label="用户名"
            rules={[{ required: true, message: '请输入用户名' }]}
          >
            <Input placeholder="请输入用户名" />
          </Form.Item>
          <Form.Item
            name="email"
            label="邮箱"
            rules={[
              { required: true, message: '请输入邮箱' },
              { type: 'email', message: '请输入有效的邮箱地址' },
            ]}
          >
            <Input placeholder="请输入邮箱" />
          </Form.Item>
          {!editMode && (
            <Form.Item
              name="password"
              label="密码"
              rules={[{ required: true, message: '请输入密码' }]}
            >
              <Input.Password placeholder="请输入密码" />
            </Form.Item>
          )}
          <Form.Item name="status" label="状态">
            <Select>
              <Select.Option value={1}>活跃</Select.Option>
              <Select.Option value={0}>禁用</Select.Option>
              <Select.Option value={2}>待验证</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default function UserPage() {
  return <UserContainer />;
}
