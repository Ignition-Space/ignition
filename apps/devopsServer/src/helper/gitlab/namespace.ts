/*
 * @Author: Cookie
 * @Description: gitLab 分支模块 api
 */

import { methodV } from './request';

export interface Namespace {
  id?: string;
  name?: string;
  path?: string;
  kind?: string;
  full_path?: string;
  parent_id?: string;
  avatar_url?: string;
  web_url?: string;
  members_count_with_descendants?: string;
  billable_members_count?: string;
  max_seats_used?: string;
  seats_in_use?: string;
  plan?: string;
  trial_ends_on?: string;
  trial?: string;
}

/**
 * @description: 获取单个分支信息
 * @param {IMergeRequest} param1
 * @return {*}
 */
const getNamespace = async ({ id }: Namespace, access_token = '') => {
  const { data } = await methodV({
    url: `/namespaces/${id}`,
    method: 'PUT',
    query: {
      access_token,
    },
  });
  return data;
};

export { getNamespace };
