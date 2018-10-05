import React from "react";
import axios from "axios";
import ReactTable from "react-table";

export default class PostGetter extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const cols = [
      { Header: "Post ID", accessor: "id" },
      { Header: "Slug", accessor: "slug" },
      { Header: "Link", accessor: "story_url" },
      { Header: "Pub Time", accessor: "pub_time" }
    ];

    const posts = this.props.posts;

    return <ReactTable data={posts} columns={cols} />;
  }
}
