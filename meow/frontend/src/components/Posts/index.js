import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { Layout, Collapse } from "antd";

import PostSidebar from "./Sidebar";
import PostContent from "./Content";
import Sidebar from "../Sidebar";
import "./styles.css";
import config from "../../config";

import { loadPosts } from "../../actions/post";

const { Content } = Layout;
const { Panel } = Collapse;

const dateMatcher = /\?date=(\d{4})\-(\d{2})\-(\d{2})/;

let dataStore;
class Posts extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      data: [],
      date: null,
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
    let results = dataStore;

    const { time, status, section } = this.state.query;

    if (time || status.length || section.length) {
      results = results.filter(
        x =>
          (time ? x.pub_time > time : true) &&
          (status.length && status.includes("READY") ? x.pub_ready_online : true) &&
          (status.length && status.includes("DRAFT")
            ? !(x.pub_ready_online || x.pub_ready_copy)
            : true) &&
          (status.length && status.includes("SENT") ? x.sent : true) &&
          (section.length ? section.includes(x.section) : true)
      );
    }

    const { searchTerm } = this.props;
    if (searchTerm && searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      results = results.filter(post => {
        const slug = (post.slug || "").toLowerCase();
        return slug.includes(term);
      });
    }

    return results;
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
        {this.props.device === config.MOBILE ? (
          <Collapse expandIconPosition="right">
            <Panel className="mobilePanel" header="filter" key="1">
              <PostSidebar editParent={this.queryChanged} {...this.state} />
            </Panel>
          </Collapse>
        ) : (
          <Sidebar>
            <PostSidebar editParent={this.queryChanged} {...this.state} />
          </Sidebar>
        )}
        <Content>
          <PostContent data={filteredData} />
        </Content>
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => ({
  device: state.default.mobile.device,
  searchTerm: state.default.post.searchTerm
});

const mapDispatchToProps = {
  loadPosts: YMD => loadPosts(YMD)
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Posts)
);
