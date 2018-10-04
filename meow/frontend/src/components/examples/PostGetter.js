import React from "react";
import axios from "axios";

const ENDPOINT = "api/post";

export default class PostGetter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: []
    };
  }

  componentWillMount() {
    axios.get(ENDPOINT).then(res => {
      console.log("postGetter response:");
      console.log(res);
      this.setState({ res });
    });
  }

  render() {
    return (
      <ul>
        {this.state.posts.map(post => (
          <li>{post.slug}</li>
        ))}
      </ul>
    );
  }
}
