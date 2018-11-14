import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import './Login.scss';

import { auth } from '../../actions';

class Login extends Component {
  render() {
    return (
      <div className="login">
        <h1>
          meow
          <span>.dailybruin</span>
        </h1>
        <form onSubmit={this.props.login}>
          <button type="submit">Sign in with Slack</button>
        </form>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated
});

const mapDispatchToProps = dispatch => ({
  login: e => dispatch(auth.login(e))
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Login)
);
