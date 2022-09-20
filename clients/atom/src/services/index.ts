import { request } from '@/util/request';

const prefix = 'http://localhost:3000/api/';

export const getSiteList = () => {
  request({
    prefix,
    url: 'site/getList',
  });
};
