/** Role 系统管理/系统管理 **/

import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useSetState, useMount } from 'react-use';
import {
  Form,
  Button,
  Input,
  Table,
  message,
  Popconfirm,
  Modal,
  Tooltip,
  Divider,
  Select,
} from 'antd';
import {
  EyeOutlined,
  ToolOutlined,
  DeleteOutlined,
  PlusCircleOutlined,
  SearchOutlined,
} from '@ant-design/icons';

import tools from '@/util/tools'; // 工具
import dayjs from 'dayjs';

const { TextArea } = Input;
const { Option } = Select;
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 4 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 19 },
  },
};

import { RootState, Dispatch } from '@/store';
import { operateType, ModalType, SearchInfo, Role, Res } from './index.type';

import './index.less';
import { SystemParam } from '@/models/index.type';

const SystemContainer = () => {
  const dispatch = useDispatch<Dispatch>();
  const p = useSelector((state: RootState) => state.app.powersCode);

  const [form] = Form.useForm();
  const [data, setData] = useState<Role[]>([]); // 当前页面列表数据
  const [loading, setLoading] = useState<boolean>(false); // 数据是否正在加载中

  // 模态框相关参数控制
  const [modal, setModal] = useSetState<ModalType>({
    operateType: 'add',
    nowData: null,
    modalShow: false,
    modalLoading: false,
  });

  // 搜索相关参数
  const [searchInfo, setSearchInfo] = useSetState<SearchInfo>({
    name: undefined, // 系统名
    status: undefined, // 状态
  });

  // 生命周期 - 首次加载组件时触发
  useMount(() => {
    getData();
  });

  // 函数- 查询当前页面所需列表数据
  const getData = async () => {
    const params = {
      keyword: searchInfo.name,
      status: searchInfo.status,
    };
    setLoading(true);
    try {
      const res: Res = await dispatch.sys.getSysTem(tools.clearNull(params));
      if (res && res.status === 200) {
        setData(res.data);
      } else {
        message.error(res?.message ?? '获取失败');
      }
    } finally {
      setLoading(false);
    }
  };

  // 搜索 - 名称输入框值改变时触发
  const searchnameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length < 20) {
      setSearchInfo({ name: e.target.value });
    }
  };

  // 搜索 - 状态下拉框选择时触发
  const searchstatusChange = (v: number) => {
    setSearchInfo({ status: v });
  };

  // 搜索
  const onSearch = () => {
    getData();
  };

  /**
   * 添加/修改/查看 模态框出现
   * @param data 当前选中的那条数据
   * @param type add添加/up修改/see查看
   * **/
  const onModalShow = (data, type: operateType) => {
    setModal({
      modalShow: true,
      nowData: data,
      operateType: type,
    });
    setTimeout(() => {
      if (type === 'add') {
        form.resetFields();
      } else {
        form.setFieldsValue(data);
      }
    });
  };

  /** 模态框确定 **/
  const onOk = async () => {
    if (modal.operateType === 'see') {
      onClose();
      return;
    }

    try {
      const values = await form.validateFields();
      setModal({
        modalLoading: true,
      });

      if (modal.operateType === 'add') {
        // 新增
        try {
          const res: Res = await dispatch.sys.addSystem(values);
          if (res && res.status === 200) {
            message.success('添加成功');
            getData();
            onClose();
          }
        } finally {
          setModal({
            modalLoading: false,
          });
        }
      } else {
        // 修改
        values.id = modal?.nowData?.id;
        try {
          const res: Res = await dispatch.sys.upSystem(values);
          if (res && res.status === 200) {
            message.success('修改成功');
            getData();
            onClose();
          }
        } finally {
          setModal({
            modalLoading: false,
          });
        }
      }
    } catch {
      // 未通过校验
    }
  };

  // 删除某一条数据
  const onDel = async (id: number) => {
    setLoading(true);
    try {
      const res = await dispatch.sys.delSystem({ id });
      if (res && res.status === 200) {
        message.success('删除成功');
        getData();
      } else {
        message.error(res?.message ?? '操作失败');
      }
    } finally {
      setLoading(false);
    }
  };

  /** 模态框关闭 **/
  const onClose = () => {
    setModal({ modalShow: false });
  };

  // 构建字段
  const tableColumns = [
    {
      title: 'id',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: '系统名',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '创建人',
      dataIndex: 'creatorName',
      key: 'creatorName',
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      render: (text) => dayjs(text).format('YYYY-MM-DD hh:mm:ss'),
    },
    {
      title: '更新人',
      dataIndex: 'updateName',
      key: 'updateName',
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
      key: 'updateTime',
      render: (text) => dayjs(text).format('YYYY-MM-DD hh:mm:ss'),
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
      render: (v: number) =>
        v === 1 ? (
          <span style={{ color: 'green' }}>启用</span>
        ) : (
          <span style={{ color: 'red' }}>禁用</span>
        ),
    },
    {
      title: '操作',
      key: 'control',
      width: 200,
      render: (v: number, record) => {
        const controls = [];
        controls.push(
          <span
            key="0"
            className="control-btn green"
            onClick={() => onModalShow(record, 'see')}
          >
            <Tooltip placement="top" name="查看">
              <EyeOutlined />
            </Tooltip>
          </span>,
        );
        controls.push(
          <span
            key="1"
            className="control-btn blue"
            onClick={() => onModalShow(record, 'up')}
          >
            <Tooltip placement="top" title="修改">
              <ToolOutlined />
            </Tooltip>
          </span>,
        );
        controls.push(
          <Popconfirm
            key="3"
            title="确定删除吗?"
            onConfirm={() => onDel(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <span className="control-btn red">
              <Tooltip placement="top" title="删除">
                <DeleteOutlined />
              </Tooltip>
            </span>
          </Popconfirm>,
        );

        const result: JSX.Element[] = [];
        controls.forEach((item, index) => {
          if (index) {
            result.push(<Divider key={`line${index}`} type="vertical" />);
          }
          result.push(item);
        });
        return result;
      },
    },
  ];

  return (
    <div>
      <div className="g-search">
        <ul className="search-func">
          <li>
            <Button
              type="primary"
              icon={<PlusCircleOutlined />}
              onClick={() => onModalShow(null, 'add')}
            >
              添加系统
            </Button>
          </li>
        </ul>
        <Divider type="vertical" />
        <ul className="search-ul">
          <li>
            <Input
              placeholder="请输入系统名"
              onChange={searchnameChange}
              value={searchInfo.name}
            />
          </li>
          <li>
            <Select
              placeholder="请选择状态"
              allowClear
              style={{ width: '200px' }}
              onChange={searchstatusChange}
              value={searchInfo.status}
            >
              <Option value={1}>启用</Option>
              <Option value={-1}>禁用</Option>
            </Select>
          </li>
          <li>
            <Button type="primary" icon={<SearchOutlined />} onClick={onSearch}>
              搜索
            </Button>
          </li>
        </ul>
      </div>
      <div className="diy-table">
        <Table
          rowKey="id"
          columns={tableColumns}
          loading={loading}
          dataSource={data}
          pagination={{
            showTotal: (total) => `共 ${total} 条数据`,
          }}
        />
      </div>

      {/* 新增&修改&查看 模态框 */}
      <Modal
        title={{ add: '新增', up: '修改', see: '查看' }[modal.operateType]}
        open={modal.modalShow}
        onOk={() => onOk()}
        onCancel={() => onClose()}
        confirmLoading={modal.modalLoading}
      >
        <Form
          form={form}
          initialValues={{
            formstatus: 1,
          }}
        >
          <Form.Item
            label="系统名"
            name="name"
            {...formItemLayout}
            rules={[
              { required: true, whitespace: true, message: '必填' },
              { max: 12, message: '最多输入12位字符' },
            ]}
          >
            <Input
              placeholder="请输入系统名"
              disabled={modal.operateType === 'see'}
            />
          </Form.Item>
          <Form.Item
            label="描述"
            name="description"
            {...formItemLayout}
            rules={[{ max: 100, message: '最多输入100个字符' }]}
          >
            <TextArea
              rows={4}
              disabled={modal.operateType === 'see'}
              autoSize={{ minRows: 2, maxRows: 6 }}
            />
          </Form.Item>
          <Form.Item
            label="状态"
            name="status"
            initialValue={0}
            {...formItemLayout}
            rules={[{ required: true, message: '请选择状态' }]}
          >
            <Select disabled={modal.operateType === 'see'}>
              <Option key={1} value={1}>
                启用
              </Option>
              <Option key={0} value={0}>
                禁用
              </Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default SystemContainer;
