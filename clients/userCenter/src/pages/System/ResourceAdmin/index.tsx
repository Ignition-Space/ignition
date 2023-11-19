/** 资源管理页 **/

import React, { useState, useCallback, useMemo } from 'react';
import { useSetState, useMount } from 'react-use';
import { useSelector, useDispatch } from 'react-redux';
import {
  Tree,
  Button,
  Table,
  Tooltip,
  Popconfirm,
  Modal,
  Form,
  Select,
  Input,
  InputNumber,
  message,
  Divider,
} from 'antd';
import {
  EyeOutlined,
  ToolOutlined,
  DeleteOutlined,
  PlusCircleOutlined,
} from '@ant-design/icons';
import { cloneDeep } from 'lodash';

import { IconsData } from '@/util/json';

const { Option } = Select;
const { TextArea } = Input;

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

import {
  TableRecordData,
  Menu,
  ModalType,
  operateType,
  MenuParam,
  TreeSourceData,
} from './index.type';
import { RootState, Dispatch } from '@/store';

import './index.less';
import { Page, Res } from '../UserAdmin/index.type';
import { SearchInfo } from '../RoleAdmin/index.type';

function MenuAdminContainer() {
  const p = useSelector((state: RootState) => state.app.powersCode);
  const dispatch = useDispatch<Dispatch>();

  const [form] = Form.useForm();
  const [data, setData] = useState<Menu[]>([]); // 所有的资源数据（未分层级）
  const [loading, setLoading] = useState<boolean>(false); // 数据是否正在加载中
  const [systemOptions, setSystemOptions] = useState([]);
  // 搜索相关参数
  const [searchInfo, setSearchInfo] = useSetState<SearchInfo>({
    name: undefined, // 角色名
    status: undefined, // 状态
  });

  // 分页相关参数控制
  const [page, setPage] = useSetState<Page>({
    pageNum: 1,
    pageSize: 10,
    total: 0,
  });

  // 模态框相关参数控制
  const [modal, setModal] = useSetState<ModalType>({
    operateType: 'add',
    nowData: null,
    modalShow: false,
    modalLoading: false,
  });

  const [treeSelect, setTreeSelect] = useState<{ title?: string; id?: number }>(
    {},
  );

  // 生命周期 - 首次加载组件时触发
  useMount(() => {
    getData(page);
    getSysTemOpt();
  });

  const getSysTemOpt = async () => {
    try {
      const res: Res = await dispatch.sys.getSysTem({ status: 1 });
      if (res && res.status === 200) {
        setSystemOptions(
          res.data.map((d) => ({
            value: d.id,
            label: d.name,
          })),
        );
      } else {
        message.error(res?.message ?? '获取系统失败');
      }
    } finally {
      setLoading(false);
    }
  };

  // 获取本页面所需数据
  const getData = async (page: { pageNum: number; pageSize: number }) => {
    setLoading(true);
    const params = {
      pageNum: page.pageNum,
      pageSize: page.pageSize,
      keyword: searchInfo.name,
      status: searchInfo.status,
    };
    try {
      const res = await dispatch.resource.getResource(params);
      if (res && res.status === 200) {
        setData(res.data.items);
        setPage({
          total: res.data.meta.totalCounts,
          pageNum: res.data.meta.currentPage,
          pageSize: res.data.meta.pageSize,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  /** 工具 - 递归将扁平数据转换为层级数据 **/
  const dataToJson = useCallback(
    (one: TreeSourceData | null, data: TreeSourceData[]) => {
      let kids: TreeSourceData[];
      if (!one) {
        // 第1次递归
        kids = data.filter((item: TreeSourceData) => !item.parent);
      } else {
        kids = data.filter((item: TreeSourceData) => item.parent === one.id);
      }
      kids.forEach(
        (item: TreeSourceData) => (item.children = dataToJson(item, data)),
      );
      return kids.length ? kids : undefined;
    },
    [],
  );

  /** 新增&修改 模态框出现 **/
  const onModalShow = (data: TableRecordData | null, type: operateType) => {
    setModal({
      modalShow: true,
      nowData: data,
      operateType: type,
    });

    setTimeout(() => {
      if (type === 'add') {
        form.resetFields();
      } else {
        if (data) {
          form.setFieldsValue(data);
        }
      }
    });
  };

  /** 新增&修改 模态框关闭 **/
  const onClose = () => {
    setModal({
      modalShow: false,
    });
  };

  /** 新增&修改 提交 **/
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
        try {
          const res = await dispatch.resource.addReource(values);
          if (res && res.status === 200) {
            message.success('添加成功');
            getData(page);
            onClose();
          } else {
            message.error('添加失败');
          }
        } finally {
          setModal({
            modalLoading: false,
          });
        }
      } else {
        try {
          values.id = modal?.nowData?.id;
          const res = await dispatch.resource.upReource(values);
          if (res && res.status === 200) {
            message.success('修改成功');
            getData(page);
            onClose();
          } else {
            message.error('修改失败');
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

  /** 删除一条数据 **/
  const onDel = async (record: TableRecordData) => {
    const params = { id: record.id };
    const res = await dispatch.resource.delReource(params);
    if (res && res.status === 200) {
      getData(page);
      dispatch.app.updateUserInfo(null);
      message.success('删除成功');
    } else {
      message.error(res?.message ?? '操作失败');
    }
  };

  /** 构建表格字段 **/
  const tableColumns = [
    {
      title: 'id',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: '资源名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '资源 KEY',
      dataIndex: 'key',
      key: 'key',
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: '父级',
      dataIndex: 'parentId',
      key: 'parentId',
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
      width: 120,
      render: (v: number, record: TableRecordData) => {
        const controls = [];

        controls.push(
          <span
            key="0"
            className="control-btn green"
            onClick={() => onModalShow(record, 'see')}
          >
            <Tooltip placement="top" title="查看">
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
            key="2"
            title="确定删除吗?"
            okText="确定"
            cancelText="取消"
            onConfirm={() => onDel(record)}
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

  // 表单页码改变
  const onTablePageChange = (pageNum: number, pageSize: number | undefined) => {
    getData({ pageNum, pageSize: pageSize || page.pageSize });
  };

  return (
    <div className="page-menu-admin">
      <div className="r">
        <div className="searchBox">
          <ul>
            <li>
              <Button
                type="primary"
                icon={<PlusCircleOutlined />}
                onClick={() => onModalShow(null, 'add')}
              >
                {`添加${treeSelect.title || '根级'}子资源`}
              </Button>
            </li>
          </ul>
        </div>
        <Table
          className="diy-table"
          columns={tableColumns}
          loading={loading}
          dataSource={data}
          pagination={{
            total: page.total,
            current: page.pageNum,
            pageSize: page.pageSize,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条数据`,
            onChange: (page, pageSize) => onTablePageChange(page, pageSize),
          }}
        />
      </div>

      <Modal
        title={`${{ add: '新增', up: '修改', see: '查看' }[modal.operateType]}`}
        open={modal.modalShow}
        onOk={onOk}
        onCancel={onClose}
        confirmLoading={modal.modalLoading}
      >
        <Form form={form} initialValues={{ status: 1 }}>
          <Form.Item
            label="资源名称"
            name="name"
            {...formItemLayout}
            rules={[
              { required: true, whitespace: true, message: '必填' },
              { max: 12, message: '最多输入12位字符' },
            ]}
          >
            <Input
              placeholder="请输入资源名"
              disabled={modal.operateType === 'see'}
            />
          </Form.Item>
          <Form.Item
            label="资源 KEY"
            name="key"
            {...formItemLayout}
            rules={[
              { required: true, whitespace: true, message: '必填' },
              { max: 12, message: '最多输入12位字符' },
            ]}
          >
            <Input
              placeholder="请输入资源 KEY"
              disabled={modal.operateType === 'see'}
            />
          </Form.Item>
          <Form.Item
            label="描述"
            name="description"
            {...formItemLayout}
            rules={[
              { required: true, whitespace: true, message: '必填' },
              { max: 100, message: '最多输入100位字符' },
            ]}
          >
            <TextArea
              rows={4}
              disabled={modal.operateType === 'see'}
              autoSize={{ minRows: 2, maxRows: 6 }}
            />
          </Form.Item>
          <Form.Item
            label="资源类型"
            name="type"
            {...formItemLayout}
            rules={[{ required: true, message: '请选择资源类型' }]}
          >
            <Select
              options={[
                { value: 'nomal', label: '普通' },
                { value: 'menu', label: '菜单' },
              ]}
            />
          </Form.Item>
          <Form.Item
            label="系统"
            name="systemId"
            {...formItemLayout}
            rules={[{ required: true, message: '请选择系统' }]}
          >
            <Select
              showSearch
              placeholder="请选择系统"
              filterOption={false}
              notFoundContent={null}
              options={systemOptions}
            />
          </Form.Item>
          {/* <Form.Item
            label="排序"
            name="formSorts"
            {...formItemLayout}
            rules={[{ required: true, message: '请输入排序号' }]}
          >
            <InputNumber
              min={0}
              max={99999}
              style={{ width: '100%' }}
              disabled={modal.operateType === 'see'}
            />
          </Form.Item> */}
          <Form.Item
            label="状态"
            name="status"
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
}

export default MenuAdminContainer;
