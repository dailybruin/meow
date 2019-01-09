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
        <Menu defaultSelectedKeys={["/"]} selectedKeys={[location.pathname]}>
          <Menu.Item key="/">
            <NavLink to="/">
              <Icon type="coffee" />
              <span className="nav-text">Desk</span>
            </NavLink>
          </Menu.Item>
          <Menu.Item key="/newsroom">
            <NavLink to="/newsroom">
              <Icon type="global" />
              <span className="nav-text">Newsroom</span>
            </NavLink>
          </Menu.Item>
          <Menu.Item key="/calendar">
            <NavLink to="/calendar">
              <Icon type="calendar" />
              <span className="nav-text">Calendar</span>
            </NavLink>
          </Menu.Item>
          <Menu.Item key="/members">
            <NavLink to="/members">
              <Icon type="team" />
              <span className="nav-text">Members</span>
            </NavLink>
          </Menu.Item>
          <Menu.Item key="/settings">
            <NavLink to="/settings">
              <Icon type="setting" />
              <span className="nav-text">Settings</span>
            </NavLink>
          </Menu.Item>
        </Menu>
      </Sider>
    );
  }
}

export default withRouter(Sidebar);
