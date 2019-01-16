import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

class Header extends Component {
  render() {
    return (
      <div>
        <p>Hi there, {this.props.user ? this.props.user : "null"}!</p>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  username: state.default.user.username,
  firstName: state.default.user.firstName
});

export default withRouter(connect(mapStateToProps)(Header));
