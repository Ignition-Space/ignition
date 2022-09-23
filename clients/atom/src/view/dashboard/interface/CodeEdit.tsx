import { Alert, Button, Drawer, Form, Radio, Select, Space } from 'antd';
import { useRef } from 'react';
import MonacoEditor from 'react-monaco-editor';

const { Option } = Select;

interface ICodeEditProps {
  open: boolean;
  editorValue: string;
  setEditorValue: (v: string) => void;
  setOpen: (v: boolean) => void;
}

const CodeEdit = (props: ICodeEditProps) => {
  const { open, editorValue, setEditorValue, setOpen } = props;
  const editorRef = useRef();

  const onClose = () => {
    setOpen(false);
  };

  return (
    <Drawer
      title="源代码推导预览"
      placement="right"
      onClose={onClose}
      open={open}
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
              <Select placeholder="选择对应的预设类型" allowClear>
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
          height="900"
          language="react"
          theme="vs-dark"
          value={editorValue}
          onChange={(v) => setEditorValue(v)}
          ref={editorRef}
        />
      </>
    </Drawer>
  );
};

export default CodeEdit;
