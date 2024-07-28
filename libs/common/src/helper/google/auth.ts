import {
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_REDIRECT_URIS,
} from './const';

import { OAuth2Client } from 'google-auth-library';

const client = new OAuth2Client();

/**
 * @description: 验证GoogleID
 */
export const getGoogleUser = async ({ code }) => {
  const { tokens } = await client.getToken({
    code,
    client_id: GOOGLE_CLIENT_ID,
  });
  console.log('tokens=====>', tokens);
  const ticket = await client.verifyIdToken({
    idToken: tokens.id_token,
    audience: GOOGLE_CLIENT_ID,
  });
  const payload = ticket.getPayload();
  const userid = payload['sub'];
  console.log('payload===>', payload);
  return payload;
};
