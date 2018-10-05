import React from "react";
import axios from "axios";
import PostTable from "./PostTable";

const ENDPOINT = "/api/post/";

export default class PostGetter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: [],
      filteredPosts: [],
      bigPostsOnly: this.props.bigPostsOnly
    };
  }

  componentWillMount() {
    axios.get(ENDPOINT).then(res => {
      this.setState({ posts: res.data, filteredPosts: res.data });
    });
  }

  handleBigPostChange = e => {
    let filteredPosts = this.state.bigPostsOnly
      ? this.state.posts
      : this.state.posts.filter(post => {
          return post.id > 2;
        });
    console.log(filteredPosts);
    this.setState({
      bigPostsOnly: !this.state.bigPostsOnly,
      filteredPosts: filteredPosts
    });
  };

  render() {
    return (
      <div>
        <p>
          <input
            type="checkbox"
            checked={this.state.bigPostsOnly}
            onChange={this.handleBigPostChange}
          />{" "}
          Only show posts with id > 2
        </p>
        <PostTable posts={this.state.filteredPosts} />
      </div>
    );
  }
}
