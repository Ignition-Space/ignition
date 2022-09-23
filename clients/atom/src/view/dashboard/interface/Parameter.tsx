import { IInterface, IProperty } from '@/services';
import { Card, Space, Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { useEffect, useState } from 'react';

interface IParameterProps {
  originData: IInterface;
}

const Parameter = (props: IParameterProps) => {
  const { originData } = props;

  const [formData, setFormData] = useState<Array<IProperty>>([]);

  useEffect(() => {
    const { schema, methodType } = originData;
    const { properties } = schema;
    if (methodType === 'get') {
      setFormData(
        schema.map((sch: any) => {
          return {
            name: sch.name,
            type: sch.schema.type,
            example: '',
            description: '',
          };
        }),
      );
      return;
    }

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
  }, [originData]);

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
      title: '订正类型',
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

  return (
    <Card title="请求体" bordered={false}>
      <Table
        columns={columns}
        dataSource={formData}
        rowKey={(row) => row.name}
      />
    </Card>
  );
};

export default Parameter;
