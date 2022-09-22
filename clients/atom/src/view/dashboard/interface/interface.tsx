import {
  generatePage,
  getInterfaceList,
  getSite,
  IInterface,
  IProperty,
  ISite,
} from '@/services';
import {
  Alert,
  Button,
  Card,
  Col,
  Descriptions,
  Drawer,
  Empty,
  Form,
  Menu,
  Radio,
  Row,
  Select,
  Space,
  Spin,
  Table,
  Tag,
} from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router';
import dayjs from 'dayjs';
import _ from 'loadsh';
import { ColumnsType } from 'antd/lib/table';
import MonacoEditor from 'react-monaco-editor';
import { PageContainer } from '@ant-design/pro-layout';
import EddSite from '../site/EddSite';
import SyncInterface from '../site/SyncInterface';

const { Option } = Select;

const InterfaceDom = () => {
  const params = useParams();

  const [interfaceList, setInterfaceList] = useState([]);
  const [menuList, setMenuList] = useState<any>([]);
  const [site, setSite] = useState<ISite>({});

  const [currentInterface, setCurrentInterface] = useState<IInterface>();

  const [formData, setFormData] = useState<Array<IProperty>>([]);
  const [editorValue, seteditorValue] = useState('');
  const [open, setOpen] = useState(false);
  const [showSpin, setShowSpin] = useState(true);

  const editorRef = useRef();

  const fetchSite = (id: string) => {
    getSite(id).then((res) => setSite(res.data));
  };

  const packageMenu = (list: IInterface[]) => {
    const menu: any = {};
    list.forEach((l) => {
      if (l.tags.length > 0) {
        const tag = l.tags[0];
        if (!menu[tag]) menu[tag] = [];
        menu[tag].push({
          key: l.id,
          label: l.summary || l.url,
        });
      }
    });
    return Object.keys(menu).map((key) => ({
      key,
      label: key,
      children: menu[key],
    }));
  };

  const fetchInterface = (id: string) => {
    getInterfaceList(id)
      .then((res) => {
        setInterfaceList(res.data);
        const menu = packageMenu(res.data);
        setMenuList(menu);
        setCurrentInterface(res.data[0]);
      })
      .finally(() => {
        setShowSpin(false);
      });
  };

  const analysisParams = (current: IInterface) => {
    const properties = current?.schema.properties;
    if (!properties) {
      setFormData([]);
    } else {
      setFormData(
        Object.keys(properties).map((key) => {
          return {
            name: key,
            type: properties[key].type,
            example: properties[key].example,
            description: properties[key].description,
          };
        }),
      );
    }
  };

  useEffect(() => {
    if (params.id) {
      fetchInterface(params.id);
      fetchSite(params.id);
    }
  }, [params.id]);

  const onClick = (e) => {
    const current = interfaceList.filter((inter) => inter.id === e.key)[0];
    setCurrentInterface(current);
    analysisParams(current);
  };

  const generateCode = () => {
    currentInterface &&
      generatePage({
        path: '/home',
        siteId: currentInterface?.siteId,
        interfaceId: currentInterface?.id,
        name: 'website',
        templateId: '61efc1c078b2d45cb889df8a',
        type: 0,
        device: 0,
      }).then((res) => {
        seteditorValue(res.data);
        setOpen(true);
      });
  };

  const onClose = () => {
    setOpen(false);
  };

  const columns: ColumnsType<IProperty> = [
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <a>{text}</a>,
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: '默认值',
      dataIndex: 'example',
      key: 'example',
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: '订正后数据',
      dataIndex: ' recoverType',
      key: 'recoverType',
    },
    {
      title: '操作',
      key: 'action',
      render: (_) => (
        <Space size="middle">
          <a>数据订正</a>
        </Space>
      ),
    },
  ];

  const confirm = () => { };

  return (
    <>
      <PageContainer
        header={{
          title: site.name,
        }}
        extra={[
          <EddSite key="1" {...site}>
            <Button>修改项目</Button>
          </EddSite>,
          <SyncInterface key="2" {...site} placement="bottomRight">
            <Button type="primary" danger>
              接口同步
            </Button>
          </SyncInterface>,
        ]}
      >
        <Spin spinning={showSpin} tip="加载中..." style={{ width: '100vw' }}>
          {currentInterface && (
            <Row gutter={20}>
              <Col span={4}>
                <Menu
                  onClick={onClick}
                  defaultOpenKeys={[currentInterface.tags[0]]}
                  selectedKeys={[currentInterface.id]}
                  mode="inline"
                  items={menuList}
                />
              </Col>
              <Col span={20}>
                <Descriptions
                  style={{ marginBottom: '20px' }}
                  title={currentInterface.summary}
                  extra={
                    <Button type="primary" onClick={generateCode}>
                      解析当前 Schema
                    </Button>
                  }
                >
                  <Descriptions.Item label="URL">
                    <Tag color="blue">{currentInterface.url}</Tag>
                  </Descriptions.Item>
                  <Descriptions.Item label="接口信息">
                    <Tag color="magenta">
                      {_.toUpper(currentInterface.parameterType)}
                    </Tag>
                    <Tag color="red">
                      {_.toUpper(currentInterface.methodType)}
                    </Tag>
                  </Descriptions.Item>
                  <Descriptions.Item label="最后修改时间">
                    <Tag color="purple">
                      {dayjs(currentInterface.updateDate).format(
                        'YYYY-MM-DD hh:mm:ss',
                      )}
                    </Tag>
                  </Descriptions.Item>
                </Descriptions>
                <Card title="请求体" bordered={false}>
                  <Table
                    columns={columns}
                    dataSource={formData}
                    rowKey={(row) => row.name}
                  />
                </Card>
              </Col>
            </Row>
          )}
          {!currentInterface && (
            <Empty
              imageStyle={{
                height: 60,
              }}
              description={<span>暂无接口数据，请同步。</span>}
            >
              <SyncInterface {...site}>
                <Button type="primary">接口同步</Button>
              </SyncInterface>
            </Empty>
          )}
        </Spin>
      </PageContainer>
      <Drawer
        title="源代码推导预览"
        placement="right"
        open={open}
        onClose={onClose}
        width={1000}
        footer={
          <div>
            <Form
              style={{ width: 500 }}
              name="basic"
              initialValues={{
                defaultFrame: 'react',
                pageType: 'pc',
                defaultTpl: 'form',
              }}
            >
              <Form.Item label="页面类型" name="pageType">
                <Radio.Group>
                  <Radio value="pc"> PC </Radio>
                  <Radio value="h5" disabled>
                    H5
                  </Radio>
                  <Radio value="rn" disabled>
                    RN
                  </Radio>
                </Radio.Group>
              </Form.Item>
              <Form.Item label="编程语言" name="defaultFrame">
                <Radio.Group>
                  <Radio value="react"> React </Radio>
                  <Radio value="vue" disabled>
                    Vue
                  </Radio>
                </Radio.Group>
              </Form.Item>
              <Form.Item label="预设模版" name="defaultTpl">
                <Select
                  placeholder="Select a option and change input text above"
                  allowClear
                >
                  <Option key="from" value="form">
                    表单
                  </Option>
                  <Option key="table" value="table">
                    表格
                  </Option>
                </Select>
              </Form.Item>
              <Form.Item>
                <Space>
                  <Button>保存页面</Button>
                  <Button type="primary">进入设计器编辑</Button>
                </Space>
              </Form.Item>
            </Form>
          </div>
        }
      >
        <>
          <Alert
            message="以下代码仅依靠类型推导生成，如需更多的定制，请前往设计器调试!"
            type="warning"
            style={{ marginBottom: '10px' }}
          />
          <MonacoEditor
            width="100%"
            height="900"
            language="sql"
            theme="vs-dark"
            value={editorValue}
            onChange={(v) => seteditorValue(v)}
            ref={editorRef}
          />
        </>
      </Drawer>
    </>
  );
};

export default InterfaceDom;
