import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import Fuse from "fuse.js";
import { Table } from "antd";
import moment from "moment";
import "./styles.css";

import { loadPosts } from "../../actions/post";
import { loadSections } from "../../actions/section";

const columns = [
  {
    key: "section",
    title: "section",
    dataIndex: "section",
    className: "section",
    sortDirections: ["ascend", "descend"],
    render: text =>
      text && sectionStore ? sectionStore.find(x => x.id === text).name : "No Section",
    sorter: (a, b) => a.section.localeCompare(b.section)
  },
  {
    key: "slug",
    title: "slug",
    dataIndex: "slug",
    className: "slug",
    sortDirections: ["ascend", "descend"],
    sorter: (a, b) => a.slug.localeCompare(b.slug)
  },
  {
    key: "post_twitter",
    title: "tweet",
    dataIndex: "post_twitter",
    className: "twitter",
    sortDirections: ["ascend", "descend"],
    sorter: (a, b) => a.post_twitter.localeCompare(b.post_twitter)
  },
  {
    key: "post_facebook",
    title: "facebook",
    dataIndex: "post_facebook",
    className: "facebook",
    sortDirections: ["ascend", "descend"],
    sorter: (a, b) => a.post_facebook.localeCompare(b.post_facebook)
  },
  {
    key: "pub_time",
    title: "post time",
    dataIndex: "pub_time",
    className: "pub_time",
    sortDirections: ["ascend", "descend"],
    defaultSortOrder: "descend",
    sorter: (a, b) => new Date(a.pub_time) - new Date(b.pub_time),
    render: text => (text ? moment(text, "HH:mm:ss").format("hh:mm a") : "No Time")
  },
  {
    key: "status",
    title: "status",
    dataIndex: "status",
    className: "status",
    sortDirections: ["ascend", "descend"],
    sorter: (a, b) =>
      b.pub_ready_copy - a.pub_ready_copy ||
      b.pub_ready_online - a.pub_ready_online ||
      b.sent - a.sent ||
      b.sending - a.sending ||
      new Date(b.pub_time) - new Date(a.pub_time) ||
      b.id - a.id,
    render: (text, record) => {
      if (record.sending) return "Sending";
      if (record.pub_ready_copy && record.pub_ready_online && record.sent) return "Sent";
      if (record.pub_ready_online) return "Ready to post";
      return "Draft";
    }
  }
];

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
let sectionStore;
let fuse;
class Posts extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      data: null
    };
  }

  componentDidMount() {
    this.props
      .loadPosts()
      .then(res => {
        fuse = new Fuse(res, options);
        console.log("set fuse");
        dataStore = res;
        this.setState({ data: res });
      })
      .then(() => {
        this.props.loadSections().then(() => {
          sectionStore = this.props.sections;
          this.setState({ loading: false });
        });
      });
  }

  shouldComponentUpdate(nextProps, nextState) {
    console.log(nextState);
    if (nextState.loading || !nextState.data) {
      return null;
    }
    console.log("shouldComponentUpdate");
    console.log(nextProps.query);
    let newData;
    if (nextProps.query.sections.length) {
      // we are filtering based on section
      newData = fuse.search(`"section": ${nextProps.query.sections[0]}`);
    }
    this.setState(
      {
        data: newData
      },
      () => true
    );
  }

  onRow = (record, rowIndex) => {
    return {
      onClick: event => this.props.history.push("/edit/" + record.id)
    };
  };

  render() {
    if (this.state.loading) {
      return null;
    }
    return (
      <React.Fragment>
        <p>{this.props.location.search}</p>
        <Table
          className="post-table"
          rowKey="id"
          dataSource={this.state.data}
          columns={columns}
          onRow={this.onRow}
          rowClassName={record => {
            if (record.sent_error) return "sent-error";
            if (record.sending) return "sending";
            if (record.pub_ready_copy && record.pub_ready_online && record.sent) return "sent";
            if (record.pub_ready_online) return "ready-to-post";
            return "draft";
          }}
        />
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => ({
  sections: state.default.section.sections,
  query: state.default.query
});

const mapDispatchToProps = {
  loadPosts,
  loadSections
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Posts)
);
