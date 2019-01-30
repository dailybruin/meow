import React from "react";
import { withRouter } from "react-router-dom";
import { Layout } from "antd";
import LeftSidebarAdd from "./Add";
import LeftSidebarPosts from "./Posts";

const { Sider } = Layout;

class LeftSidebar extends React.Component {
  renderContent() {
    const { location } = this.props;

    if (location.pathname === "/add") {
      return <LeftSidebarAdd />;
    }

    if (location.pathname === "/") {
      return <LeftSidebarPosts />;
    }
    return null;
  }
  render() {
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
        {this.renderContent()}
      </Sider>
    );
  }
}

export default withRouter(LeftSidebar);
