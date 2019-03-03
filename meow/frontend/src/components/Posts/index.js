import React from "react";
import { connect } from "react-redux";
import { Layout } from "antd";

import PostSidebar from "./Sidebar";
import PostContent from "./Content";
import Sidebar from "../Sidebar";
import "./styles.css";

import { loadPosts } from "../../actions/post";
import { loadSections } from "../../actions/section";

const { Content } = Layout;

const PrettyPadding = ({ children }) => (
  <div style={{ margin: "24px 16px 0", overflow: "initial" }}>{children}</div>
);

let dataStore;
class Posts extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      data: [],
      query: {
        time: null,
        status: [],
        section: []
      }
    };
  }

  componentDidMount() {
    this.props
      .loadPosts()
      .then(data => {
        dataStore = data;
        this.setState({ data, loading: false });
      })
      .then(() => {
        this.props.loadSections().then(() => {
          this.setState({ loading: false });
        });
      });
  }

  filterPosts = () => {
    const { time, status, section } = this.state.query;
    console.log("THIS STATE QUERY");
    console.log(this.state.query);
    console.log(dataStore);
    if (!(time || status.length || section.length)) {
      return dataStore;
    }

    let rTime = [];
    if (time) {
      rTime = dataStore.filter(x => x.pub_time > time);
    }

    let rStatus = [];
    if (status.length) {
      let readyPosts = [];
      if (status.includes("READY")) {
        readyPosts = dataStore.filter(x => x.pub_ready_online);
        console.log("ready posts");
        console.log(readyPosts);
      }

      let draftPosts = [];
      if (status.includes("DRAFT")) {
        console.log("draft");
        draftPosts = dataStore.filter(x => !(x.pub_ready_online || x.pub_ready_copy));
        console.log(draftPosts);
      }

      let sentPosts = [];
      if (status.includes("SENT")) {
        sentPosts = dataStore.filter(x => x.sent);
      }

      rStatus = [...new Set([...readyPosts, ...draftPosts, ...sentPosts])];
    }

    let rSection = [];
    if (section.length) {
      rSection = dataStore.filter(x => section.includes(x.section));
    }
    console.log("RSECTION");
    console.log(rSection);

    return [...new Set([...rTime, ...rStatus, ...rSection])];
  };

  queryChanged = change => {
    this.setState(
      {
        query: {
          ...this.state.query,
          ...change
        }
      },
      () => console.log(this.state.query)
    );
  };

  render() {
    if (this.state.loading) {
      return null;
    }

    const filteredData = this.filterPosts();
    console.log("FILTERED DATA");
    console.log(filteredData);
    return (
      <React.Fragment>
        <Sidebar>
          <PostSidebar
            editParent={this.queryChanged}
            section={this.props.sections}
            {...this.state}
          />
        </Sidebar>
        <Content>
          <PrettyPadding>
            <PostContent data={filteredData} />
          </PrettyPadding>
        </Content>
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => ({
  sections: state.default.section.sections
});

const mapDispatchToProps = {
  loadPosts,
  loadSections
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Posts);
