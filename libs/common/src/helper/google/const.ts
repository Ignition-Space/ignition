/*
 * @Author: Cookie
 * @Description: google
 */

import { getConfig } from '@app/common/utils';

const { GOOGLE_CONFIG } = getConfig();

export const GOOGLE_CLIENT_ID = GOOGLE_CONFIG.CLIENT_ID;
export const GOOGLE_CLIENT_SECRET = GOOGLE_CONFIG.CLIENT_SECRETS;
export const GOOGLE_REDIRECT_URIS = GOOGLE_CONFIG.REDIRECT_URIS;
