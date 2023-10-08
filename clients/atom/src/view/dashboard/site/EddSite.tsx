import { ISite, setSite } from '@/services';
import { ModalForm, ProFormInstance, ProFormText } from '@ant-design/pro-components';
import { message } from 'antd';
import { ReactNode, useRef } from 'react';

interface IEddSiteProps extends ISite {
  children?: ReactNode;
}

const EddSite = (props: IEddSiteProps) => {
  const editRef = useRef<ProFormInstance>();

  const initFrom = () => {
    editRef.current?.setFieldsValue({
      name: props.name,
      url: props.url,
      description: props.description,
    });
  };

  return (
    <ModalForm
      title="编辑站点"
      formRef={editRef}
      onOpenChange={initFrom}
      trigger={props.children}
      onFinish={async (values) => {
        await setSite({
          ...props,
          ...values,
        }).then(() => {
          message.success('提交成功');
        });
        return true;
      }}
    >
      <ProFormText
        width="md"
        name="url"
        label="解析URL"
        placeholder="请输入待解析 URL"
      />

      <ProFormText
        width="md"
        name="name"
        label="站点名称"
        placeholder="请输入解析站点名称"
      />
      <ProFormText
        width="md"
        name="description"
        label="站点描述"
        placeholder="请输入解析站点描述"
      />
    </ModalForm>
  );
};

export default EddSite;
