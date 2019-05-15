import React from "react";
import { Table } from "antd";
import moment from "moment";

import { getHistory } from "../../services/api";

const columns = [
  {
    title: "Time",
    dataIndex: "creation_time",
    key: "creation_time",
    // timeString is in ISO 8601 format
    render: timeString => {
      const dayStr = moment(timeString).fromNow();
      return <p>{dayStr}</p>;
    }
  },
  {
    title: "Editor",
    dataIndex: "last_edit_user",
    key: "last_edit_user",
    render: user => {
      if (!user) return <p>\(Name not Found\)</p>;
      const fullName = `${user.first_name} ${user.last_name}`;
      return <p>{fullName}</p>;
    }
  }
];

const hiddenRow = record => {
  console.log(record);
  const { post_facebook: fb, post_twitter: tw } = record;
  return (
    <React.Fragment>
      <h3>
        <strong>Facebook:</strong>
      </h3>
      <p>{fb}</p>
      <h3>
        <strong>Twitter:</strong>
      </h3>
      <p>{tw}</p>
    </React.Fragment>
  );
};

class HistoryBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: []
    };
  }

  componentDidMount() {
    const { postId } = this.props;
    // if new meow, don't call API.
    if (!postId) return;
    getHistory(postId)
      /**
       * these manual error handling should be removed
       * after we have implementd with a redux erorr state
       */
      .then(({ data, status }) => {
        if (status !== 200) {
          console.error("cannot fetch history from the server");
          console.error(`status code: ${status}`);
        }
        this.setState({ data });
      })
      .catch(err => {
        console.error("Error occured when fetching history from server");
        console.error(err);
      });
  }

  render() {
    const { data } = this.state;

    return <Table columns={columns} dataSource={data} expandedRowRender={hiddenRow} />;
  }
}

export default HistoryBar;
