import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { auth } from '../../actions';

class Header extends Component {
  componentWillMount() {
    this.props.fetch_user(this.props.token);
  }
  render() {
    return (
      <div>
        <h1>meow</h1>
        <p>Hi there, {this.props.user ? this.props.user.username : 'null'}!</p>
        <p>Your token is: {this.props.token}</p>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  fetch_user: token => dispatch(auth.fetch_user(token))
});
const mapStateToProps = state => ({
  user: state.auth.user,
  token: state.auth.token
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Header)
);
