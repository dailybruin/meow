import React from "react";
import { Route, Switch } from "react-router-dom";
import Home from "./Home";
import Authorization from "../authorization";
import Login from "./Login";

const App = () => (
  <Switch>
    <Route path="/login" component={Login} />
    <Route path="/" component={Authorization(Home)} />
  </Switch>
);

export default App;
