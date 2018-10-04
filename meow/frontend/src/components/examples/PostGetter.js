import React from "react";
import axios from "axios";

const ENDPOINT = "api/post";

const Row = ({ id, slug, story_url, pub_date }) => (
  <div
    className="row"
    style={{
      display: "flex"
    }}
  >
    <div style={{ flex: "1" }}>{id}</div>
    <div style={{ flex: "1" }}>{slug}</div>
    <div style={{ flex: "1" }}>{story_url}</div>
    <div style={{ flex: "1" }}>{pub_date}</div>
  </div>
);

export default class PostGetter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: []
    };
    this.compareBy = this.compareBy.bind(this);
    this.sortBy = this.sortBy.bind(this);
  }

  componentWillMount() {
    axios.get(ENDPOINT).then(res => {
      console.log("postGetter response:");
      console.log(res.data);
      this.setState({ posts: res.data });
    });
  }

  compareBy(key) {
    return function(a, b) {
      if (a[key] < b[key]) return -1;
      if (a[key] > b[key]) return 1;
      return 0;
    };
  }

  sortBy(key) {
    let arrayCopy = [...this.state.posts];
    arrayCopy.sort(this.compareBy(key));
    this.setState({ posts: arrayCopy });
  }

  render() {
    const rows = this.state.posts.map(rowData => <Row {...rowData} />);

    return (
      <div
        className="table"
        style={{
          display: "flex",
          flexDirection: "column"
        }}
      >
        <div
          className="header"
          style={{
            display: "flex"
          }}
        >
          <div style={{ flex: "1" }} onClick={() => this.sortBy("id")}>
            id
          </div>
          <div style={{ flex: "1" }} onClick={() => this.sortBy("slug")}>
            slug
          </div>
          <div style={{ flex: "1" }} onClick={() => this.sortBy("story_url")}>
            story_url
          </div>
          <div style={{ flex: "1" }} onClick={() => this.sortBy("pub_time")}>
            pub_date
          </div>
        </div>
        <div className="body">{rows}</div>
      </div>
    );
  }
}
