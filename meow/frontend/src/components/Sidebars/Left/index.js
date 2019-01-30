import React from "react";
import { withRouter } from "react-router-dom";
import { Layout } from "antd";
import LeftSidebarAdd from "./Add";

const { Sider } = Layout;

class LeftSidebar extends React.Component {
  render() {
    const { location } = this.props;

    return (
      <Sider
        width="20vw"
        theme="light"
        style={{
          backgroundColor: "#1A9AE0",
          textAlign: "center"
        }}
      >
        <h2>You are at {location.pathname}</h2>
        {location.pathname === "/add" ? <LeftSidebarAdd /> : null}
      </Sider>
    );
  }
}

export default withRouter(LeftSidebar);
