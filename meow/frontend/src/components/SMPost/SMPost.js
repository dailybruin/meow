import React from "react";
import axios from "axios";

const ENDPOINT = "/api/post/";

export default class SMPost extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null
    };
    this.renderPost = this.renderPost.bind(this);
    this.renderNull = this.renderNull.bind(this);
  }

  componentWillMount() {
    let post_id = this.props.match.params.post_id;
    let post_endpoint = ENDPOINT.concat(String(post_id));

    axios.get(post_endpoint).then(res => {
      this.setState({ data: res.data });
    });
  }

  renderNull() {
    return <div>No post data yet! :(</div>;
  }

  renderPost() {
    return (
      <div>
        <h1>{this.state.data.id}</h1>
        <h2>{this.state.data.slug}</h2>
      </div>
    );
  }

  render() {
    return this.state.data ? this.renderPost() : this.renderNull();
  }
}
