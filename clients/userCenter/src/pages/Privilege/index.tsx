/** 权限管理页 **/

import React from 'react';
import { Form, Select, Input } from 'antd';
import { AdminPage } from '@/components/AdminPage';
import { usePrivilege } from '@/hooks/useAdmin';
import type { Privilege } from '@/types/admin';
import dayjs from 'dayjs';

const { Option } = Select;
const { TextArea } = Input;

const PrivilegeContainer = () => {
  const privilege = usePrivilege();

  const columns = [
    {
      title: '权限名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '权限代码',
      dataIndex: 'code',
      key: 'code',
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
      render: (time: string) => dayjs(time).format('YYYY-MM-DD HH:mm:ss'),
    },
  ];

  const formItems = (
    <>
      <Form.Item
        label="权限名称"
        name="name"
        rules={[
          { required: true, message: '请输入权限名称' },
          { max: 50, message: '最多50个字符' },
        ]}
      >
        <Input placeholder="请输入权限名称" />
      </Form.Item>
      <Form.Item
        label="权限代码"
        name="code"
        rules={[
          { required: true, message: '请输入权限代码' },
          { max: 50, message: '最多50个字符' },
        ]}
      >
        <Input placeholder="请输入权限代码" />
      </Form.Item>
      <Form.Item
        label="描述"
        name="description"
        rules={[{ max: 200, message: '最多200个字符' }]}
      >
        <TextArea rows={4} placeholder="请输入描述" />
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
    <AdminPage<Privilege>
      title="权限管理"
      columns={columns}
      formItems={formItems}
      state={privilege}
      actions={{
        fetchList: privilege.fetchList,
        create: privilege.create,
        update: privilege.update,
        remove: privilege.remove,
        setModalInfo: privilege.setModalInfo,
        setSearchInfo: privilege.setSearchInfo,
      }}
    />
  );
};

export default PrivilegeContainer;
