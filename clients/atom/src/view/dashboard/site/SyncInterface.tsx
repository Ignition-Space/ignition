import { analysisInterface, ISite } from '@/services';
import { message, Popconfirm, Spin } from 'antd';
import { TooltipPlacement } from 'antd/es/tooltip';
import { ReactNode, useState } from 'react';

interface ISyncInterface extends ISite {
  children?: ReactNode;
  placement?: TooltipPlacement;
}

const SyncInterface = (props: ISyncInterface) => {
  const { children, placement } = props;
  const [syncInter, setSyncInter] = useState(false);

  const analysis = (id: string) => {
    setSyncInter(true);
    analysisInterface(id).then(() => {
      message.success('接口分析成功');
      setSyncInter(false);
    });
  };

  return (
    <Popconfirm
      placement={placement}
      title="此操作将同步所有接口，存在丢失已订正规则的情况，确定继续吗?"
      onConfirm={() => props.id && analysis(props.id)}
      okText="确定"
      cancelText="取消"
    >
      <Spin tip="同步中……" spinning={syncInter}>
        {children}
      </Spin>
    </Popconfirm>
  );
};

export default SyncInterface;
