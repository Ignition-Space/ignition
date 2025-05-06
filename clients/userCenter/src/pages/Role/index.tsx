/** Role 系统管理/角色管理 **/

import React, { useEffect } from 'react';
import { Form, Input, Select } from 'antd';

const { TextArea } = Input;
const { Option } = Select;

import { Role } from './index.type';

import dayjs from 'dayjs';
import { AdminPage } from '@/components/AdminPage';
import { useRole } from '@/hooks/useAdmin';
import { useSystem } from '@/hooks/useSystem';

const RoleContainer = () => {
  const role = useRole();
  const system = useSystem();

  useEffect(() => {
    if (!system.list) {
      system.fetchSystemList();
    }
  }, [system.list]);

  const columns = [
    {
      title: '角色名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '系统',
      dataIndex: 'systemName',
      key: 'systemName',
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
        label="角色名称"
        name="name"
        rules={[
          { required: true, message: '请输入角色名称' },
          { max: 50, message: '最多50个字符' },
        ]}
      >
        <Input placeholder="请输入角色名称" />
      </Form.Item>
      <Form.Item
        label="系统"
        name="systemId"
        rules={[{ required: true, message: '请选择系统' }]}
      >
        <Select placeholder="请选择系统">
          {system?.list?.map((item) => (
            <Option key={item.id} value={item.id}>
              {item.name}
            </Option>
          ))}
        </Select>
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
    <AdminPage<Role>
      title="角色管理"
      columns={columns}
      formItems={formItems}
      state={role}
      actions={{
        fetchList: role.fetchList,
        create: role.create,
        update: role.update,
        remove: role.remove,
        setModalInfo: role.setModalInfo,
        setSearchInfo: role.setSearchInfo,
      }}
    />
  );
};

export default RoleContainer;
