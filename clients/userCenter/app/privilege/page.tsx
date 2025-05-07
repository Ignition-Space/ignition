'use client';

import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Space,
  Tag,
  Card,
  Input,
  Form,
  Select,
  message,
  Popconfirm,
} from 'antd';
import {
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import FormModal from '../../components/common/FormModal';
import {
  getPrivilegeList,
  createPrivilege,
  updatePrivilege,
  deletePrivilege,
  changePrivilegeStatus,
  PrivilegeData,
  UpdatePrivilegeParams,
} from '../../lib/services/privilegeService';
import { getSystemList, SystemData } from '../../lib/services/systemService';

const PrivilegePage = () => {
  // 状态管理
  const [loading, setLoading] = useState(false);
  const [privileges, setPrivileges] = useState<PrivilegeData[]>([]);
  const [systems, setSystems] = useState<SystemData[]>([]);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [keyword, setKeyword] = useState('');

  // 模态框状态
  const [modalVisible, setModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState('添加权限');
  const [modalLoading, setModalLoading] = useState(false);
  const [editingPrivilege, setEditingPrivilege] =
    useState<UpdatePrivilegeParams | null>(null);

  // 获取权限列表
  const fetchPrivileges = async (
    page = currentPage,
    size = pageSize,
    search = keyword,
  ) => {
    try {
      setLoading(true);
      const response = await getPrivilegeList({
        keyword: search,
        page: { currentPage: page, pageSize: size },
      });
      setPrivileges(response.items || []);
      setTotal(response.total || 0);
    } catch (error) {
      message.error('获取权限列表失败');
    } finally {
      setLoading(false);
    }
  };

  // 获取系统列表
  const fetchSystems = async () => {
    try {
      const response = await getSystemList();
      setSystems(response || []);
    } catch (error) {
      message.error('获取系统列表失败');
    }
  };

  useEffect(() => {
    fetchPrivileges();
    fetchSystems();
  }, []);

  // 添加/编辑权限
  const handleAddOrEdit = (record?: PrivilegeData) => {
    if (record) {
      setModalTitle('编辑权限');
      setEditingPrivilege({
        id: record.id,
        name: record.name,
        resourceKey: record.resourceKey,
        description: record.description,
        action: record.action,
        systemId: record.systemId,
      });
    } else {
      setModalTitle('添加权限');
      setEditingPrivilege(null);
    }
    setModalVisible(true);
  };

  // 处理表单提交
  const handleFormSubmit = async (values: any) => {
    try {
      setModalLoading(true);
      if (editingPrivilege?.id) {
        // 更新权限
        await updatePrivilege({
          ...values,
          id: editingPrivilege.id,
        });
        message.success('更新权限成功');
      } else {
        // 创建权限
        await createPrivilege(values);
        message.success('创建权限成功');
      }
      setModalVisible(false);
      fetchPrivileges();
    } catch (error) {
      message.error(editingPrivilege?.id ? '更新权限失败' : '创建权限失败');
    } finally {
      setModalLoading(false);
    }
  };

  // 删除权限
  const handleDelete = async (id: number) => {
    try {
      await deletePrivilege(id);
      message.success('删除权限成功');
      fetchPrivileges();
    } catch (error) {
      message.error('删除权限失败');
    }
  };

  // 更改权限状态
  const handleChangeStatus = async (id: number, status: number) => {
    try {
      await changePrivilegeStatus({
        privilegeId: id,
        status: status === 1 ? 0 : 1,
      });
      message.success(status === 1 ? '禁用成功' : '启用成功');
      fetchPrivileges();
    } catch (error) {
      message.error(status === 1 ? '禁用失败' : '启用失败');
    }
  };

  // 搜索
  const handleSearch = () => {
    setCurrentPage(1);
    fetchPrivileges(1, pageSize, keyword);
  };

  // 刷新
  const handleRefresh = () => {
    setKeyword('');
    setCurrentPage(1);
    fetchPrivileges(1, pageSize, '');
  };

  // 表格列配置
  const columns = [
    {
      title: '权限名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '资源标识',
      dataIndex: 'resourceKey',
      key: 'resourceKey',
    },
    {
      title: '操作类型',
      dataIndex: 'action',
      key: 'action',
      render: (action: string) => {
        const actionMap: Record<string, { text: string; color: string }> = {
          manage: { text: '管理', color: 'purple' },
          create: { text: '创建', color: 'blue' },
          read: { text: '读取', color: 'green' },
          update: { text: '更新', color: 'orange' },
          delete: { text: '删除', color: 'red' },
        };
        const actionInfo = actionMap[action] || {
          text: action,
          color: 'default',
        };
        return <Tag color={actionInfo.color}>{actionInfo.text}</Tag>;
      },
    },
    {
      title: '所属系统',
      dataIndex: 'systemId',
      key: 'systemId',
      render: (systemId: number) => {
        const system = systems.find((s) => s.id === systemId);
        return system?.name || '-';
      },
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: number) => (
        <Tag color={status === 1 ? 'success' : 'error'}>
          {status === 1 ? '启用' : '禁用'}
        </Tag>
      ),
    },
    {
      title: '操作',
      key: 'operation',
      render: (_: any, record: PrivilegeData) => (
        <Space size="middle">
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleAddOrEdit(record)}
          />
          <Button
            type="text"
            icon={record.status === 1 ? <DeleteOutlined /> : <ReloadOutlined />}
            onClick={() => handleChangeStatus(record.id, record.status)}
          />
          <Popconfirm
            title="确定要删除该权限吗？"
            onConfirm={() => handleDelete(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button type="text" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="fade-in">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold page-title mb-0">权限管理</h2>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => handleAddOrEdit()}
        >
          添加权限
        </Button>
      </div>

      {/* 搜索区域 */}
      <Card className="mb-6">
        <div className="flex gap-4 items-center">
          <Input
            placeholder="搜索权限名称"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onPressEnter={handleSearch}
            style={{ width: 250 }}
            prefix={<SearchOutlined />}
            allowClear
          />
          <Button type="primary" onClick={handleSearch}>
            搜索
          </Button>
          <Button icon={<ReloadOutlined />} onClick={handleRefresh}>
            重置
          </Button>
        </div>
      </Card>

      {/* 表格数据 */}
      <Card className="page-container">
        <Table
          columns={columns}
          dataSource={privileges}
          rowKey="id"
          loading={loading}
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            total: total,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条`,
            onChange: (page, size) => {
              setCurrentPage(page);
              if (size !== pageSize) setPageSize(size);
              fetchPrivileges(page, size);
            },
          }}
        />
      </Card>

      {/* 添加/编辑权限弹窗 */}
      <FormModal
        title={modalTitle}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        onFinish={handleFormSubmit}
        confirmLoading={modalLoading}
        initialValues={editingPrivilege || {}}
      >
        <Form.Item
          name="name"
          label="权限名称"
          rules={[{ required: true, message: '请输入权限名称' }]}
        >
          <Input placeholder="请输入权限名称" />
        </Form.Item>

        <Form.Item
          name="resourceKey"
          label="资源标识"
          rules={[{ required: true, message: '请输入资源标识' }]}
        >
          <Input placeholder="请输入资源标识" />
        </Form.Item>

        <Form.Item
          name="systemId"
          label="所属系统"
          rules={[{ required: true, message: '请选择所属系统' }]}
        >
          <Select
            placeholder="请选择所属系统"
            options={systems.map((system) => ({
              label: system.name,
              value: system.id,
            }))}
          />
        </Form.Item>

        <Form.Item
          name="action"
          label="操作类型"
          rules={[{ required: true, message: '请选择操作类型' }]}
        >
          <Select
            placeholder="请选择操作类型"
            options={[
              { label: '管理', value: 'manage' },
              { label: '创建', value: 'create' },
              { label: '读取', value: 'read' },
              { label: '更新', value: 'update' },
              { label: '删除', value: 'delete' },
            ]}
          />
        </Form.Item>

        <Form.Item
          name="description"
          label="描述"
          rules={[{ required: true, message: '请输入描述' }]}
        >
          <Input.TextArea placeholder="请输入描述" rows={4} />
        </Form.Item>
      </FormModal>
    </div>
  );
};

export default function Privilege() {
  return <PrivilegePage />;
}
