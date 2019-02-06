import React from "react";
import { Route, Switch } from "react-router-dom";
import Home from "./Home";
import Authorization from "../authorization";
import Login from "./Login";
import UserProfile from "./UserProfile/UserProfile";

const App = () => (
  <Switch>
    <Route path="/login" component={Login} />
    <Route path="/" component={Home} />
    <Route path="/profile" component={UserProfile} />
  </Switch>
);

export default App;
