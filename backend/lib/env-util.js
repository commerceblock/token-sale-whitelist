// imports
import AWS from 'aws-sdk';
import { createLogger } from 'bunyan';

// local imports
import { base64_encoding } from '../model/consts';

// logging
const log = createLogger({ name: 'env-util' });

const kms = new AWS.KMS();

export function decrypt(name, encrypted) {
  return kms.decrypt({ CiphertextBlob: Buffer.from(encrypted, base64_encoding) })
    .promise()
    .then(data => String(data.Plaintext))
    .catch(err => {
      log.error({
        name,
        encrypted,
        err,
      }, `FAILED TO DECRYPT ${name}`);
      return 'INVALID';
    });
}
