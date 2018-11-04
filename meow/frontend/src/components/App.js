import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Switch, Redirect, Route, withRouter } from 'react-router-dom';

import Login from './Login/Login';
import Home from './Home/Home';
import OAuth from './OAuth/OAuth';
import FilterableWrapper from './examples/FilterableWrapper';
import SMPost from './SMPost/SMPost';
import PostMaker from './examples/PostMaker';
import Logout from './examples/Logout';

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

const RootContainerComponent = props => (
  <Switch>
    <PrivateRoute auth={props.isAuthenticated} path="/" component={Home} exact />
    <Route path="/login" component={Login} />
    <Route path="/slack" component={OAuth} />
    <PrivateRoute auth={props.isAuthenticated} exact path="/posts" component={FilterableWrapper} />
    <PrivateRoute auth={props.isAuthenticated} path="/posts/:post_id" component={SMPost} />
    <PrivateRoute auth={props.isAuthenticated} path="/add" component={PostMaker} />
    <PrivateRoute auth={props.isAuthenticated} path="/logout" component={Logout} />
  </Switch>
);

export default withRouter(connect(mapStateToProps)(RootContainerComponent));
