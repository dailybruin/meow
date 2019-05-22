import { combineReducers } from "redux";

import user from "./user";
import post from "./post";
import section from "./section";
import query from "./query";
import mobile from "./mobile";

const rootReducer = combineReducers({
  user,
  post,
  section,
  query,
  mobile
});

export default rootReducer;
