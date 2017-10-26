import { coinfirm_api_token_encrypted } from './consts';
import { extract } from '../lib/env-util';

export const coinfirmApiTokenPromise = extract(
  'coinfirm_api_token',
  coinfirm_api_token_encrypted,
);
