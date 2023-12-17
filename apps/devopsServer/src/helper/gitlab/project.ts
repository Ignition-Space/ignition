/*
 * @Author: Cookie
 * @Description: gitLab 项目模块 api
 */

import { methodV } from './request';

interface IProjectUsers {
  avatar_url?: string;
  web_url?: string;
  state?: string;
  username?: string;
  name?: string;
  id?: number;
}

interface IProjectList {
  pageSize?: number;
  pageNum?: number;
  userId?: string;
  id?: number;
}

type SearchUserProjectListConditions = {
  starred?: boolean;
};

type SearchAllProjectListCondition = {
  simple?: boolean;
  starred?: boolean;
  search?: string;
  per_page?: number;
};

/**
 * @description: 获取工程列表
 * @param {IProjectList} param1
 * @return {*}
 */
const getAllProjectList = async (
  params: SearchAllProjectListCondition,
  access_token,
) => {
  const { data } = await methodV({
    url: '/projects',
    method: 'GET',
    query: {
      access_token,
      per_page: 50,
      ...params,
    },
  });
  return data;
};

/**
 * @description: 获取工程
 * @param {IProjectList} param1
 * @return {*}
 */
const getProject = async ({ id }: IProjectList, access_token: string) => {
  const { data: project } = await methodV({
    url: `/projects/${id}`,
    method: 'GET',
    query: { access_token },
  });
  return project;
};

/**
 * @description: 创建 gitLab 工程
 * @param {any} param1
 * @return {*}
 */
const createProject = async (gitParams: any, access_token: string) => {
  const { data } = await methodV({
    query: {
      access_token: access_token,
    },
    url: '/projects',
    method: 'POST',
    params: gitParams,
  });
  return data;
};

const createProjectForUser = async (gitParams: any, access_token: string) => {
  const { data } = await methodV({
    query: {
      access_token: access_token,
    },
    url: '/projects',
    method: 'POST',
    params: gitParams,
  });
  return data;
};

/**
 * @description: 删除 gitLab 工程保护分支
 * @param {number} projectId
 * @return {*}
 */
const deleteProtectedBranches = async (
  projectId: number,
  access_token: string,
) => {
  const url = `/projects/${projectId}/protected_branches/master`;
  const { data } = await methodV({
    url,
    method: 'DELETE',
    query: {
      access_token: access_token,
    },
  });
  return data;
};

/**
 * @description: 设置 gitLab 工程保护分支
 * @param {number} projectId
 * @return {*}
 */
const protectedBranches = async (projectId: number, access_token: string) => {
  const url = `/projects/${projectId}/protected_branches`;
  const { data } = await methodV({
    url,
    method: 'POST',
    query: {
      access_token: access_token,
    },
    params: {
      name: 'master',
      push_access_level: 0,
      merge_access_level: 40,
    },
  });
  return data;
};

/**
 * @description: 设置 gitLab 工程保护分支
 * @param {number} projectId
 * @return {*}
 */
const starProject = async (projectId: number, access_token: string) => {
  const url = `/projects/${projectId}/star`;
  const { data } = await methodV({
    url,
    method: 'POST',
    query: {
      access_token: access_token,
    },
  });
  return data;
};

/**
 * @description: 设置 gitLab 工程保护分支
 * @param {number} projectId
 * @return {*}
 */
const unStarProject = async (projectId: number, access_token: string) => {
  const url = `/projects/${projectId}/unstar`;
  const { data } = await methodV({
    url,
    method: 'POST',
    query: {
      access_token: access_token,
    },
  });
  return data;
};

/**
 * @description: 获取列表
 * @param {IProjectList} param1
 * @return {*}
 */
const getUserProjectList = async (
  gitUserId: number,
  params: SearchUserProjectListConditions,
  access_token: string,
) => {
  const { data: projectList } = await methodV({
    url: `/users/${gitUserId}/projects`,
    method: 'GET',
    params,
    query: {
      access_token,
    },
  });
  return { projectList };
};
/**
 * @description: 获取列表
 * @param {IProjectList} param1
 * @return {*}
 */
const getStarredUserProjectList = async (
  gitUserId: number,
  access_token: string,
) => {
  const { data: projectList } = await methodV({
    url: `/users/${gitUserId}/starred_projects`,
    method: 'GET',
    query: {
      access_token,
    },
  });
  return { projectList };
};

/**
 * @description: 获取列表
 * @param {IProjectUsers} param1
 * @return {*}
 */
const getProjectUsers = async (gitProjectId: number, access_token: string) => {
  const { data: projectUsers } = await methodV({
    url: `/projects/${gitProjectId}/users`,
    method: 'GET',
    query: {
      access_token,
    },
  });
  return { projectUsers };
};

/**
 * @description: 获取文件树
 * @param {IProjectUsers} param1
 * @return {*}
 */
const getProjectTree = async (
  gitProjectId: number,
  access_token: string,
  file_path: string,
) => {
  const { data } = await methodV({
    url: `/projects/${gitProjectId}/repository/tree`,
    method: 'GET',
    query: {
      access_token,
      path: file_path,
    },
  });
  return { data };
};

/**
 * @description: 比较
 * @return {*}
 */
const getProjectCompare = async (
  gitProjectId: number,
  from: string,
  to: string,
) => {
  const { data } = await methodV({
    url: `/projects/${gitProjectId}/repository/compare`,
    method: 'GET',
    query: {
      from,
      to,
    },
  });
  return { data };
};

/**
 * @description: 获取源文件内容
 * @param {IProjectUsers} param1
 * @return {*}
 */
const getProjectFiles = async (
  gitProjectId: number,
  access_token: string,
  file_path: string,
) => {
  const { data } = await methodV({
    url: `/projects/${gitProjectId}/repository/files/${file_path}/raw?ref=master`,
    method: 'GET',
    query: {
      access_token,
    },
  });
  return { data };
};

export {
  getStarredUserProjectList,
  getUserProjectList,
  starProject,
  unStarProject,
  createProjectForUser,
  getAllProjectList,
  getProject,
  createProject,
  deleteProtectedBranches,
  protectedBranches,
  getProjectUsers,
  getProjectTree,
  getProjectCompare,
  getProjectFiles,
};
