import React from "react";
import { connect } from "react-redux";
import { Route, Switch } from "react-router-dom";
import Home from "./Home";
import Authorization from "../authorization";
import Login from "./Login";

import setDevice from "../actions/mobile";

class App extends React.Component {
  componentDidMount() {
    if (typeof window !== "undefined") {
      this.props.setDevice(window.innerWidth);
    }
  }

  render() {
    return (
      <Switch>
        <Route path="/login" component={Login} />
        <Route path="/" component={Authorization(Home)} />
      </Switch>
    );
  }
}

const mapDispatchToProps = {
  setDevice: width => setDevice(width)
};

export default connect(
  null,
  mapDispatchToProps
)(App);
