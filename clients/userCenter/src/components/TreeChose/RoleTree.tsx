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
  onOk: (keys: string[], tree: object, role) => Promise<void>; // 确定
  onClose: () => void; // 关闭
}

export default function RoleTreeComponent(props: Props): JSX.Element {
  const [nowKeys, setNowKeys] = useState<string[]>([]);
  const [nowTree, setNowTree] = useState({});

  useEffect(() => {
    setNowKeys(props.defaultKeys.map((item) => `${item}`));
  }, [props.defaultKeys]);

  // 点击确定时触发
  const onOk = useCallback(() => {
    // 通过key返回指定的数据
    console.log('nowKeys==>', nowKeys);
    const res = props.data.filter((item) => {
      return nowKeys.includes(`${item.id}`);
    });
    // 返回选中的keys和选中的具体数据
    props.onOk && props.onOk(nowKeys, nowTree, res);
  }, [props, nowKeys]);

  const convertToTreeData = (data) => {
    const parent = data.filter((d) => d.indexOf('sys_') == 0);
    const parentObj = {};
    parent.forEach((p) => {
      const roles = data.filter((d) => d.indexOf(p) > 0);
      parentObj[p] = roles;
    });
    return parentObj;
  };

  // 点击关闭时触发
  const onClose = useCallback(() => {
    props.onClose();
  }, [props]);

  // 选中或取消选中时触发
  const onCheck = useCallback((keys: any, e) => {
    const { halfCheckedKeys } = e;
    console.log('halfCheckedKeys==>', halfCheckedKeys, e, keys);
    setNowKeys(keys);
    const originKeys = [...keys, ...halfCheckedKeys];
    setNowTree(convertToTreeData(originKeys));
  }, []);

  // 处理原始数据，将原始数据处理为层级关系
  const sourceData = useMemo(() => {
    const roleData = cloneDeep(props.data);

    roleData.forEach((sys) => {
      sys.key = `sys_${sys.id}`;
      sys.roles.forEach((role) => {
        role.key = `role_sys_${sys.id}_${role.id}`;
      });
    });

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
        defaultExpandAll={true}
        checkable
        selectable={false}
        checkedKeys={nowKeys}
        onCheck={onCheck}
        fieldNames={{
          title: 'name',
          key: 'key',
          children: 'roles',
        }}
        treeData={sourceData}
      />
    </Modal>
  );
}
