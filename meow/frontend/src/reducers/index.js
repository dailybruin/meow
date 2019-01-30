import { combineReducers } from "redux";

import user from "./user";
import post from "./post";
import section from "./section";

const rootReducer = combineReducers({
  user,
  post,
  section
});

export default rootReducer;
