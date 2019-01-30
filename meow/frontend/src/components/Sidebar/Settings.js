import React from "react";
import { NavLink } from "react-router-dom";
import { Calendar, TimePicker, Button, Menu } from "antd";
import "./Settings.css";

const Setting = ({ name, link }) => (
  <React.Fragment>
    <Menu.Item key={link}>
      <NavLink to={`/settings${link}`}>
        <div
          style={{
            width: "100%",
            height: "5vh",
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "center",
            paddingLeft: "1.4em"
          }}
        >
          <h1
            style={{
              marginBottom: 0,
              color: "white"
            }}
          >
            {name}
          </h1>
        </div>
      </NavLink>
    </Menu.Item>
  </React.Fragment>
);

class SidebarSettings extends React.Component {
  settings = [
    {
      name: "sections",
      link: "/sections"
    },
    {
      name: "permissions",
      link: "/perms"
    }
  ];

  render() {
    return (
      <Menu
        id="meow-settings"
        style={{
          backgroundColor: "#1A9AE0"
        }}
        mode="inline"
        defaultSelectedKeys={["/"]}
        selectedKeys={[location.pathname.substring(9)]}
      >
        {this.settings.map(x => (
          <Menu.Item key={x.link}>
            <NavLink to={`/settings${x.link}`}>
              <div
                style={{
                  width: "100%",
                  height: "5vh",
                  display: "flex",
                  justifyContent: "flex-start",
                  alignItems: "center",
                  paddingLeft: "1.4em"
                }}
              >
                <h1
                  style={{
                    marginBottom: 0,
                    color: "white"
                  }}
                >
                  {x.name}
                </h1>
              </div>
            </NavLink>
          </Menu.Item>
        ))}
      </Menu>
    );
  }
}

export default SidebarSettings;
