import { combineReducers } from "redux";

import user from "./user";
import post from "./post";
import section from "./section";
import query from "./query";
import alert from "./alert";
import mobile from "./mobile";

const rootReducer = combineReducers({
  user,
  post,
  section,
  query,
  mobile,
  alert
});

export default rootReducer;
