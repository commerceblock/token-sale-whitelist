import { coinfirm_api_token_encrypted } from './consts';
import { decrypt } from '../lib/env-util';

export const coinfirmApiTokenPromise = decrypt(
  'coinfirm_api_token',
  coinfirm_api_token_encrypted,
);
