/*
 * @Author: Cookie
 * @Description:
 */

import { request } from '@app/common/utils/request';

const TOKEN_URL =
  'https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal';
const APP_ID = 'cli_a1bfcde032781013';
const APP_SECRET = 'v0bx3Od8osTdleRMQv2jHdrZRcOoEpCd';

const getToken = async () => {
  const option = {
    method: 'POST',
    data: {
      app_id: APP_ID,
      app_secret: APP_SECRET,
    },
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  };
  const res: any = await request({
    url: TOKEN_URL,
    option,
  });
  return res.data.tenant_access_token;
};

export { getToken };
