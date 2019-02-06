import { combineReducers } from "redux";

import user from "./user";
import post from "./post";
import section from "./section";
import query from "./query";

const rootReducer = combineReducers({
  user,
  post,
  section,
  query
});

export default rootReducer;
