import wrapLogger from '../utils/wrap-logger';
import createAddress from './create-address';
import listAddress from './list-address';
import saveFile from './save-file';
import createApplication from './create-application';
import listApplication from './list-application';

const database = {
  createAddress,
  listAddress,
  saveFile,
  createApplication,
  listApplication,
};

export default wrapLogger(database);
