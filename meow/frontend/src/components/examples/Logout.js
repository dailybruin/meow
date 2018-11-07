import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { auth } from '../../actions';

class Logout extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        Logout!
        <form onSubmit={this.props.logout}>
          <button type="submit">LOGOUT</button>
        </form>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  logout: () => dispatch(auth.logout())
});

export default withRouter(
  connect(
    null,
    mapDispatchToProps
  )(Logout)
);
