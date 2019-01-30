import React from "react";
import { Collapse, DatePicker, Checkbox } from "antd";

const { Panel } = Collapse;

class LeftSidebarPosts extends React.Component {
  render() {
    return (
      <Collapse defaultActiveKey={["1"]}>
        <Panel header="posts from" key="1">
          <DatePicker />
        </Panel>
        <Panel header="section" key="2">
          <Checkbox>sports</Checkbox>
          <Checkbox>news</Checkbox>
          <Checkbox>opinion</Checkbox>
        </Panel>
        <Panel header="post time" key="3">
          {/* <Time /> */}
        </Panel>
        <Panel header="status" key="4">
          <Checkbox>ready to post</Checkbox>
          <Checkbox>draft</Checkbox>
          <Checkbox>sent</Checkbox>
        </Panel>
      </Collapse>
    );
  }
}

export default LeftSidebarPosts;
