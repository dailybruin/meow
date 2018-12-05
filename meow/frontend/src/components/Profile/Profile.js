import React from 'react';
import axios from 'axios';

import { FETCH_USER_URL } from '../../actions/constants';

export default class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null
    };
  }

  componentWillMount() {
    let token = 1; //TODO
    let post_id = this.props.match.params.user_id;
    let post_endpoint = FETCH_USER_URL.concat(String(user_id));

    const body = {
      headers: {
        Authorization: 'Token ' + token
      }
    };

    axios.get(post_endpoint).then(res => {
      this.setState({ data: res.data });
    });
  }

  render() {
    return this.state.data ? this.renderPost() : this.renderNull();
  }
}
