/*
 * @Author: Cookie
 * @Description: gitlab 用户模块 api
 */

import { getConfig } from '@app/common';
import { gitPost, methodV } from './request';

const { GITLAB = {} } = getConfig();

const { ADMIN_PRIVATE_TOKEN } = GITLAB;

type PasswordGrantType = {
  username: string;
  password: string;
};

type Token = {
  access_token: string;
  token_type: string;
  refresh_token: string;
  scope: string;
  created_at: number;
};

type TokenInfo = {
  resource_owner_id: number;
  scopes: string[];
  expires_in_seconds: number;
  application: any;
  created_at: number;
};

type Auth2Token = {
  grant_type?: string;
  client_id: string;
  client_secret: string;
  code: string;
  redirect_uri: string;
};

type Auth2Code = {
  client_id: string;
};

type User = {
  id: number;
  name: string;
  username: string;
  state: string;
  avatar_url: string;
  web_url: string;
  created_at: string;
  bio: string;
  location: string;
  public_email: string;
  skype: string;
  linkedin: string;
  twitter: string;
  website_url: string;
  organization: string;
};

/**
 * @description: 获取用户信息
 * @param {*}
 * @return {*}
 */
export const getToken = async (params: PasswordGrantType): Promise<Token> => {
  const { username, password } = params;
  const token = await gitPost<Token>({
    url: '/oauth/token',
    params: {
      grant_type: 'password',
      username,
      password,
    },
  });
  return token;
};

export const getTokenInfo = async (
  access_token: string,
): Promise<TokenInfo> => {
  const tokenInfo = await gitPost<TokenInfo>({
    url: '/oauth/token/info',
    method: 'GET',
    query: {
      access_token,
    },
  });
  return tokenInfo;
};

export const getUser = async (id: number, access_token = '') => {
  const { data } = await methodV({
    url: `/users/${id}`,
    method: 'GET',
    query: {
      access_token,
    },
  });
  const user: User = data;
  return user;
};

export const getTokenByApplications = async (
  params: Auth2Token,
): Promise<Token> => {
  const { client_id, client_secret, code, redirect_uri } = params;
  const token = await gitPost<Token>({
    url: '/oauth/token',
    params: {
      grant_type: 'authorization_code',
      client_id,
      client_secret,
      code,
      redirect_uri,
    },
  });
  return token;
};
export const getAuthCode = async (params: Auth2Code): Promise<Token> => {
  const { client_id } = params;
  const token = await gitPost<Token>({
    url: '/oauth/authorize',
    method: 'GET',
    query: {
      response_type: 'token',
      client_id,
    },
  });
  return token;
};

export const createPersonalAccessToken = async (userId: number, name = '') => {
  const { data } = await methodV({
    url: `/users/${userId}/personal_access_tokens`,
    method: 'POST',
    headers: {
      'PRIVATE-TOKEN': ADMIN_PRIVATE_TOKEN,
    },
    params: {
      name,
      expires_at: '2122-00-00',
      scopes: [
        'api',
        'read_user',
        'read_api',
        'read_repository',
        'write_repository',
      ],
    },
  });
  return data;
};
export const getAllUsers = async (per_page = 100, page = 1) => {
  const { data } = await methodV({
    url: `/users`,
    method: 'GET',
    query: {
      per_page,
      page,
    },
    headers: {
      'PRIVATE-TOKEN': ADMIN_PRIVATE_TOKEN,
    },
  });
  return data;
};
