import { combineReducers } from "redux";

import user from "./user";
import post from "./post";
import section from "./section";
import query from "./query";
import alert from "./alert";

const rootReducer = combineReducers({
  user,
  post,
  section,
  query,
  alert
});

export default rootReducer;
