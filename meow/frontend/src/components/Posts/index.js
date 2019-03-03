import React from "react";
import { connect } from "react-redux";
import { Layout } from "antd";

import PostSidebar from "./Sidebar";
import PostContent from "./Content";
import Sidebar from "../Sidebar";
import "./styles.css";

import { loadPosts } from "../../actions/post";

const { Content } = Layout;

const PrettyPadding = ({ children }) => (
  <div style={{ margin: "24px 16px 0", overflow: "initial" }}>{children}</div>
);

const options = {
  shouldSort: true,
  threshold: 0.3,
  location: 0,
  distance: 100,
  maxPatternLength: 32,
  minMatchCharLength: 1,
  keys: ["section", "pub_time", "status"]
};

let dataStore;
class Posts extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      data: [],
      query: {}
    };
  }

  componentDidMount() {
    this.props
      .loadPosts()
      .then(data => {
        dataStore = data;
        this.setState({ data });
      })
      .then(() => {
        this.props.loadSections().then(() => {
          sectionStore = this.props.sections;
          this.setState({ loading: false });
        });
      });
  }

  filterPosts = () => {
    const { time, status, section } = this.state.query;

    if (!(time || status || section)) {
      return dataStore;
    }

    let rTime = [];
    if (time) {
      rTime.push(dataStore.filter(x => x.pub_time > time));
    }

    let rStatus = [];
    if (status.length) {
      if (status.includes("READY")) {
        rStatus.push(dataStore.filter(x => x.pub_ready_online));
      }

      if (status.includes("DRAFT")) {
        rStatus.push(dataStore.filter(x => !(x.pub_ready_online || x.pub_ready_copy)));
      }

      if (status.includes("SENT")) {
        rStatus.push(dataStore.filter(x => x.sent));
      }
    }

    let rSection = [];
    if (section.length) {
      rSection.push(dataStore.filter(x => section.includes(x.section)));
    }

    return new Set([...rTime, ...rStatus, ...rSection]);
  };

  queryChanged = newQuery => {
    this.setState({
      query: { ...this.state.query, newQuery }
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
          <PostSidebar {...this.state} />
        </Sidebar>
        <Content>
          <PrettyPadding>
            <PostContent data={filteredData} />
          </PrettyPadding>
        </Content>
        <Content />
      </React.Fragment>
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
