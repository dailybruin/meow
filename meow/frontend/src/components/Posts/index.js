import React from "react";
import { connect } from "react-redux";
import { Table } from "antd";

import { loadPosts } from "../../actions/post";

const utc = "UTC";

const timeOptions = {
  hour: "numeric",
  minute: "numeric",
  hour12: true
};

const columns = [
  {
    key: "section",
    title: "section",
    dataIndex: "section",
    className: "section",
    sortDirections: ["ascend", "descend"],
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
    render: (text, record) =>
      new Date(`${record.pub_time} ${utc}`).toLocaleString("en-US", timeOptions)
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

/**
 * For testing only
 */
const posts = [
  {
    id: 1,
    section: "online",
    slug: "1.1.1 is also really long",
    post_twitter: "hi this is a really long message to see how it works",
    post_facebook: "btw, this is also a really long message",
    pub_time: "2011-12-30 01:00:00",
    pub_ready_copy: 1,
    pub_ready_online: 1,
    sent: 1,
    sending: 0,
    sent_error: 1
  },
  {
    id: 2,
    section: "id: 2",
    slug: "1.2.1",
    post_twitter: "bi",
    post_facebook: "zye",
    pub_time: "2011-12-30 01:30:00",
    pub_ready_copy: 1,
    pub_ready_online: 0,
    sent: 0,
    sending: 0,
    sent_error: 0
  },
  {
    id: 3,
    section: "id: 3",
    slug: "1.2.1",
    post_twitter: "bi",
    post_facebook: "zye",
    pub_time: "2011-12-30 00:30:00",
    pub_ready_copy: 1,
    pub_ready_online: 1,
    sent: 0,
    sending: 1,
    sent_error: 0
  },
  {
    id: 4,
    section: "id: 4",
    slug: "football.2018",
    post_twitter: "twitter post",
    post_facebook: "facebook post",
    pub_time: "2011-12-30 00:03:30",
    pub_ready_copy: 1,
    pub_ready_online: 1,
    sent: 0,
    sending: 0,
    sent_error: 0
  },
  {
    id: 5,
    section: "id: 5",
    slug: "football.2018",
    post_twitter: "twitter post",
    post_facebook: "facebook post",
    pub_time: "2011-12-30 00:00:10",
    pub_ready_copy: 1,
    pub_ready_online: 1,
    sent: 1,
    sending: 0,
    sent_error: 0
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
        {/* <Table dataSource={this.state.data} columns={columns} /> */}
        <Table
          rowKey="id"
          dataSource={posts}
          columns={columns}
          rowClassName={record => {
            if (record.sent_error) return "sent-error";
            if (record.sending) return "sending";
            if (record.pub_ready_copy && record.pub_ready_online && record.sent) return "sent";
            if (record.pub_ready_online) return "ready-to-post";
            return "draft";
          }}
        />
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
