import React from "react";
import { withRouter } from "react-router-dom";
import { Layout } from "antd";
import RightSidebarAdd from "./Add";

const { Sider } = Layout;

class RightSidebar extends React.Component {
  render() {
    const { location } = this.props;

    return (
      <Sider theme="light" style={{ backgroundColor: "#1A9AE0" }}>
        {location.pathname === "/add" ? <RightSidebarAdd /> : null}
      </Sider>
    );
  }
}

export default withRouter(RightSidebar);
