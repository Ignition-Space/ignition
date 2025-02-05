/** User 系统管理/用户管理 **/

import './index.less';

import React from 'react';
import { Button, Form, Input, Select } from 'antd';
import { MehOutlined } from '@ant-design/icons';
import { useAdminUser } from '@/hooks/useAdmin';
import { useRole } from '@/hooks/useRole';
import type { AdminUser } from '@/types/admin';
import dayjs from 'dayjs';
import RoleTree from '@/components/TreeChose/RoleTree';
import { AdminPage } from '@/components/AdminPage';

const { Option } = Select;

const UserContainer = () => {
  const adminUser = useAdminUser();
  const role = useRole();

  const columns = [
    {
      title: '用户名',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: '手机号',
      dataIndex: 'phone',
      key: 'phone',
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
      render: (time: string) => dayjs(time).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: AdminUser) => (
        <>
          <Button
            type="link"
            icon={<MehOutlined />}
            onClick={() => role.showRoleTree(record.id)}
          >
            分配角色
          </Button>
        </>
      ),
    },
  ];

  const formItems = (
    <>
      <Form.Item
        label="用户名"
        name="username"
        rules={[
          { required: true, message: '请输入用户名' },
          { max: 50, message: '最多50个字符' },
        ]}
      >
        <Input placeholder="请输入用户名" />
      </Form.Item>
      <Form.Item
        label="邮箱"
        name="email"
        rules={[
          { required: true, message: '请输入邮箱' },
          { type: 'email', message: '请输入正确的邮箱格式' },
        ]}
      >
        <Input placeholder="请输入邮箱" />
      </Form.Item>
      <Form.Item
        label="手机号"
        name="phone"
        rules={[{ pattern: /^1\d{10}$/, message: '请输入正确的手机号' }]}
      >
        <Input placeholder="请输入手机号" />
      </Form.Item>
      <Form.Item
        label="状态"
        name="status"
        rules={[{ required: true, message: '请选择状态' }]}
      >
        <Select placeholder="请选择状态">
          <Option value={1}>启用</Option>
          <Option value={0}>禁用</Option>
        </Select>
      </Form.Item>
    </>
  );

  return (
    <>
      <AdminPage<AdminUser>
        title="用户管理"
        columns={columns}
        formItems={formItems}
        state={adminUser}
        actions={{
          fetchList: adminUser.fetchList,
          create: adminUser.create,
          update: adminUser.update,
          remove: adminUser.remove,
          setModalInfo: adminUser.setModalInfo,
          setSearchInfo: adminUser.setSearchInfo,
        }}
      />
      <RoleTree
        title="分配角色"
        visible={role.roleTreeShow}
        treeData={role.roleData}
        defaultCheckedKeys={role.roleTreeDefault}
        loading={role.roleTreeLoading}
        onOk={role.assignRoles}
        onClose={role.hideRoleTree}
      />
    </>
  );
};

export default UserContainer;
