'use client';

import React from 'react';
import { Modal, Form, Button } from 'antd';

interface FormModalProps {
  title: string;
  open: boolean;
  onCancel: () => void;
  onFinish: (values: any) => void;
  confirmLoading: boolean;
  children: React.ReactNode;
  width?: number;
  initialValues?: any;
  formProps?: any;
}

const FormModal: React.FC<FormModalProps> = ({
  title,
  open,
  onCancel,
  onFinish,
  confirmLoading,
  children,
  width = 600,
  initialValues = {},
  formProps = {},
}) => {
  const [form] = Form.useForm();

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  const handleOk = () => {
    form.submit();
  };

  const handleFinish = (values: any) => {
    onFinish(values);
  };

  return (
    <Modal
      title={title}
      open={open}
      onCancel={handleCancel}
      width={width}
      footer={[
        <Button key="cancel" onClick={handleCancel}>
          取消
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={confirmLoading}
          onClick={handleOk}
        >
          确定
        </Button>,
      ]}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        initialValues={initialValues}
        {...formProps}
      >
        {children}
      </Form>
    </Modal>
  );
};

export default FormModal;
