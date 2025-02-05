/** 资源管理页 **/

import React from 'react';
import { Form, Input, Select, InputNumber, TreeSelect } from 'antd';
import { AdminPage } from '@/components/AdminPage';
import { useResource } from '@/hooks/useAdmin';
import type { Resource } from '@/types/admin';
import dayjs from 'dayjs';

const { Option } = Select;
const { TextArea } = Input;

const ResourceContainer = () => {
  const resource = useResource();

  const columns = [
    {
      title: '资源名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '路径',
      dataIndex: 'path',
      key: 'path',
    },
    {
      title: '图标',
      dataIndex: 'icon',
      key: 'icon',
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      render: (type: number) =>
        ({
          1: '菜单',
          2: '按钮',
          3: '接口',
        })[type],
    },
    {
      title: '排序',
      dataIndex: 'sort',
      key: 'sort',
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
        label="资源名称"
        name="name"
        rules={[
          { required: true, message: '请输入资源名称' },
          { max: 50, message: '最多50个字符' },
        ]}
      >
        <Input placeholder="请输入资源名称" />
      </Form.Item>
      <Form.Item
        label="资源路径"
        name="path"
        rules={[
          { required: true, message: '请输入资源路径' },
          { max: 100, message: '最多100个字符' },
        ]}
      >
        <Input placeholder="请输入资源路径" />
      </Form.Item>
      <Form.Item
        label="图标"
        name="icon"
        rules={[{ max: 50, message: '最多50个字符' }]}
      >
        <Input placeholder="请输入图标名称" />
      </Form.Item>
      <Form.Item
        label="父级资源"
        name="parentId"
        rules={[{ required: true, message: '请选择父级资源' }]}
      >
        <TreeSelect
          placeholder="请选择父级资源"
          treeData={resource.list.map((item) => ({
            title: item.name,
            value: item.id,
            key: item.id,
          }))}
          allowClear
          treeDefaultExpandAll
        />
      </Form.Item>
      <Form.Item
        label="资源类型"
        name="type"
        rules={[{ required: true, message: '请选择资源类型' }]}
      >
        <Select placeholder="请选择资源类型">
          <Option value={1}>菜单</Option>
          <Option value={2}>按钮</Option>
          <Option value={3}>接口</Option>
        </Select>
      </Form.Item>
      <Form.Item
        label="排序"
        name="sort"
        rules={[{ required: true, message: '请输入排序号' }]}
      >
        <InputNumber min={0} max={9999} placeholder="请输入排序号" />
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
      <Form.Item
        label="描述"
        name="description"
        rules={[{ max: 200, message: '最多200个字符' }]}
      >
        <TextArea rows={4} placeholder="请输入描述" />
      </Form.Item>
    </>
  );

  return (
    <AdminPage<Resource>
      title="资源管理"
      columns={columns}
      formItems={formItems}
      state={resource}
      actions={{
        fetchList: resource.fetchList,
        create: resource.create,
        update: resource.update,
        remove: resource.remove,
        setModalInfo: resource.setModalInfo,
        setSearchInfo: resource.setSearchInfo,
      }}
    />
  );
};

export default ResourceContainer;
