import React from "react";
import { withRouter, NavLink } from "react-router-dom";

import { Layout, Menu, Icon } from "antd";
const { Sider } = Layout;

class Sidebar extends React.Component {
  render() {
    const { location } = this.props;

    return (
      <Sider theme="light" style={{ minHeight: "100vh" }}>
        <div className="logo">
          <h1>meow</h1>
        </div>
        <h2>Content here</h2>
      </Sider>
    );
  }
}

export default withRouter(Sidebar);
