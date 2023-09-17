/** Role 系统管理/角色管理 **/

// ==================
// 第三方库
// ==================
import React, { useState, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useSetState, useMount } from "react-use";
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
  InputNumber,
} from "antd";
import {
  EyeOutlined,
  EditOutlined,
  ToolOutlined,
  DeleteOutlined,
  PlusCircleOutlined,
  SearchOutlined,
} from "@ant-design/icons";

// ==================
// 自定义的东西
// ==================
import tools from "@/util/tools"; // 工具

// ==================
// 所需的组件
// ==================
import PowerTreeCom from "@/components/TreeChose/PowerTreeTable";

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

// ==================
// 类型声明
// ==================
import { RootState, Dispatch } from "@/store";
import { PowerTreeDefault } from "@/components/TreeChose/PowerTreeTable";
import {
  Page,
  TableRecordData,
  operateType,
  ModalType,
  PowerTreeInfo,
  SearchInfo,
  RoleParam,
  Role,
  Res,
} from "./index.type";

// ==================
// CSS
// ==================
import "./index.less";

// ==================
// 本组件
// ==================
function RoleAdminContainer() {
  const dispatch = useDispatch<Dispatch>();
  const p = useSelector((state: RootState) => state.app.powersCode);
  const powerTreeData = useSelector(
    (state: RootState) => state.sys.powerTreeData
  );

  const [form] = Form.useForm();
  const [data, setData] = useState<Role[]>([]); // 当前页面列表数据
  const [loading, setLoading] = useState<boolean>(false); // 数据是否正在加载中

  // 分页相关参数控制
  const [page, setPage] = useSetState<Page>({
    pageNum: 1,
    pageSize: 10,
    total: 0,
  });

  // 模态框相关参数控制
  const [modal, setModal] = useSetState<ModalType>({
    operateType: "add",
    nowData: null,
    modalShow: false,
    modalLoading: false,
  });

  // 搜索相关参数
  const [searchInfo, setSearchInfo] = useSetState<SearchInfo>({
    title: undefined, // 角色名
    conditions: undefined, // 状态
  });

  // 权限树相关参数
  const [power, setPower] = useSetState<PowerTreeInfo>({
    treeOnOkLoading: false,
    powerTreeShow: false,
    powerTreeDefault: { menus: [], powers: [] },
  });

  // 生命周期 - 首次加载组件时触发
  useMount(() => {
    getData(page);
    getPowerTreeData();
  });

  // 函数 - 获取所有的菜单权限数据，用于分配权限控件的原始数据
  const getPowerTreeData = () => {
    dispatch.sys.getAllMenusAndPowers();
  };

  // 函数- 查询当前页面所需列表数据
  const getData = async (page: { pageNum: number; pageSize: number }) => {
    if (!p.includes("role:query")) {
      return;
    }
    const params = {
      pageNum: page.pageNum,
      pageSize: page.pageSize,
      title: searchInfo.title,
      conditions: searchInfo.conditions,
    };
    setLoading(true);
    try {
      const res: Res = await dispatch.sys.getRoles(tools.clearNull(params));
      if (res && res.status === 200) {
        setData(res.data.list);
        setPage({
          total: res.data.total,
          pageNum: page.pageNum,
          pageSize: page.pageSize,
        });
      } else {
        message.error(res?.message ?? "获取失败");
      }
    } finally {
      setLoading(false);
    }
  };

  // 搜索 - 名称输入框值改变时触发
  const searchTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length < 20) {
      setSearchInfo({ title: e.target.value });
    }
  };

  // 搜索 - 状态下拉框选择时触发
  const searchConditionsChange = (v: number) => {
    setSearchInfo({ conditions: v });
  };

  // 搜索
  const onSearch = () => {
    getData(page);
  };

  /**
   * 添加/修改/查看 模态框出现
   * @param data 当前选中的那条数据
   * @param type add添加/up修改/see查看
   * **/
  const onModalShow = (data: TableRecordData | null, type: operateType) => {
    setModal({
      modalShow: true,
      nowData: data,
      operateType: type,
    });
    setTimeout(() => {
      if (type === "add") {
        // 新增，需重置表单各控件的值
        form.resetFields();
      } else {
        // 查看或修改，需设置表单各控件的值为当前所选中行的数据
        form.setFieldsValue({
          formConditions: data?.conditions,
          formDesc: data?.desc,
          formSorts: data?.sorts,
          formTitle: data?.title,
        });
      }
    });
  };

  /** 模态框确定 **/
  const onOk = async () => {
    if (modal.operateType === "see") {
      onClose();
      return;
    }

    try {
      const values = await form.validateFields();
      setModal({
        modalLoading: true,
      });
      const params: RoleParam = {
        title: values.formTitle,
        desc: values.formDesc,
        sorts: values.formSorts,
        conditions: values.formConditions,
      };
      if (modal.operateType === "add") {
        // 新增
        try {
          const res: Res = await dispatch.sys.addRole(params);
          if (res && res.status === 200) {
            message.success("添加成功");
            getData(page);
            dispatch.app.updateUserInfo(null); // 角色信息有变化，立即更新当前用户信息
            onClose();
          }
        } finally {
          setModal({
            modalLoading: false,
          });
        }
      } else {
        // 修改
        params.id = modal?.nowData?.id;
        try {
          const res: Res = await dispatch.sys.upRole(params);
          if (res && res.status === 200) {
            message.success("修改成功");
            getData(page);
            dispatch.app.updateUserInfo(null);
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
      const res = await dispatch.sys.delRole({ id });
      if (res && res.status === 200) {
        message.success("删除成功");
        getData(page);
        dispatch.app.updateUserInfo(null);
      } else {
        message.error(res?.message ?? "操作失败");
      }
    } finally {
      setLoading(false);
    }
  };

  /** 模态框关闭 **/
  const onClose = () => {
    setModal({ modalShow: false });
  };

  /** 分配权限按钮点击，权限控件出现 **/
  const onAllotPowerClick = (record: TableRecordData) => {
    const menus = record.menuAndPowers.map((item) => item.menuId); // 需默认选中的菜单项ID
    // 需默认选中的权限ID
    const powers = record.menuAndPowers.reduce(
      (v1, v2) => [...v1, ...v2.powers],
      [] as number[]
    );
    setModal({ nowData: record });
    setPower({
      powerTreeShow: true,
      powerTreeDefault: { menus, powers },
    });
  };

  // 权限树确定 给角色分配菜单和权限
  const onPowerTreeOk = async (arr: PowerTreeDefault) => {
    if (!modal?.nowData?.id) {
      message.error("该数据没有ID");
      return;
    }
    const params = {
      id: modal.nowData.id,
      menus: arr.menus,
      powers: arr.powers,
    };

    setPower({ treeOnOkLoading: true });
    try {
      const res: Res = await dispatch.sys.setPowersByRoleId(params);
      if (res && res.status === 200) {
        getData(page);
        dispatch.app.updateUserInfo(null);
        onPowerTreeClose();
      } else {
        message.error(res?.message ?? "权限分配失败");
      }
    } finally {
      setPower({ treeOnOkLoading: false });
    }
  };

  // 关闭菜单树
  const onPowerTreeClose = () => {
    setPower({
      powerTreeShow: false,
    });
  };

  // 表单页码改变
  const onTablePageChange = (pageNum: number, pageSize: number | undefined) => {
    getData({ pageNum, pageSize: pageSize || page.pageSize });
  };

  // 构建字段
  const tableColumns = [
    {
      title: "序号",
      dataIndex: "serial",
      key: "serial",
    },
    {
      title: "角色名",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "描述",
      dataIndex: "desc",
      key: "desc",
    },
    {
      title: "排序",
      dataIndex: "sorts",
      key: "sorts",
    },
    {
      title: "状态",
      dataIndex: "conditions",
      key: "conditions",
      render: (v: number) =>
        v === 1 ? (
          <span style={{ color: "green" }}>启用</span>
        ) : (
          <span style={{ color: "red" }}>禁用</span>
        ),
    },
    {
      title: "操作",
      key: "control",
      width: 200,
      render: (v: number, record: TableRecordData) => {
        const controls = [];
        p.includes("role:query") &&
          controls.push(
            <span
              key="0"
              className="control-btn green"
              onClick={() => onModalShow(record, "see")}
            >
              <Tooltip placement="top" title="查看">
                <EyeOutlined />
              </Tooltip>
            </span>
          );
        p.includes("role:up") &&
          controls.push(
            <span
              key="1"
              className="control-btn blue"
              onClick={() => onModalShow(record, "up")}
            >
              <Tooltip placement="top" title="修改">
                <ToolOutlined />
              </Tooltip>
            </span>
          );
        p.includes("role:power") &&
          controls.push(
            <span
              key="2"
              className="control-btn blue"
              onClick={() => onAllotPowerClick(record)}
            >
              <Tooltip placement="top" title="分配权限">
                <EditOutlined />
              </Tooltip>
            </span>
          );
        p.includes("role:del") &&
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
            </Popconfirm>
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

  const tableData = useMemo(() => {
    return data.map((item, index): TableRecordData => {
      return {
        key: index,
        id: item.id,
        serial: index + 1 + (page.pageNum - 1) * page.pageSize,
        title: item.title,
        desc: item.desc,
        sorts: item.sorts,
        conditions: item.conditions,
        control: item.id,
        menuAndPowers: item.menuAndPowers,
      };
    });
  }, [page, data]);

  return (
    <div>
      <div className="g-search">
        <ul className="search-func">
          <li>
            <Button
              type="primary"
              icon={<PlusCircleOutlined />}
              disabled={!p.includes("role:add")}
              onClick={() => onModalShow(null, "add")}
            >
              添加角色
            </Button>
          </li>
        </ul>
        <Divider type="vertical" />
        {p.includes("role:query") && (
          <ul className="search-ul">
            <li>
              <Input
                placeholder="请输入角色名"
                onChange={searchTitleChange}
                value={searchInfo.title}
              />
            </li>
            <li>
              <Select
                placeholder="请选择状态"
                allowClear
                style={{ width: "200px" }}
                onChange={searchConditionsChange}
                value={searchInfo.conditions}
              >
                <Option value={1}>启用</Option>
                <Option value={-1}>禁用</Option>
              </Select>
            </li>
            <li>
              <Button
                type="primary"
                icon={<SearchOutlined />}
                onClick={onSearch}
              >
                搜索
              </Button>
            </li>
          </ul>
        )}
      </div>
      <div className="diy-table">
        <Table
          columns={tableColumns}
          loading={loading}
          dataSource={tableData}
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
      {/* 新增&修改&查看 模态框 */}
      <Modal
        title={{ add: "新增", up: "修改", see: "查看" }[modal.operateType]}
        open={modal.modalShow}
        onOk={() => onOk()}
        onCancel={() => onClose()}
        confirmLoading={modal.modalLoading}
      >
        <Form
          form={form}
          initialValues={{
            formConditions: 1,
          }}
        >
          <Form.Item
            label="角色名"
            name="formTitle"
            {...formItemLayout}
            rules={[
              { required: true, whitespace: true, message: "必填" },
              { max: 12, message: "最多输入12位字符" },
            ]}
          >
            <Input
              placeholder="请输入角色名"
              disabled={modal.operateType === "see"}
            />
          </Form.Item>
          <Form.Item
            label="描述"
            name="formDesc"
            {...formItemLayout}
            rules={[{ max: 100, message: "最多输入100个字符" }]}
          >
            <TextArea
              rows={4}
              disabled={modal.operateType === "see"}
              autoSize={{ minRows: 2, maxRows: 6 }}
            />
          </Form.Item>
          <Form.Item
            label="排序"
            name="formSorts"
            {...formItemLayout}
            rules={[{ required: true, message: "请输入排序号" }]}
          >
            <InputNumber
              min={0}
              max={99999}
              style={{ width: "100%" }}
              disabled={modal.operateType === "see"}
            />
          </Form.Item>
          <Form.Item
            label="状态"
            name="formConditions"
            {...formItemLayout}
            rules={[{ required: true, message: "请选择状态" }]}
          >
            <Select disabled={modal.operateType === "see"}>
              <Option key={1} value={1}>
                启用
              </Option>
              <Option key={-1} value={-1}>
                禁用
              </Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
      <PowerTreeCom
        title={modal.nowData ? `分配权限：${modal.nowData.title}` : "分配权限"}
        data={powerTreeData}
        defaultChecked={power.powerTreeDefault}
        loading={power.treeOnOkLoading}
        modalShow={power.powerTreeShow}
        onOk={onPowerTreeOk}
        onClose={onPowerTreeClose}
      />
    </div>
  );
}

export default RoleAdminContainer;
