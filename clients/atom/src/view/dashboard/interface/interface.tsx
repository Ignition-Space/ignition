import {
  generatePage,
  getInterfaceList,
  getSite,
  IInterface,
  IProperty,
  ISite,
} from '@/services';
import {
  Button,
  Card,
  Col,
  Descriptions,
  Drawer,
  Menu,
  Row,
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

  return (
    <Spin
      spinning={currentInterface == undefined || site == undefined}
      tip="加载中..."
      style={{ width: '100vw' }}
    >
      {/* <PageContainer
        header={{
          title: site.name,
        }}
        extra={[
          <Button key="1" type="primary">
            主操作
          </Button>,
        ]}
      > */}
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
                  生成页面
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
                <Tag color="red">{_.toUpper(currentInterface.methodType)}</Tag>
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
      {/* </PageContainer> */}
      <Drawer
        title="源代码预览"
        placement="right"
        open={open}
        onClose={onClose}
        width={1000}
      >
        <MonacoEditor
          width="100%"
          height="900"
          language="sql"
          theme="vs-dark"
          value={editorValue}
          onChange={(v) => seteditorValue(v)}
          ref={editorRef}
        />
      </Drawer>
    </Spin>
  );
};

export default InterfaceDom;
