/*
 * @Author: Cookie
 * @Description: gitLab 分支模块 api
 */

import { methodV } from './request';

interface IBranchList {
  pageSize?: number;
  pageNum?: number;
  userId?: string;
  id?: string;
  projectId: number;
  branch?: string;
  ref?: string;
}

/**
 * @description: 获取分支列表
 * @param {*}
 * @return {*}
 */
const getBranchList = async (
  { pageSize, pageNum, projectId }: IBranchList,
  access_token = '',
) => {
  try {
    const { data, code } = await methodV({
      url: `/projects/${projectId}/repository/branches`,
      method: 'GET',
      params: {
        pageSize,
        pageNum,
        projectId,
      },
      query: {
        per_page: pageSize,
        page: pageNum,
        access_token,
      },
    });
    switch (code) {
      case 200: {
        return data;
      }
      default: {
        return { msg: data };
      }
    }
  } catch (e) {
    return { msg: e };
  }
};

/**
 * @description: 获取单个分支信息
 * @param {IBranchList} param1
 * @return {*}
 */
const getSingleBranch = async (
  { projectId, branch }: IBranchList,
  access_token = '',
) => {
  return new Promise((resolve) => {
    methodV({
      url: `/projects/${projectId}/repository/branches/${encodeURIComponent(
        branch,
      )}`,
      method: 'GET',
      query: {
        access_token,
      },
    })
      .then((data) => {
        if (data.code === 200) resolve(data);
      })
      .catch(() => {
        resolve(null);
      });
  });
};

/**
 * @description: 创建分支
 * @param {IBranchList} param1
 * @return {*}
 */
const createBranch = async (
  { ref, projectId, branch }: IBranchList,
  access_token = '',
) => {
  const { data } = await methodV({
    url: `/projects/${projectId}/repository/branches`,
    params: {
      ref,
      branch,
    },
    query: { access_token },
    method: 'POST',
  });
  return data;
};

/**
 * @description: 删除分支
 * @param {IBranchList} param1
 * @return {*}
 */
const delBranch = async (
  { projectId, branch = '' }: IBranchList,
  access_token = '',
) => {
  const { data } = await methodV({
    url: `/projects/${projectId}/repository/branches/${encodeURIComponent(
      branch,
    )}`,
    method: 'DELETE',
    query: { access_token },
  });
  return data;
};

export { getBranchList, createBranch, getSingleBranch, delBranch };
