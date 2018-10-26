import React, { Component } from 'react';
import { Provider, connect } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';

import meow from '../reducers';
import { auth } from '../actions';

import Login from './Login/Login';
import Home from './Home/Home';

const store = createStore(meow, applyMiddleware(thunk));

class RootContainerComponent extends Component {
  constructor(props) {
    super(props);
    this.PrivateRoute = this.PrivateRoute.bind(this);
  }

  componentDidMount() {
    this.props.fetchUser();
  }

  PrivateRoute({ component: ChildComponent, ...rest }) {
    return (
      <Route
        {...rest}
        render={props => {
          if (this.props.auth.isLoading) {
            return <em>Loading...</em>;
          }

          if (!this.props.auth.isAuthenticated) {
            return (
              <Redirect
                to={{
                  pathname: '/login',
                  state: {
                    from: props.location
                  }
                }}
              />
            );
          }

          return <ChildComponent {...props} />;
        }}
      />
    );
  }

  render() {
    const { PrivateRoute } = this;
    return (
      <BrowserRouter>
        <Switch>
          <PrivateRoute exact path="/" component={Home} />
          <Route exact path="/login" component={Login} />
        </Switch>
      </BrowserRouter>
    );
  }
}

const mapStateToProps = state => {
  return {
    auth: state.auth
  };
};

const mapDispatchToProps = dispatch => {
  return {
    fetchUser: () => {
      dispatch(auth.fetchUser());
    }
  };
};

const RootContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(RootContainerComponent);

export default function App() {
  return (
    <Provider store={store}>
      <RootContainer />
    </Provider>
  );
}
