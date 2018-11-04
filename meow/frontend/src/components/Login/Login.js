import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect, withRouter } from 'react-router-dom';
import './Login.scss';

class Login extends Component {
  constructor(props) {
    super(props);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onSubmit(e) {
    console.log('on submit is being executed');
    e.preventDefault();
    window.location.replace('redirectToSlack/');
  }

  renderForm() {
    return (
      <div className="login">
        <h1>
          meow
          <span>.dailybruin</span>
        </h1>
        <form onSubmit={this.onSubmit}>
          <button type="submit">Sign in with Slack</button>
        </form>
      </div>
    );
  }

  render() {
    console.log('k');
    return this.renderForm();
  }
}

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated
});

export default withRouter(connect(mapStateToProps)(Login));
