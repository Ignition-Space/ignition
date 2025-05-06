'use client';

import React, { useEffect, useState } from 'react';
import {
  Table,
  Button,
  Space,
  message,
  Modal,
  Form,
  Input,
  Select,
  Card,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { useRole } from '../hooks/useRole';
import {
  createRole,
  updateRole,
  deleteRole,
  getPrivilegesByRoleId,
} from '../../lib/services/roleService';
import { getSystemList } from '../../lib/services/systemService';

// 角色数据接口
interface IRole {
  id: number;
  name: string;
  description: string;
  systemId: number;
  code?: string;
}

// 系统数据接口
interface ISystem {
  id: number;
  name: string;
  description: string;
}

// 响应数据接口
interface ApiResponse<T> {
  data: T;
  message?: string;
  code?: number;
}

const RoleContainer = () => {
  const { roleData, fetchAllRoles } = useRole();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalType, setModalType] = useState<'add' | 'edit'>('add');
  const [currentRole, setCurrentRole] = useState<IRole | null>(null);
  const [systemList, setSystemList] = useState<ISystem[]>([]);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [isPermModalVisible, setIsPermModalVisible] = useState(false);
  const [currentPermissions, setCurrentPermissions] = useState<any[]>([]);

  useEffect(() => {
    fetchAllRoles();
    fetchSystemList();
  }, [fetchAllRoles]);

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
  const showModal = (type: 'add' | 'edit', record?: IRole) => {
    setModalType(type);
    if (type === 'edit' && record) {
      setCurrentRole(record);
      form.setFieldsValue({
        name: record.name,
        description: record.description,
        systemId: record.systemId,
      });
    } else {
      setCurrentRole(null);
      form.resetFields();
    }
    setIsModalVisible(true);
  };

  // 关闭弹窗
  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  // 提交表单
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      if (modalType === 'add') {
        await createRole(values);
        message.success('添加角色成功');
      } else if (modalType === 'edit' && currentRole) {
        await updateRole({ ...values, id: currentRole.id });
        message.success('更新角色成功');
      }

      setIsModalVisible(false);
      form.resetFields();
      fetchAllRoles();
    } catch (error) {
      console.error('提交失败:', error);
    } finally {
      setLoading(false);
    }
  };

  // 删除角色
  const handleDelete = (id: number) => {
    Modal.confirm({
      title: '确认删除',
      content:
        '确定要删除这个角色吗？删除后将无法恢复，且关联的权限设置也会被删除。',
      okText: '确认',
      cancelText: '取消',
      onOk: async () => {
        try {
          await deleteRole(id);
          message.success('删除成功');
          fetchAllRoles();
        } catch (error) {
          message.error('删除失败');
        }
      },
    });
  };

  // 查看角色权限
  const showPermissions = async (roleId: number) => {
    try {
      const permissions = await getPrivilegesByRoleId(roleId);
      setCurrentPermissions(permissions || []);
      setIsPermModalVisible(true);
    } catch (error) {
      message.error('获取权限信息失败');
    }
  };

  const columns = [
    {
      title: '角色名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '角色描述',
      dataIndex: 'description',
      key: 'description',
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
      title: '操作',
      key: 'action',
      render: (_: any, record: IRole) => (
        <Space size="middle">
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => showModal('edit', record)}
          >
            编辑
          </Button>
          <Button
            type="text"
            icon={<SettingOutlined />}
            onClick={() => showPermissions(record.id)}
          >
            权限设置
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

  // 渲染权限表格列
  const permissionColumns = [
    {
      title: '权限名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '权限描述',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: '操作类型',
      dataIndex: 'action',
      key: 'action',
    },
    {
      title: '资源类型',
      dataIndex: 'resourceKey',
      key: 'resourceKey',
    },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold page-title mb-0">角色管理</h1>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          size="large"
          onClick={() => showModal('add')}
        >
          添加角色
        </Button>
      </div>

      <Card className="page-container">
        <Table
          columns={columns}
          dataSource={roleData as IRole[]}
          rowKey="id"
          loading={loading}
          pagination={{
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条记录`,
          }}
        />
      </Card>

      {/* 角色表单弹窗 */}
      <Modal
        title={modalType === 'add' ? '添加角色' : '编辑角色'}
        open={isModalVisible}
        onCancel={handleCancel}
        onOk={handleSubmit}
        okText={modalType === 'add' ? '添加' : '更新'}
        cancelText="取消"
        confirmLoading={loading}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="角色名称"
            rules={[{ required: true, message: '请输入角色名称' }]}
          >
            <Input placeholder="请输入角色名称" />
          </Form.Item>
          <Form.Item
            name="description"
            label="角色描述"
            rules={[{ required: true, message: '请输入角色描述' }]}
          >
            <Input.TextArea placeholder="请输入角色描述" rows={3} />
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
        </Form>
      </Modal>

      {/* 权限查看弹窗 */}
      <Modal
        title="角色权限"
        open={isPermModalVisible}
        onCancel={() => setIsPermModalVisible(false)}
        footer={[
          <Button key="back" onClick={() => setIsPermModalVisible(false)}>
            关闭
          </Button>,
        ]}
        width={800}
      >
        <Table
          columns={permissionColumns}
          dataSource={currentPermissions}
          rowKey="id"
          pagination={false}
        />
      </Modal>
    </div>
  );
};

export default function RolePage() {
  return <RoleContainer />;
}
