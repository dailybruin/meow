import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import queryString from 'query-string';

import { auth } from '../../actions';

class OAuth extends Component {
  componentWillMount() {
    const slackCode = queryString.parse(this.props.location.search, {
      ignoreQueryPrefix: true
    }).code;
    this.props.register(slackCode).then(res => {
      this.props.history.replace('/');
    });
  }

  render() {
    return null;
  }
}

const mapDispatchToProps = dispatch => ({
  register: code => dispatch(auth.register(code))
});

export default connect(
  null,
  mapDispatchToProps
)(OAuth);
