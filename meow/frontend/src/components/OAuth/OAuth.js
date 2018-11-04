import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import queryString from 'query-string';

import { auth } from '../../actions';

class OAuth extends Component {
  componentWillMount() {
    console.log('OAUTH WILL MOUNT');
    console.log(this.props);
    console.log(this.props.register);
    const slackCode = queryString.parse(this.props.location.search, {
      ignoreQueryPrefix: true
    }).code;
    console.log(slackCode);
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
