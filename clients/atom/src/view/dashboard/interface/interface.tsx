import {
  generatePage,
  getInterfaceList,
  getSite,
  IInterface,
  ISite,
} from '@/services';
import { Button, Col, Descriptions, Empty, Menu, Row, Spin, Tag } from 'antd';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import dayjs from 'dayjs';
import _ from 'lodash';
import { PageContainer } from '@ant-design/pro-layout';
import EddSite from '../site/EddSite';
import SyncInterface from '../site/SyncInterface';
import CodeEdit from './CodeEdit';
import Parameter from './Parameter';

const InterfaceDom = () => {
  const params = useParams();

  const [interfaceList, setInterfaceList] = useState([]);
  const [menuList, setMenuList] = useState<any>([]);
  const [site, setSite] = useState<ISite>({});

  const [currentInterface, setCurrentInterface] = useState<IInterface>();

  const [editorValue, setEditorValue] = useState('');
  const [showSpin, setShowSpin] = useState(true);
  const [open, setOpen] = useState(false);

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

  useEffect(() => {
    if (params.id) {
      fetchInterface(params.id);
      fetchSite(params.id);
    }
  }, [params.id]);

  const onClick = (e) => {
    const current = interfaceList.filter((inter) => inter.id === e.key)[0];
    setCurrentInterface(current);
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
        setEditorValue(res.data);
        setOpen(true);
      });
  };

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
                <Parameter originData={currentInterface}></Parameter>
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
      <CodeEdit
        open={open}
        editorValue={editorValue}
        setEditorValue={setEditorValue}
        setOpen={setOpen}
      ></CodeEdit>
    </>
  );
};

export default InterfaceDom;
