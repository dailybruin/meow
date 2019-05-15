import React from "react";
import { Button, Table, Popconfirm } from "antd";
import moment from "moment";

import { getHistory } from "../../services/api";

/**
 * To understand the code in this file, read the documentation
 * for antd Table compoenents. I make sure you know what is a
 * `curried function`.
 */

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

const historyWarning = "Unsaved changes will be discarded. Are you sure to replace history?";

/**
 * HiddenRow is a curried function. `replaceHistory` is a function
 * that changes the state within `EditPost` components. Check the
 * file `EditPost/index.js` for definition of `replaceHistory`.
 * This curried function is used by antd Table component in
 * `HistoryBar` to generate the expandable Rows. Check `HistoryBar`
 * defintion in this file for details.
 * @param {function: (string, string) => void} replaceHistory
 * @param {object} record
 */
const hiddenRow = replaceHistory => record => {
  const { post_facebook: fb, post_twitter: tw } = record;
  const onConfirm = () => replaceHistory(fb, tw);
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
      <Popconfirm title={historyWarning} onConfirm={onConfirm} okText="Replace!" cancelText="No!">
        <Button type="danger"> Revert History </Button>
      </Popconfirm>
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
    const { replaceWithHistory } = this.props;

    return (
      <Table
        columns={columns}
        dataSource={data}
        expandedRowRender={hiddenRow(replaceWithHistory)}
      />
    );
  }
}

export default HistoryBar;
