import { compose, createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { routerMiddleware } from 'connected-react-router';
import { persistStore, persistReducer } from 'redux-persist';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';
import storage from 'redux-persist/lib/storage';
import { logger } from 'redux-logger';

import rootReducer from './reducers';

const persistConfig = {
  key: 'root',
  storage,
  stateReconciler: autoMergeLevel2
};

/**
 * Given an initial state object, and a history object (
 * the result of createHistory()), return a configured
 * store
 * @param initialState an object specifying initial state
 * of the app
 * @param history result of createHistory() call
 */
function configureStore(initialState = {}, history) {
  const persistedReducer = persistReducer(persistConfig, rootReducer(history));

  const middlewares = [routerMiddleware(history), thunkMiddleware];

  if (process.env.NODE_ENV === `development`) {
    middlewares.push(logger);
  }

  const store = createStore(
    persistedReducer,
    initialState,
    compose(applyMiddleware(...middlewares))
  );

  const persistor = persistStore(store);
  return { store, persistor };
}

export default configureStore;
