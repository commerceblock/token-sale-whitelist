// local imports
import { createId } from '../../uuid';
import { storage_bucket } from '../../../model/consts';
import { generateSignedPutUrl } from '../../s3-client';

export default async (fileInput) => {
  const ext = parseExtension(fileInput.fileName);
  const fileKey = `${createId()}.${ext}`;
  const fileS3Url = await generateSignedPutUrl(storage_bucket, fileKey, fileInput.fileType);
  return {
    fileKey,
    imageType: fileInput.imageType,
    fileS3Url,
  };
};

function parseExtension(fname) {
  const ext = fname.slice((fname.lastIndexOf('.') - 1 >>> 0) + 2) || '';
  return ext.toLowerCase();
};
