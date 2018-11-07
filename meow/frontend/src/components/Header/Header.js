import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

class Header extends Component {
  render() {
    return (
      <div>
        <h1>meow</h1>
        <p>Hi there, {this.props.user ? this.props.user : 'null'}!</p>
        <p>Your token is: {this.props.token}</p>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  user: state.auth.user,
  token: state.auth.token
});

export default withRouter(connect(mapStateToProps)(Header));
