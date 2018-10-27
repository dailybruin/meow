import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import './Login.scss';

import { auth } from '../../actions';

class Login extends Component {
  constructor(props) {
    super(props);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onSubmit(e) {
    e.preventDefault();
    this.props.login();
  }

  renderForm() {
    return (
      <div className="login">
        <h1>
          meow
          <span>.dailybruin</span>
        </h1>
        {this.props.errors.length > 0 && (
          <ul>
            {this.props.errors.map(error => (
              <li key={error.field}>{error.message}</li>
            ))}
          </ul>
        )}
        <a href="https://slack.com/oauth/authorize?scope=identity.basic,identity.email,identity.team,identity.avatar&client_id=4526132454.463841426112">
          <img
            alt="Sign in with Slack"
            height="40"
            width="172"
            src="https://platform.slack-edge.com/img/sign_in_with_slack.png"
            srcSet="https://platform.slack-edge.com/img/sign_in_with_slack.png 1x, https://platform.slack-edge.com/img/sign_in_with_slack@2x.png 2x"
          />
        </a>
      </div>
    );
  }

  render() {
    return this.props.isAuthenticated ? <Redirect to="/" /> : this.renderForm();
  }
}

const mapStateToProps = state => {
  let errors = [];

  if (state.auth.errors) {
    errors = Object.keys(state.auth.errors).map(field => ({
      field,
      message: state.auth.errors[field]
    }));
  }

  return {
    errors,
    isAuthenticated: state.auth.isAuthenticated
  };
};

const mapDispatchToProps = dispatch => ({
  login: () => dispatch(auth.login())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Login);
