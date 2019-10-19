import React from "react";
import { connect } from "react-redux";

class Permissions extends React.Component {
  render() {
    return (
      <React.Fragment>
        <h1>Section Slacks</h1>
        <h1>Role Slacks</h1>
      </React.Fragment>
    );
  }
}

const mapDispatchToProps = {};

export default connect(
  null,
  mapDispatchToProps
)(Permissions);
