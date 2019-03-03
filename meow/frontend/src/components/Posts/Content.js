import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { Table } from "antd";
import moment from "moment";
import "./styles.css";

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

let sectionStore;
class Posts extends React.Component {
  componentDidMount() {
    this.props.loadSections();
    sectionStore = this.props.sections;
  }

  onRow = (record, rowIndex) => {
    return {
      onClick: event => this.props.history.push("/edit/" + record.id)
    };
  };

  render() {
    return (
      <Table
        className="post-table"
        rowKey="id"
        dataSource={this.props.data}
        columns={columns}
        onRowClick={record => this.props.history.push("/edit/" + record.id)}
        rowClassName={record => {
          if (record.sent_error) return "sent-error";
          if (record.sending) return "sending";
          if (record.pub_ready_copy && record.pub_ready_online && record.sent) return "sent";
          if (record.pub_ready_online) return "ready-to-post";
          return "draft";
        }}
      />
    );
  }
}

const mapStateToProps = state => ({
  sections: state.default.section.sections
});

const mapDispatchToProps = {
  loadSections
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Posts)
);
