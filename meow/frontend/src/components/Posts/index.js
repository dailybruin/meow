import React from "react";
import { connect } from "react-redux";
import { Table, TreeSelect, Input } from "antd";

import { loadPosts } from "../../actions/post";

const columns = [
  {
    title: "Username",
    dataIndex: "username",
    key: "username"
  },
  {
    title: "First Name",
    dataIndex: "first_name",
    key: "first_name"
  },
  {
    title: "Last Name",
    dataIndex: "last_name",
    key: "last_name"
  }
];

let dataStore;
class Posts extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null
    };
  }

  componentDidMount() {
    this.props.loadPosts().then(res => {
      console.log(res.data);
      dataStore = res.data;
      this.setState({ data: dataStore });
    });
  }

  render() {
    return (
      <div>
        <h2>Posts</h2>
        <Table dataSource={this.state.data} columns={columns} />
      </div>
    );
  }
}

const mapDispatchToProps = {
  loadPosts
};

export default connect(
  null,
  mapDispatchToProps
)(Posts);
