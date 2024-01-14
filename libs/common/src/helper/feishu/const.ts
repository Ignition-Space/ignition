/*
 * @Author: Cookie
 * @Description:
 */

import { getConfig } from '@app/common/utils';

const { FEISHU_CONFIG } = getConfig();

export const APP_ID = FEISHU_CONFIG.FEISHU_APP_ID;
export const APP_SECRET = FEISHU_CONFIG.FEISHU_APP_SECRET;
