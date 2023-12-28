/*
 * @Author: Cookie
 * @Description: gitLab 分支模块 api
 * ref: https://docs.gitlab.com/ee/api/merge_requests.html
 */

import { methodV } from './request';

interface IMergeRequest {
  id?: number;
  source_branch?: string;
  target_branch?: string;
  merge_request_iid?: string | number;
  title?: string;
  access_raw_diffs?: boolean;
  assignee_id?: string;
  description?: string;
}

interface ISearchCondition {
  id?: number;
  state?: 'opened' | 'all';
  milestone?: string;
  labels?: string;
  author_id?: string;
  author_username?: string;
  my_reaction_emoji?: string;
  scope?: string;
  search?: string;
}

/**
 * @description: 获取单个分支改变
 * @param {*}
 * @return {*}
 */
const getSingleMRChanges = async (
  { id, merge_request_iid, access_raw_diffs = false }: IMergeRequest,
  access_token = '',
) => {
  try {
    const { data } = await methodV({
      query: {
        access_token,
      },
      url: `/projects/${id}/merge_requests/${merge_request_iid}/changes?access_raw_diffs=${access_raw_diffs}`,
      method: 'GET',
    });
    return data;
  } catch (e) {
    return { msg: e };
  }
};

/**
 * @description: 获取单个分支信息
 * @param {IBranchList} param1
 * @return {*}
 */
const getSingleMRCommits = async (
  { id, merge_request_iid }: IMergeRequest,
  access_token,
) => {
  const { data } = await methodV({
    query: {
      access_token,
    },
    url: `/projects/${id}/merge_requests/${merge_request_iid}/commits`,
    method: 'GET',
  });
  return data;
};

/**
 * @description: 获取单个分支信息
 * @param {IBranchList} param1
 * @return {*}
 */
const createMR = async (
  {
    id,
    source_branch,
    target_branch,
    title,
    description,
    assignee_id,
  }: IMergeRequest,
  access_token = '',
) => {
  const { data } = await methodV({
    url: `/projects/${id}/merge_requests`,
    method: 'POST',
    query: {
      access_token,
    },
    params: {
      source_branch,
      target_branch,
      title,
      assignee_id,
      description,
    },
  });
  return data;
};

/**
 * @description: 获取单个分支信息
 * @param {IMergeRequest} param1
 * @return {*}
 */
const getSingleMR = async (
  { id, merge_request_iid }: IMergeRequest,
  access_token = '',
) => {
  const { data } = await methodV({
    url: `/projects/${id}/merge_requests/${merge_request_iid}`,
    query: {
      access_token,
    },
    method: 'GET',
  });
  return data;
};

/**
 * @description: 删除 mr
 * @param {IMergeRequest} param1
 * @return {*}
 */
const deleteMR = async (
  { id, merge_request_iid }: IMergeRequest,
  access_token = '',
) => {
  const { data } = await methodV({
    url: `/projects/${id}/merge_requests/${merge_request_iid}`,
    method: 'DELETE',
    query: {
      access_token,
    },
  });
  return data;
};

/**
 * @description: 获取单个mr信息
 * @param {IMergeRequest} param1
 * @return {*}
 */
const searchMR = async (conditions: ISearchCondition, access_token = '') => {
  const { data } = await methodV({
    url: `/merge_requests`,
    method: 'GET',
    query: {
      access_token,
    },
    params: { ...conditions },
  });
  return data;
};

/**
 * @description: 获取单个分支信息
 * @param {IMergeRequest} param1
 * @return {*}
 */
const getProjectMRList = async (
  { id, ...conditions }: ISearchCondition,
  access_token = '',
) => {
  const { data } = await methodV({
    url: `/projects/${id}/merge_requests`,
    method: 'GET',
    query: {
      access_token,
    },
    params: { ...conditions },
  });
  return data;
};

/**
 * @description: 获取单个分支信息
 * @param {IMergeRequest} param1
 * @return {*}
 */
const acceptMR = async (
  { id, merge_request_iid }: IMergeRequest,
  access_token = '',
) => {
  const { data } = await methodV({
    url: `/projects/${id}/merge_requests/${merge_request_iid}/merge`,
    method: 'PUT',
    query: {
      access_token,
    },
  });
  return data;
};

const closeMR = async (
  { id, merge_request_iid }: IMergeRequest,
  access_token = '',
) => {
  const { data } = await methodV({
    url: `/projects/${id}/merge_requests/${merge_request_iid}`,
    method: 'PUT',
    query: {
      access_token,
    },
  });
  return data;
};

const listOpenedMR = async (mr: IMergeRequest, access_token = '') => {
  const { data } = await methodV({
    url: `/projects/${mr.id}/merge_requests`,
    method: 'GET',
    query: {
      access_token,
      state: 'opened',
    },
  });
  return data;
};

export {
  getSingleMRChanges,
  getSingleMRCommits,
  createMR,
  getSingleMR,
  searchMR,
  getProjectMRList,
  acceptMR,
  closeMR,
  listOpenedMR,
  deleteMR,
};
