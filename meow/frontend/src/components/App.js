import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Switch, Redirect, Route, withRouter } from 'react-router-dom';

import { auth } from '../actions';
import Login from './Login/Login';
import Home from './Home/Home';
import OAuth from './OAuth/OAuth';

const PrivateRouteComponent = ({ component: Component, auth, ...rest }) => (
  <Route
    {...rest}
    render={props => {
      return auth === true ? (
        <Component {...props} />
      ) : (
        <Redirect
          to={{
            pathname: '/login',
            state: { from: props.location }
          }}
        />
      );
    }}
  />
);

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated
});

const PrivateRoute = withRouter(connect(mapStateToProps)(PrivateRouteComponent));

const RootContainerComponent = props => {
  return (
    <Switch>
      <PrivateRoute auth={props.isAuthenticated} path="/" component={Home} exact />
      <Route path="/login" component={Login} />
      <Route path="/slack" component={OAuth} />
    </Switch>
  );
};

export default withRouter(connect(mapStateToProps)(RootContainerComponent));
