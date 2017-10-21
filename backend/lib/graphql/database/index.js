import wrapLogger from '../utils/wrap-logger';
import createAddress from './create-address';
import getAddress from './get-address';

const database = {
  createAddress,
  getAddress,
};

export default wrapLogger(database);
