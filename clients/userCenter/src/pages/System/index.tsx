/** 系统管理页 **/

import React from 'react';
import { Form, Select, Input } from 'antd';
import { AdminPage } from '@/components/AdminPage';
import { useSystem } from '@/hooks/useSystem';
import type { SystemItem } from '@/types/system';
import dayjs from 'dayjs';

const { Option } = Select;
const { TextArea } = Input;

const SystemContainer = () => {
  const system = useSystem();

  const columns = [
    {
      title: '系统名',
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
      render: (time: string) => dayjs(time).format('YYYY-MM-DD HH:mm:ss'),
    },
  ];

  const formItems = (
    <>
      <Form.Item
        label="系统名"
        name="name"
        rules={[
          { required: true, message: '请输入系统名' },
          { max: 12, message: '最多12个字符' },
        ]}
      >
        <Input placeholder="请输入系统名" />
      </Form.Item>
      <Form.Item
        label="描述"
        name="description"
        rules={[{ max: 100, message: '最多100个字符' }]}
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
    <AdminPage<SystemItem>
      title="系统管理"
      columns={columns}
      formItems={formItems}
      state={system}
      actions={{
        fetchList: system.fetchSystemList,
        create: system.createSystem,
        update: system.updateSystemItem,
        remove: system.deleteSystemItem,
        setModalInfo: system.setModalInfo,
        setSearchInfo: system.setSearchInfo,
      }}
    />
  );
};

export default SystemContainer;
