/** 权限管理页 **/

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
  Checkbox,
} from 'antd';
import {
  EyeOutlined,
  ToolOutlined,
  DeleteOutlined,
  PlusCircleOutlined,
} from '@ant-design/icons';
import { cloneDeep } from 'lodash';

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

import { ModalType, operateType, Power, Res } from './index.type';
import { RootState, Dispatch } from '@/store';

import './index.less';

function PowerAdminContainer() {
  const dispatch = useDispatch<Dispatch>();
  const roles = useSelector((state: RootState) => state.sys.roles);
  const [systemOptions, setSystemOptions] = useState([]);
  const [reourceOptions, setReourceOptions] = useState([]);

  const [form] = Form.useForm();
  const [data, setData] = useState<Power[]>([]); // 当前所选菜单下的权限数据
  const [loading, setLoading] = useState<boolean>(false); // 数据是否正在加载中

  // 模态框相关参数控制
  const [modal, setModal] = useSetState<ModalType>({
    operateType: 'add',
    nowData: null,
    modalShow: false,
    modalLoading: false,
  });

  // 生命周期 - 首次加载组件时触发
  useMount(() => {
    getData();
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

  // 根据所选菜单id获取其下权限数据
  const getData = async (menuId: string | number | null = null) => {
    setLoading(true);
    const params = {
      menuId: Number(menuId) || null,
    };

    try {
      const res: Res = await dispatch.privilege.getPrivilege(params);

      if (res && res.status === 200) {
        setData(res.data.items);
      }
    } finally {
      setLoading(false);
    }
  };

  // 新增&修改 模态框出现
  const onModalShow = (data, type: operateType) => {
    setModal({
      modalShow: true,
      nowData: data,
      operateType: type,
    });
    setTimeout(() => {
      if (type === 'add') {
        // 新增，需重置表单各控件的值
        form.resetFields();
      } else {
        // 查看或修改，需设置表单各控件的值为当前所选中行的数据
        form.setFieldsValue(data);
      }
    });
  };

  // 新增&修改 模态框关闭
  const onClose = () => {
    setModal({
      modalShow: false,
    });
  };

  // 新增&修改 提交
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
          const res: Res = await dispatch.privilege.addPrivilege(values);
          if (res && res.status === 200) {
            message.success('添加成功');
            getData();
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
        // 修改
        try {
          if (!modal?.nowData?.id) {
            message.error('该数据没有ID');
            return;
          }
          values.id = modal.nowData.id;

          const res: Res = await dispatch.privilege.upPrivilege(values);
          if (res && res.status === 200) {
            message.success('修改成功');
            getData();
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

  const onChangeSys = (value) => {
    getReourcBySystemId(value);
  };

  const getReourcBySystemId = async (systemId: number) => {
    const res = await dispatch.resource.getReourcBySystemId({ systemId });
    if (res && res.status === 200) {
      setReourceOptions(
        res.data.map((d) => {
          return {
            label: d.name,
            value: d.key,
          };
        }),
      );
    } else {
      message.error(res?.message ?? '操作失败');
    }
  };

  // 删除一条数据
  const onDel = async (record: TableRecordData) => {
    const params = { id: record.id };
    setLoading(true);
    const res = await dispatch.privilege.delPrivilege(params);
    if (res && res.status === 200) {
      getData();
      message.success('删除成功');
    } else {
      message.error(res?.message ?? '操作失败');
    }
  };

  /**
   * 批量更新roles
   * @param id 当前这个权限的id
   * @param roleIds 选中的角色的id们，要把当前权限赋给这些角色
   *  **/
  const setPowersByRoleIds = (id: number, roleIds: number[]) => {
    const params = roles.map((item) => {
      const powersTemp = new Set(
        item.menuAndPowers.reduce(
          (a, b) => [...a, ...b.powers],
          [] as number[],
        ),
      );
      if (roleIds.includes(item.id)) {
        powersTemp.add(id);
      } else {
        powersTemp.delete(id);
      }
      return {
        id: item.id,
        menus: item.menuAndPowers.map((item) => item.menuId),
        powers: Array.from(powersTemp),
      };
    });
    dispatch.sys.setPowersByRoleIds(params);
  };

  // 构建表格字段
  const tableColumns = [
    {
      title: 'id',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: '权限名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '权限 CODE',
      dataIndex: 'resourceKey',
      key: 'resourceKey',
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

  return (
    <div className="page-power-admin">
      <div className="r">
        <div className="searchBox">
          <ul>
            <li>
              <Button
                type="primary"
                icon={<PlusCircleOutlined />}
                onClick={() => onModalShow(null, 'add')}
              >
                {`添加权限`}
              </Button>
            </li>
          </ul>
        </div>
        <Table
          className="diy-table"
          columns={tableColumns}
          loading={loading}
          rowKey="id"
          dataSource={data}
          pagination={{
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条数据`,
          }}
        />
      </div>
      {/** 查看&新增&修改用户模态框 **/}
      <Modal
        title={`${{ add: '新增', up: '修改', see: '查看' }[modal.operateType]}`}
        open={modal.modalShow}
        onOk={onOk}
        onCancel={onClose}
        confirmLoading={modal.modalLoading}
      >
        <Form form={form} initialValues={{ status: 1 }}>
          <Form.Item
            label="权限名"
            name="name"
            {...formItemLayout}
            rules={[
              { required: true, whitespace: true, message: '必填' },
              { max: 12, message: '最多输入12位字符' },
            ]}
          >
            <Input
              placeholder="请输入权限名"
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
            label="系统"
            name="systemId"
            {...formItemLayout}
            rules={[{ required: true, message: '请选择系统' }]}
          >
            <Select
              showSearch
              placeholder="请选择系统"
              filterOption={false}
              onChange={onChangeSys}
              notFoundContent={null}
              options={systemOptions}
            />
          </Form.Item>
          <Form.Item
            label="Code"
            name="resourceKey"
            {...formItemLayout}
            rules={[
              { required: true, whitespace: true, message: '必填' },
              { max: 12, message: '最多输入12位字符' },
            ]}
          >
            <Select placeholder="请输入选择资源 key" options={reourceOptions} />
          </Form.Item>
          <Form.Item
            label="权限类型"
            name="action"
            {...formItemLayout}
            rules={[{ required: true, message: '请选择权限类型' }]}
          >
            <Select
              placeholder="请选择权限类型"
              options={[
                { value: 'manage', label: '管理权限' },
                { value: 'create', label: '创建' },
                { value: 'read', label: '只读' },
                { value: 'update', label: '更新' },
                { value: 'delete', label: '删除' },
              ]}
            />
          </Form.Item>
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
              <Option key={1} value={0}>
                禁用
              </Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default PowerAdminContainer;
