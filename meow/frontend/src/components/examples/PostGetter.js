import React from "react";
import axios from "axios";
import ReactTable from "react-table";

const ENDPOINT = "/api/post/";

export default class PostGetter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: []
    };
  }

  componentDidMount() {
    axios.get(ENDPOINT).then(res => {
      this.setState({ posts: res.data });
    });
  }

  render() {
    const cols = [
      { Header: "Post ID", accessor: "id" },
      { Header: "Slug", accessor: "slug" },
      { Header: "Link", accessor: "story_url" },
      { Header: "Pub Time", accessor: "pub_time" }
    ];

    const posts = this.state.posts;

    return <ReactTable data={posts} columns={cols} />;
  }
}
