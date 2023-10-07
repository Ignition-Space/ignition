/** 权限Table树 **/

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Modal, Tree } from 'antd';
import { cloneDeep } from 'lodash';

// 默认被选中的菜单和权限
export type PowerTreeDefault = {
  resource: any;
  privilege: any;
};

export type PowerLevel = {
  parent?: PowerLevel;
  children?: PowerLevel[];
  key?: number;
};

interface Props {
  title: string; // 指定模态框标题
  data: any; // 所有的菜单&权限原始数据
  defaultKeys: number[]; // 当前默认选中的key们
  modalShow: boolean; // 是否显示
  initloading?: boolean; // 初始化时，树是否处于加载中状态
  loading: boolean; // 提交表单时，树的确定按钮是否处于等待状态
  onClose: () => void; // 关闭模态框
  onOk: (keys: string[], tree: object, role) => Promise<void>; // 确定
}

export default function TreeTable(props: Props): JSX.Element {
  const [nowKeys, setNowKeys] = useState<string[]>([]);
  const [nowTree, setNowTree] = useState({});

  useEffect(() => {
    setNowKeys(props.defaultKeys.map((item) => `${item}`));
  }, [props.defaultKeys]);

  // 选中或取消选中时触发
  const onCheck = useCallback((keys: any, e) => {
    const { halfCheckedKeys } = e;
    setNowKeys(keys);
    const originKeys = [...keys, ...halfCheckedKeys];
    setNowTree(convertToTreeData(originKeys));
  }, []);

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
    const parent = data.filter((d) => d.indexOf('res_') == 0);
    const parentObj = {};
    parent.forEach((p) => {
      const roles = data.filter((d) => d.indexOf(p) > 0);
      parentObj[p] = roles;
    });
    return parentObj;
  };

  // 处理原始数据，将原始数据处理为层级关系
  const sourceData = useMemo(() => {
    const resouceData = cloneDeep(props.data);

    resouceData.forEach((sys) => {
      sys.key = `res_${sys.key}`;
      sys.privileges.forEach((res) => {
        res.key = `privilege_res_${res.resourceKey}_${res.id}`;
      });
    });

    return resouceData;
  }, [props.data]);

  // 关闭模态框
  const onClose = useCallback(() => {
    props.onClose();
  }, [props]);

  return (
    <Modal
      className="menu-tree-table"
      zIndex={1001}
      width={750}
      title={props.title || '请选择'}
      open={props.modalShow}
      onOk={onOk}
      onCancel={onClose}
      confirmLoading={props.loading}
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
          children: 'privileges',
        }}
        treeData={sourceData}
      />
    </Modal>
  );
}
