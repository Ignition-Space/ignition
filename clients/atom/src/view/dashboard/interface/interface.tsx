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
  Form,
  Menu,
  Popconfirm,
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
import { QuestionCircleOutlined } from '@ant-design/icons';

const { Option } = Select;

const InterfaceDom = () => {
  const params = useParams();

  const [interfaceList, setInterfaceList] = useState([]);
  const [menuList, setMenuList] = useState([]);
  const [site, setSite] = useState<ISite>({});

  const [currentInterface, setCurrentInterface] = useState<IInterface>();

  const [formData, setFormData] = useState<Array<IProperty>>([]);
  const [editorValue, seteditorValue] = useState('');
  const [open, setOpen] = useState(false);
  const editorRef = useRef();

  const fetchSite = (id: string) => {
    getSite(id).then((res) => setSite(res.data));
  };

  const fetchInterface = (id: string) => {
    getInterfaceList(id).then((res) => {
      setInterfaceList(res.data);
      setCurrentInterface(res.data[0]);
      setMenuList(
        res.data.map((d: IInterface) => ({
          key: d.id,
          label: d.summary,
        })),
      );
    });
  };

  const analysisParams = (current: IInterface) => {
    const properties = current?.schema.properties;
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
  ];

  const confirm = () => { };

  return (
    <Spin
      spinning={currentInterface == undefined || site == undefined}
      tip="加载中..."
      style={{ width: '100vw' }}
    >
      <PageContainer
        header={{
          title: site.name,
        }}
        extra={[
          <Popconfirm
            placement="bottomRight"
            title="此操作会同步更新所有的 API，可能存在已校对的 Schema 丢失，确定继续此操作吗?"
            onConfirm={confirm}
            okText="确定"
            cancelText="取消"
            icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
          >
            <Button key="1" type="primary" danger>
              重新更新 API
            </Button>
          </Popconfirm>,
        ]}
      >
        {currentInterface && (
          <Row>
            <Col span={4}>
              <Menu
                onClick={onClick}
                style={{
                  width: 256,
                }}
                selectedKeys={[currentInterface.id]}
                mode="inline"
                items={menuList}
              />
            </Col>
            <Col span={20}>
              <Descriptions
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
                <Descriptions.Item label="标签">
                  {currentInterface.tags.map((tag) => (
                    <Tag color="cyan">{tag}</Tag>
                  ))}
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
                <Table columns={columns} dataSource={formData} />
              </Card>
            </Col>
          </Row>
        )}
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
                  <Option value="form">表单</Option>
                  <Option value="table">表格</Option>
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
    </Spin>
  );
};

export default InterfaceDom;
