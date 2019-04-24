import { combineReducers } from "redux";

import user from "./user";
import post from "./post";
import section from "./section";
import query from "./query";
import error from "./error";

const rootReducer = combineReducers({
  user,
  post,
  section,
  query,
  error
});

export default rootReducer;
