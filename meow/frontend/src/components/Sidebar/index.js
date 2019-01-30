import React from "react";
import { withRouter } from "react-router-dom";
import { Layout } from "antd";
import LeftSidebarAdd from "./Add";
import LeftSidebarPosts from "./Posts";
import SidebarSettings from "./Settings";

const { Sider } = Layout;

class Sidebar extends React.Component {
  renderContent() {
    const { location } = this.props;

    if (location.pathname === "/add" || location.pathname.substring(0, 5) === "/edit") {
      return <LeftSidebarAdd />;
    }

    if (location.pathname === "/") {
      return <LeftSidebarPosts />;
    }

    if (location.pathname.substring(0, 9) === "/settings") {
      return <SidebarSettings />;
    }

    return null;
  }

  render() {
    return (
      <Sider
        width="20vw"
        theme="light"
        style={{
          backgroundColor: "#1A9AE0"
        }}
      >
        {this.renderContent()}
      </Sider>
    );
  }
}

export default withRouter(Sidebar);
