import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { Layout } from "antd";

import PostSidebar from "./Sidebar";
import PostContent from "./Content";
import Sidebar from "../Sidebar";
import "./styles.css";

import { loadPosts } from "../../actions/post";

const { Content } = Layout;

const dateMatcher = /\?date=(\d{4})\-(\d{2})\-(\d{2})/;

let dataStore;
class Posts extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      data: [],
      date: "",
      query: {
        time: null,
        status: [],
        section: []
      }
    };
  }

  componentDidMount() {
    let YMDArray = dateMatcher.exec(this.props.location.search);
    let YMD = {};
    if (YMDArray) {
      YMDArray.shift();
      YMD = {
        year: YMDArray[0],
        month: YMDArray[1],
        day: YMDArray[2]
      };
    } else {
      const today = new Date();
      YMD = {
        year: today.getFullYear(),
        month: today.getMonth() + 1,
        day: today.getDate()
      };
    }

    this.props.loadPosts(YMD).then(data => {
      dataStore = data;
      const date = `${YMD.year}-${YMD.month}-${YMD.day}`;
      this.setState({ data, date, loading: false });
    });
  }

  filterPosts = () => {
    const { time, status, section } = this.state.query;

    if (!(time || status.length || section.length)) {
      return dataStore;
    }

    return dataStore.filter(
      x =>
        (time ? x.pub_time > time : true) &&
        (status.length && status.includes("READY") ? x.pub_ready_online : true) &&
        (status.length && status.includes("DRAFT")
          ? !(x.pub_ready_online || x.pub_ready_copy)
          : true) &&
        (status.length && status.includes("SENT") ? x.sent : true) &&
        (section.length ? section.includes(x.section) : true)
    );
  };

  queryChanged = change => {
    this.setState({
      query: {
        ...this.state.query,
        ...change
      }
    });
  };

  render() {
    if (this.state.loading) {
      return null;
    }

    const filteredData = this.filterPosts();

    return (
      <React.Fragment>
        <Sidebar>
          <PostSidebar editParent={this.queryChanged} {...this.state} />
        </Sidebar>
        <Content>
          <PostContent data={filteredData} />
        </Content>
      </React.Fragment>
    );
  }
}

const mapDispatchToProps = {
  loadPosts: YMD => loadPosts(YMD)
};

export default withRouter(
  connect(
    null,
    mapDispatchToProps
  )(Posts)
);
