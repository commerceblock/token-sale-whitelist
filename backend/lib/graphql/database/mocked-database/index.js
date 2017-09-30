import wrapLogger from '../../utils/wrap-logger';
import wrapPromise from '../../utils/wrap-promise';

const database = {
  createAddress () { throw new Error('not implemented'); },
  getAddress () { throw new Error('not implemented'); },
};

export default wrapLogger(wrapPromise(database));
