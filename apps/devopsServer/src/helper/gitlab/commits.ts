import { methodV } from './request';

export interface IGitCommits {
  ref_name?: string;
  projectId: number;
  sha?: string;
  since?: string;
  first_parent?: boolean;
}

/**
 * @description: 获取提交记录
 * @param {*}
 * @return {*}
 */
export const getGitCommits = async (
  { projectId, ...rest }: IGitCommits,
  access_token = '',
) => {
  try {
    const { data, code } = await methodV({
      url: `/projects/${projectId}/repository/commits`,
      method: 'GET',
      query: {
        ...rest,
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
 * @description: 获取提交记录
 * @param {*}
 * @return {*}
 */
export const getSingleGitCommits = async (
  { projectId, sha }: IGitCommits,
  access_token = '',
) => {
  try {
    const { data, code } = await methodV({
      url: `/projects/${projectId}/repository/commits/${sha}`,
      method: 'GET',
      query: {
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
 * @description: 获取提交记录diff
 * @param {*}
 * @return {*}
 */
export const getGitCommitsDiff = async (
  { projectId, sha }: IGitCommits,
  access_token = '',
) => {
  try {
    const { data, code } = await methodV({
      url: `/projects/${projectId}/repository/commits/${sha}/diff`,
      method: 'GET',
      query: {
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
 * @description: 获取提交记录diff
 * @param {*}
 * @return {*}
 */
export const getRepositoryCompare = async (
  { projectId, ...rest }: IGitCommits,
  access_token = '',
) => {
  try {
    const { data, code } = await methodV({
      url: `/projects/${projectId}/repository/compare`,
      method: 'GET',
      query: {
        ...rest,
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
