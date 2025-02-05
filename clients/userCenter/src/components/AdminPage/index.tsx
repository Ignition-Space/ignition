import React, { useEffect } from 'react';
import {
  Form,
  Button,
  Input,
  Table,
  message,
  Popconfirm,
  Modal,
  Select,
  Card,
  Space,
} from 'antd';
import {
  EyeOutlined,
  ToolOutlined,
  DeleteOutlined,
  PlusCircleOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import './index.less';

const { Option } = Select;

interface AdminPageProps<T> {
  title: string;
  columns: ColumnsType<T>;
  formItems: React.ReactNode;
  state: {
    list: T[];
    loading: boolean;
    modal: {
      visible: boolean;
      type: 'add' | 'edit' | 'view';
      loading: boolean;
      currentItem: T | null;
    };
  };
  actions: {
    fetchList: () => Promise<void>;
    create: (values: any) => Promise<boolean>;
    update: (values: any) => Promise<boolean>;
    remove: (id: number) => Promise<boolean>;
    setModalInfo: (modal: any) => void;
    setSearchInfo: (searchInfo: any) => void;
  };
}

export function AdminPage<T extends { id: number }>({
  title,
  columns,
  formItems,
  state,
  actions,
}: AdminPageProps<T>) {
  const [form] = Form.useForm();
  const { list, loading, modal } = state;
  const { fetchList, create, update, remove, setModalInfo } = actions;

  useEffect(() => {
    fetchList();
  }, [fetchList]);

  const handleModalShow = (record: T | null, type: 'add' | 'edit' | 'view') => {
    setModalInfo({
      visible: true,
      type,
      currentItem: record,
    });

    if (type === 'add') {
      form.resetFields();
    } else {
      form.setFieldsValue(record);
    }
  };

  const handleModalOk = async () => {
    if (modal.type === 'view') {
      setModalInfo({ visible: false });
      return;
    }

    try {
      const values = await form.validateFields();
      const success =
        modal.type === 'add'
          ? await create(values)
          : await update({ ...values, id: modal.currentItem!.id });

      if (success) {
        message.success(`${modal.type === 'add' ? '新增' : '修改'}成功`);
      }
    } catch (err) {
      // Form validation error will be caught here
      console.error(err);
    }
  };

  const handleDelete = async (id: number) => {
    const success = await remove(id);
    if (success) {
      message.success('删除成功');
    }
  };

  const actionColumn = {
    title: '操作',
    key: 'action',
    width: 280,
    fixed: 'right' as const,
    render: (_: any, record: T) => (
      <Space size="middle">
        <Button
          type="link"
          size="middle"
          icon={<EyeOutlined />}
          onClick={() => handleModalShow(record, 'view')}
        >
          查看
        </Button>
        <Button
          type="link"
          size="middle"
          icon={<ToolOutlined />}
          onClick={() => handleModalShow(record, 'edit')}
        >
          修改
        </Button>
        <Popconfirm
          title="确定要删除吗？"
          onConfirm={() => handleDelete(record.id)}
        >
          <Button type="link" size="middle" danger icon={<DeleteOutlined />}>
            删除
          </Button>
        </Popconfirm>
      </Space>
    ),
  };

  return (
    <div className="admin-page">
      <Card className="admin-card">
        <div className="admin-header">
          <h2>{title}</h2>
          <Button
            type="primary"
            size="middle"
            icon={<PlusCircleOutlined />}
            onClick={() => handleModalShow(null, 'add')}
          >
            新增
          </Button>
        </div>

        <Table
          rowKey="id"
          loading={loading}
          columns={[...columns, actionColumn]}
          dataSource={list}
          pagination={{
            defaultPageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条数据`,
            pageSizeOptions: ['10', '20', '50', '100'],
          }}
          scroll={{ x: 'max-content' }}
        />
      </Card>

      <Modal
        title={
          {
            add: '新增',
            edit: '修改',
            view: '查看',
          }[modal.type]
        }
        open={modal.visible}
        onOk={handleModalOk}
        onCancel={() => setModalInfo({ visible: false })}
        confirmLoading={modal.loading}
        width={600}
        maskClosable={false}
        destroyOnClose
      >
        <Form
          form={form}
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 16 }}
          preserve={false}
        >
          {formItems}
        </Form>
      </Modal>
    </div>
  );
}
