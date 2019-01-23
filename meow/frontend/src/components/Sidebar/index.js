import React from "react";
import { withRouter, NavLink } from "react-router-dom";

import { Layout, Menu, Icon, Row, Col, Slider, Collapse, DatePicker, Checkbox } from "antd";
import "../scss/components/_sidebar.scss";
import Time from "./Time";

const { Sider } = Layout;

function callback(key) {
  console.log(key);
}

function pickDate(date, dateString) {
  console.log(date, dateString);
}

function checkBox(e) {
  console.log(`checked = ${e.target.checked}`);
}

const Panel = Collapse.Panel;

class Sidebar extends React.Component {
  render() {
    const { location } = this.props;
    return (
      <Sider theme="light" style={{ minHeight: "100vh" }}>
        <div className="logo">
          <h1>meow</h1>
        </div>
        <h2>Content here</h2>
        <Collapse defaultActiveKey={["1"]} onChange={callback}>
          <Panel header="posts from" key="1">
            <DatePicker onChange={pickDate} />
          </Panel>
          <Panel header="section" key="2">
            <Checkbox onChange={checkBox}>sports</Checkbox>
            <Checkbox onChange={checkBox}>news</Checkbox>
            <Checkbox onChange={checkBox}>opinion</Checkbox>
          </Panel>
          <Panel header="post time" key="3">
            <Time />
          </Panel>
          <Panel header="status" key="4">
            <Checkbox onChange={checkBox}>ready to post</Checkbox>
            <Checkbox onChange={checkBox}>draft</Checkbox>
            <Checkbox onChange={checkBox}>sent</Checkbox>
          </Panel>
        </Collapse>
      </Sider>
    );
  }
}

export default withRouter(Sidebar);
