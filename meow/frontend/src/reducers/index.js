import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';

import auth from './auth';
import post from './post';

/**
 * Given a history object, create a root reducer from it
 * @param history result of createHistory() call
 */
const createRootReducer = history =>
  combineReducers({
    router: connectRouter(history),
    auth,
    post
  });

export default createRootReducer;
