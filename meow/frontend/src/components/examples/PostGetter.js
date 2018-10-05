import React from "react";
import axios from "axios";
import FilterableTable from "react-filterable-table";

const ENDPOINT = "/api/post/";

export default class PostGetter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: []
    };
  }

  componentWillMount() {
    axios.get(ENDPOINT).then(res => {
      this.setState({ posts: res.data });
    });
  }

  render() {
    const fields = [
      {
        name: "id",
        displayName: "Post ID",
        inputFilterable: true,
        sortable: true
      },
      {
        name: "slug",
        displayName: "Slug",
        inputFilterable: true,
        exactFilterable: true,
        sortable: true
      },
      {
        name: "story_url",
        displayName: "Link",
        inputFilterable: true,
        exactFilterable: true,
        sortable: true
      },
      {
        name: "pub_time",
        displayName: "Time",
        inputFilterable: true,
        exactFilterable: true,
        sortable: true
      }
    ];

    return (
      <FilterableTable
        namespace="smposts"
        initialSort="id"
        data={this.state.posts}
        fields={fields}
      />
    );
  }
}
