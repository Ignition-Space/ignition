/** User 系统管理/用户管理 **/

import './index.less';

import {
  Button,
  Divider,
  Form,
  Input,
  Modal,
  Popconfirm,
  Select,
  Table,
  Tooltip,
  message,
} from 'antd';
import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  MehOutlined,
  PlusCircleOutlined,
  SearchOutlined,
  ToolOutlined,
} from '@ant-design/icons';
import {
  ModalType,
  Page,
  Res,
  RoleTreeInfo,
  SearchInfo,
  TableRecordData,
  UserBasicInfoParam,
  operateType,
} from './index.type';
import React, { useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useMount, useSetState } from 'react-use';

import { Dispatch } from '@/store';
import RoleTree from '@/components/TreeChose/RoleTree';
import tools from '@/util/tools'; // 工具函数

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

function UserAdminContainer(): JSX.Element {
  const dispatch = useDispatch<Dispatch>();

  const [form] = Form.useForm();
  const [data, setData] = useState<TableRecordData[]>([]); // 当前页面列表数据
  const [loading, setLoading] = useState(false); // 数据是否正在加载中

  // 分页相关参数
  const [page, setPage] = useSetState<Page>({
    pageNum: 1,
    pageSize: 10,
    total: 0,
  });

  // 模态框相关参数
  const [modal, setModal] = useSetState<ModalType>({
    operateType: 'add', // see查看，add添加，up修改
    nowData: null,
    modalShow: false,
    modalLoading: false,
  });

  // 搜索相关参数
  const [searchInfo, setSearchInfo] = useSetState<SearchInfo>({
    username: undefined, // 用户名
    status: undefined, // 状态
  });

  // 角色树相关参数
  const [role, setRole] = useSetState<RoleTreeInfo>({
    roleData: [],
    roleTreeLoading: false,
    roleTreeShow: false,
    roleTreeDefault: [],
  });

  // 生命周期 - 组件挂载时触发一次
  useMount(() => {
    onGetData();
    getAllRolesData();
  });

  // 函数 - 获取所有的角色数据，用于分配角色控件的原始数据
  const getAllRolesData = async (): Promise<void> => {
    try {
      const res = await dispatch.role.getAllRoles();
      if (res && res.status === 200) {
        setRole({
          roleData: res.data,
        });
      }
    } catch {
      //
    }
  };

  // 函数 - 获取单个的角色数据，用于分配角色控件的原始数据
  const getSingleRolesData = async (id) => {
    try {
      const res = await dispatch.role.getAllRolesById({ userId: id });
      if (res && res.status === 200) {
        return res.data || [];
      }
      return [];
    } catch {
      //
    }
    return [];
  };

  // 函数 - 查询当前页面所需列表数据
  async function onGetData(): Promise<void> {
    const params = {
      pageNum: page.pageNum,
      pageSize: page.pageSize,
      username: searchInfo.username,
      status: searchInfo.status,
    };
    setLoading(true);
    try {
      //
      const res = await dispatch.sys.getUserList(tools.clearNull(params));
      if (res && res.status === 200) {
        // data这里需要数组格式,
        // 返回：对象格式，需要处理一下。
        // TODO:等待nestjs增加分页组件
        setPage({
          pageNum: 1,
          pageSize: 10,
          total: 100,
        });
        const arr: TableRecordData = [];

        Object.values(res.data).length &&
          Object.values(res.data).forEach((item: any) => {
            let { updateTime, ...others } = item;
            arr.push({ ...others });
          });

        setData(arr);
      } else {
        message.error(res?.message ?? '数据获取失败');
      }
    } finally {
      setLoading(false);
    }
  }

  // 搜索 - 名称输入框值改变时触发
  const searchUsernameChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ): void => {
    if (e.target.value.length < 20) {
      setSearchInfo({ username: e.target.value });
    }
  };

  // 搜索 - 状态下拉框选择时触发
  const searchstatusChange = (v: number): void => {
    setSearchInfo({ status: v });
  };

  // 搜索
  const onSearch = (): void => {
    onGetData();
  };

  /**
   * 添加/修改/查看 模态框出现
   * @param data 当前选中的那条数据
   * @param type add添加/up修改/see查看
   * **/
  const onModalShow = (
    data: TableRecordData | null,
    type: operateType,
  ): void => {
    setModal({
      modalShow: true,
      nowData: data,
      operateType: type,
    });

    // TODO:用 setTimeout 是因为首次让Modal出现时得等它挂载DOM，不然form对象还没来得及挂载到Form上
    setTimeout(() => {
      if (type === 'add') {
        // 新增，需重置表单各控件的值
        form.resetFields();
      } else if (data) {
        // 查看或修改，需设置表单各控件的值为当前所选中行的数据
        form.setFieldsValue(data);
      }
    });
  };

  /** 模态框确定 **/
  const onOk = async (): Promise<void> => {
    if (modal.operateType === 'see') {
      onClose();
      return;
    }
    try {
      const values = await form.validateFields();
      setModal({
        modalLoading: true,
      });
      debugger;
      const params: UserBasicInfoParam = {
        id: values.id,
        username: values.username,
        password: values.password || '123456',
        phone: values.phone,
        email: values.email,
        desc: values.desc,
        status: values.status,
      };
      if (modal.operateType === 'add') {
        // 新增
        try {
          const res: Res | undefined = await dispatch.sys.addUser(params);
          if (res && res.status === 200) {
            message.success('添加成功');
            onGetData();
            onClose();
          } else {
            message.error(res?.message ?? '操作失败');
          }
        } finally {
          setModal({
            modalLoading: false,
          });
        }
      } else if (modal.operateType === 'up') {
        try {
          const res: Res | undefined = await dispatch.sys.updateUser(params);
          if (res && res.status === 200) {
            message.success('更新成功');
            onGetData();
            onClose();
          } else {
            message.error(res?.message ?? '操作失败');
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

  /** 模态框关闭 **/
  const onClose = () => {
    setModal({
      modalShow: false,
    });
  };
  /**
   * 删除当前的用户
   * @param record
   */
  const onDeleteUserClick = async (record: TableRecordData): Promise<void> => {
    console.log(record);
    try {
      const res = await dispatch.sys.deleteUser({ userId: record.id });
      if (res && res.status === 200) {
        onGetData();
        return res.data || [];
      }
      return [];
    } catch {
      //
    }
    return [];
  };

  /** 分配角色按钮点击，角色控件出现 **/
  const onTreeShowClick = async (record: TableRecordData): Promise<void> => {
    setModal({
      nowData: record,
    });
    const roles = await getSingleRolesData(record.id);
    // TODO:这里默认数据给的权限都是1，不用处理了，没有专门对应admin和user
    setRole({
      roleTreeShow: true,
      // roleTreeDefault: roles.map(
      //   (role) => `role_sys_${role.systemId}_${role.id}`,
      // ),
    });
  };

  // 分配角色确定
  const onRoleOk = async (keys: string[], tree: object): Promise<void> => {
    if (!modal.nowData?.id) {
      message.error('未获取到该条数据id');
      return;
    }
    setRole({
      roleTreeLoading: true,
    });

    const bathRoles = Object.keys(tree).map((key) => {
      return {
        systemId: Number(key.replace('sys_', '')),
        // roleIds: tree[key].map((r) => Number(r.replace(`role_${key}_`, ''))),
      };
    });
    try {
      const res: Res = await dispatch.role.setUserRoles({
        userId: modal.nowData?.id,
        bathRoles,
      });
      if (res && res.status === 200) {
        message.success('分配成功');
        onGetData();
        onRoleClose();
      } else {
        message.error(res?.message ?? '操作失败');
      }
    } finally {
      setRole({
        roleTreeLoading: false,
      });
    }
  };

  // 分配角色树关闭
  const onRoleClose = (): void => {
    setRole({
      roleTreeShow: false,
    });
  };

  // 表格页码改变
  const onTablePageChange = (): void => {
    onGetData();
  };

  // table字段
  const tableColumns = [
    {
      title: '序号',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: '用户名',
      dataIndex: 'username', //  属性值字段
      key: 'name',
    },
    {
      title: '电话',
      // 数据库字段名称
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (v: number): JSX.Element =>
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
      render: (v: null, record: TableRecordData) => {
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
            key="2"
            className="control-btn blue"
            onClick={() => onTreeShowClick(record)}
          >
            <Tooltip placement="top" title="分配角色">
              <MehOutlined />
            </Tooltip>
          </span>,
        );
        controls.push(
          <span
            key="3"
            className="control-btn blue"
            onClick={() => onDeleteUserClick(record)}
          >
            <Tooltip placement="top" title="删除用户">
              <DeleteOutlined />
            </Tooltip>
          </span>,
        );
        controls.push(
          <span
            key="4"
            className="control-btn blue"
            onClick={() => onModalShow(record, 'up')}
          >
            <Tooltip placement="top" title="修改用户">
              <EditOutlined />
            </Tooltip>
          </span>,
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
              // disabled
              icon={<PlusCircleOutlined />}
              onClick={() => onModalShow(null, 'add')}
            >
              添加用户
            </Button>
          </li>
        </ul>
        <Divider type="vertical" />
        <ul className="search-ul">
          <li>
            <Input
              placeholder="请输入用户名"
              onChange={searchUsernameChange}
              value={searchInfo.username}
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
              <Option value={0}>禁用</Option>
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
            total: page.total,
            current: page.pageNum,
            pageSize: page.pageSize,
            showQuickJumper: true,
            showTotal: (t) => `共 ${t} 条数据`,
            onChange: onTablePageChange,
          }}
        />
      </div>

      {/* 新增&修改&查看 模态框 */}
      <Modal
        title={{ add: '新增', up: '修改', see: '查看' }[modal.operateType]}
        open={modal.modalShow}
        onOk={onOk}
        onCancel={onClose}
        confirmLoading={modal.modalLoading}
      >
        <Form
          form={form}
          initialValues={{
            status: 1,
          }}
        >
          <Form.Item
            hidden
            label="当前的用户id"
            name="id"
          >
            <Input
              disabled={modal.operateType === 'see'}
            />
          </Form.Item>
          <Form.Item
            label="用户名"
            name="username"
            {...formItemLayout}
            rules={[
              { required: true, whitespace: true, message: '必填' },
              { max: 12, message: '最多输入12位字符' },
            ]}
          >
            <Input
              placeholder="请输入用户名"
              disabled={modal.operateType === 'see'}
            />
          </Form.Item>
          <Form.Item
            label="电话"
            name="phone"
            {...formItemLayout}
            rules={[
              () => ({
                validator: (rule, value) => {
                  const v = value;
                  if (v) {
                    if (!tools.checkPhone(v)) {
                      return Promise.reject('请输入有效的手机号码');
                    }
                  }
                  return Promise.resolve();
                },
              }),
            ]}
          >
            <Input
              placeholder="请输入手机号"
              maxLength={11}
              disabled={modal.operateType === 'see'}
            />
          </Form.Item>
          <Form.Item
            label="邮箱"
            name="email"
            {...formItemLayout}
            rules={[
              () => ({
                validator: (rule, value) => {
                  const v = value;
                  if (v) {
                    if (!tools.checkEmail(v)) {
                      return Promise.reject('请输入有效的邮箱地址');
                    }
                  }
                  return Promise.resolve();
                },
              }),
            ]}
          >
            <Input
              placeholder="请输入邮箱地址"
              disabled={modal.operateType === 'see'}
            />
          </Form.Item>
          <Form.Item
            label="描述"
            name="formDesc"
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
            {...formItemLayout}
            initialValue={1}
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
      <RoleTree
        title={'分配角色'}
        data={role.roleData}
        visible={role.roleTreeShow}
        defaultKeys={role.roleTreeDefault}
        loading={role.roleTreeLoading}
        onOk={onRoleOk}
        onClose={onRoleClose}
      />
    </div>
  );
}

export default UserAdminContainer;
