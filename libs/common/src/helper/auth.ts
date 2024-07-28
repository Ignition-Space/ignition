import * as crypto from 'crypto';

import { getConfig } from '@app/common/utils';

const { LOCAL_USER_CONFIG } = getConfig();

//加密
export const encryptionPassword = async (password: string): Promise<string> => {
  const hmac = crypto.createHmac('sha256', LOCAL_USER_CONFIG['SECRET']);
  hmac.update(password);
  return hmac.digest('hex');
};

//验证密码
export const checkPassword = async (
  password: string,
  hash_password: string,
): Promise<boolean> => {
  password = await encryptionPassword(password);
  return password === hash_password;
};
