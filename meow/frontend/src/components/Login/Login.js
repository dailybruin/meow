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
        <form onSubmit={this.onSubmit} className="login-form">
          <div className="btnwrap">
            <input id="submit_button" type="submit" value="sign in with slack" />
          </div>
        </form>
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
