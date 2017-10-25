// imports
import AWS from 'aws-sdk';

// local imports
import { extract } from './env-util';

var s3 = null;

if (process.env.IS_OFFLINE) {
  s3 = Promise.resolve(new AWS.S3({
    s3ForcePathStyle: true,
    endpoint: new AWS.Endpoint('http://localhost:8000'),
    accessKeyId: 'DUMMY',
    secretAccessKey: 'DUMMY',
  }));
} else {
  try {
    init();
  } catch (err) {
    console.error('FAILED TO INIT S3 CLIENT');
    console.error(err);
  }
}

function init() {
  let creds = {
    storage_access_key: null,
    storage_secret_key: null,
  };

  function initCreds(name, encryptedValue) {
    return extract(name, encryptedValue)
      .then(value => {
        creds[name] = value;
      });
  }

  const allCreds = Promise.all([
    initCreds('storage_access_key', process.env.CB_ENC_STORAGE_ACCESS_KEY),
    initCreds('storage_secret_key', process.env.CB_ENC_STORAGE_SECRET_KEY),
  ]);

  s3 = allCreds
    .then(() => {
      return new AWS.S3({
        accessKeyId: creds.storage_access_key,
        secretAccessKey: creds.storage_secret_key,
      });
    })
    .catch(err => {
      console.error('FAILED TO INIT S3 CLIENT');
      console.error(err);
    });
}

export async function generateSignedPutUrl(bucket, key, type) {
  const params = {
    Bucket: bucket,
    Key: key,
    ACL: 'authenticated-read',
    ContentType: type,
    Expires: 15 * 60
  };
  return s3.then(client => client.getSignedUrl('putObject', params));
}
