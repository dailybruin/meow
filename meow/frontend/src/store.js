import { applyMiddleware, createStore, compose } from "redux";
import thunkMiddleware from "redux-thunk";
import { createLogger } from "redux-logger";
import { persistStore, persistCombineReducers } from "redux-persist";
import autoMergeLevel2 from "redux-persist/lib/stateReconciler/autoMergeLevel2";
import storage from "redux-persist/lib/storage";

const middlewares = [thunkMiddleware, createLogger()];

const enhancers = [
  applyMiddleware(...middlewares),
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
];

const persistConfig = {
  key: "root",
  storage,
  stateReconciler: autoMergeLevel2
};

const reducer = persistCombineReducers(persistConfig, require("./reducers"));

export const store = createStore(reducer, undefined, compose(...enhancers));

export const persistor = persistStore(store, null);
