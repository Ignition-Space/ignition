import { Post } from './request';
import Axios from 'axios';
import { promisify } from 'util';
import * as stream from 'stream';
import { createWriteStream } from 'fs';

const finished = promisify(stream.finished);

interface ICodeCommitParams {
  access_token: string;
  template_id?: string;
  ext_json?: string;
  user_version?: string;
  user_desc?: any;
}

const codeCommit = async (params: ICodeCommitParams) => {
  const { access_token, ...rest } = params;
  const data = await Post({
    url: '/wxa/commit',
    method: 'POST',
    query: {
      access_token,
    },
    params: { ...rest },
  });
  return data;
};

interface IAuditParams {
  access_token: string;
  item_list?: any;
  preview_info?: any;
  version_desc?: string;
  feedback_info?: string;
  feedback_stuff?: string;
  ugc_declare?: any;
}
// 小程序代码提审
const submitAudit = async (params: IAuditParams) => {
  const { access_token, ...rest } = params;
  const data = await Post({
    url: '/wxa/submit_audit',
    method: 'POST',
    query: {
      access_token,
    },
    params: { ...rest },
  });
  return data;
};

interface IGetAuditStatusParams {
  access_token: string;
  auditid: string;
}

// 小程序代码提审状态
const getAuditStatus = async (params: IGetAuditStatusParams) => {
  console.log(params);
  const { access_token, ...rest } = params;
  const data = await Post({
    url: '/wxa/get_auditstatus',
    method: 'POST',
    query: {
      access_token,
    },
    params: { ...rest },
  });
  return data;
};

interface IGetAuthorizerParams {
  component_access_token: string;
  component_appid: string;
  offset: number;
  count: number;
}

const getAuthorizerList = async (params: IGetAuthorizerParams) => {
  const { component_access_token, ...rest } = params;
  const data = await Post({
    url: '/cgi-bin/component/api_get_authorizer_list',
    method: 'POST',
    query: {
      component_access_token,
    },
    params: { ...rest },
  });
  return data;
};

interface IApiAuthorizerTokenParams {
  component_access_token: string;
  component_appid: string;
  authorizer_appid: string;
  authorizer_refresh_token: string;
}

const getApiAuthorizerToken = async (params: IApiAuthorizerTokenParams) => {
  const { component_access_token, ...rest } = params;
  const data = await Post({
    url: '/cgi-bin/component/api_authorizer_token',
    method: 'POST',
    query: {
      component_access_token,
    },
    params: { ...rest },
  });
  return data;
};

const getQrcode = async (access_token: string, name: string) => {
  try {
    const writer = createWriteStream(`/home/app/img/${name}.jpg`);
    return Axios({
      url: `https://api.weixin.qq.com/wxa/get_qrcode?access_token=${access_token}`,
      method: 'GET',
      responseType: 'stream',
    }).then(async (response) => {
      response.data.pipe(writer);
      return finished(writer); //this is a Promise
    });
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const release = async (access_token: string) => {
  const data = await Post({
    url: '/wxa/release',
    method: 'POST',
    query: {
      access_token,
    },
  });
  return data;
};

const revertcoderelease = async (access_token: string) => {
  const data = await Post({
    url: '/wxa/revertcoderelease',
    method: 'POST',
    query: {
      access_token,
      action: 'get_history_version',
    },
  });
  return data;
};

const getprivacysetting = async (access_token: string, privacy_ver = 2) => {
  const data = await Post({
    url: '/cgi-bin/component/getprivacysetting',
    method: 'POST',
    query: {
      access_token,
    },
    params: {
      privacy_ver,
    },
  });
  return data;
};

interface ISetprivacysetting {
  access_token: string;
  privacy_ver?: number;
  owner_setting: any;
  setting_list: any;
  appid?: any;
}

const setprivacysetting = async (params: ISetprivacysetting) => {
  const { access_token, ...res } = params;
  const data = await Post({
    url: '/cgi-bin/component/setprivacysetting',
    method: 'POST',
    query: {
      access_token,
    },
    params: {
      ...res,
    },
  });
  return data;
};

const undocodeaudit = async (access_token: string) => {
  const data = await Post({
    url: '/wxa/undocodeaudit',
    method: 'GET',
    query: {
      access_token,
    },
  });
  return data;
};

export {
  submitAudit,
  getAuthorizerList,
  codeCommit,
  getApiAuthorizerToken,
  getQrcode,
  getAuditStatus,
  release,
  revertcoderelease,
  getprivacysetting,
  setprivacysetting,
  undocodeaudit,
};
