import { methodV } from './request';

type Tag = {
  id?: number;
  tag_name?: string;
  ref?: string;
  message?: string;
};

/**
 * @description: 创建标签
 * @param {Tag} param1
 * ref: https://docs.gitlab.com/ee/api/tags.html#create-a-new-tag
 * @return {*}
 */
const createTag = async (params: Tag, access_token) => {
  const { data } = await methodV({
    url: `/projects/${params.id}/repository/tags`,
    params,
    method: 'POST',
    query: {
      access_token,
    },
  });
  return data;
};

export { createTag };
