import { combineReducers } from 'redux';

import auth from './auth';
import post from './post';

const meow = combineReducers({
  auth,
  post
});

export default meow;
