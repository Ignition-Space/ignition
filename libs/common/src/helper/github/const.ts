/*
 * @Author: Cookie
 * @Description: 
 */

import { getConfig } from "../../utils";

const { GITGUB_CONFIG } = getConfig()

export const GITHUB_ID = GITGUB_CONFIG.CLIENT_ID
export const GITHUB_SECRET = GITGUB_CONFIG.CLIENT_SECRETS

export const BASE_GITHUB_URL = "https://github.com/"
