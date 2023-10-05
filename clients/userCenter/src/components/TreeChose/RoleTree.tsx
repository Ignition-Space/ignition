/* Tree选择 - 角色选择 - 多选 */
import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Tree, Modal } from 'antd';
import { cloneDeep } from 'lodash';
import { Role } from '@/models/index.type';

interface Props {
  title: string; // 标题
  data: Role[]; //  原始数据
  defaultKeys: number[]; // 当前默认选中的key们
  visible: boolean; // 是否显示
  loading: boolean; // 确定按钮是否在等待中状态
  onOk: (keys: string[], role) => Promise<void>; // 确定
  onClose: () => void; // 关闭
}

export default function RoleTreeComponent(props: Props): JSX.Element {
  const [nowKeys, setNowKeys] = useState<string[]>([]);

  useEffect(() => {
    setNowKeys(props.defaultKeys.map((item) => `${item}`));
  }, [props.defaultKeys]);

  // 点击确定时触发
  const onOk = useCallback(() => {
    // 通过key返回指定的数据
    const res = props.data.filter((item) => {
      return nowKeys.includes(`${item.id}`);
    });
    // 返回选中的keys和选中的具体数据
    props.onOk && props.onOk(nowKeys, res);
  }, [props, nowKeys]);

  // 点击关闭时触发
  const onClose = useCallback(() => {
    props.onClose();
  }, [props]);

  // 选中或取消选中时触发
  const onCheck = useCallback((keys: any) => {
    setNowKeys(keys);
  }, []);

  // 处理原始数据，将原始数据处理为层级关系
  const sourceData = useMemo(() => {
    const roleData = cloneDeep(props.data);

    return roleData;
  }, [props.data]);

  return (
    <Modal
      title={props.title || '请选择'}
      open={props.visible}
      wrapClassName="menuTreeModal"
      confirmLoading={props.loading}
      onOk={onOk}
      onCancel={onClose}
    >
      <Tree
        checkable
        selectable={false}
        checkedKeys={nowKeys}
        onCheck={onCheck}
        fieldNames={{
          title: 'name',
          key: 'id',
          children: 'roles',
        }}
        treeData={sourceData}
      />
    </Modal>
  );
}
