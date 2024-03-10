import { method } from '@app/common/utils/request';

export const getRecursion = async (url: string) => {
  console.log(url);
  const { data } = await method({
    method: 'GET',
    url,
  });
  return data;
};
