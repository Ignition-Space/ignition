/*
 * @Author: Cookie
 * @Description:
 */

import { request } from '@app/common/utils/request';
import { getToken } from './fToken';

const MESSAGES_URL =
  'https://open.feishu.cn/open-apis/im/v1/messages?receive_id_type=email';

const sendMergeNotice = async (params) => {
  const {
    email,
    projectName,
    description,
    title,
    btnTip,
    checkUrl,
    template = 'orange',
  } = params;

  const app_token = await getToken();

  const cardContent = [
    {
      tag: 'div',
      text: {
        content: `${title}`,
        tag: 'lark_md',
      },
    },
    {
      tag: 'div',
      text: {
        content: `${description}`,
        tag: 'lark_md',
      },
    },
    {
      actions: [
        {
          tag: 'button',
          text: {
            content: btnTip,
            tag: 'plain_text',
          },
          type: 'primary',
          url: `${checkUrl}`,
        },
      ],
      tag: 'action',
    },
  ];
  const option = {
    method: 'POST',
    data: {
      msg_type: 'interactive',
      receive_id: email,
      content: JSON.stringify({
        config: {
          wide_screen_mode: true,
        },
        header: {
          template: template,
          title: {
            content: `来自 (${projectName}) 的 CODE REVIEW`,
            tag: 'plain_text',
          },
        },
        i18n_elements: {
          zh_cn: cardContent,
        },
      }),
    },
    headers: {
      Authorization: `Bearer ${app_token}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  };

  const res = await request({
    url: MESSAGES_URL,
    option,
  });
  console.log(res);
};

export { sendMergeNotice };
