import React from "react";
import { Layout } from "antd";

const { Sider } = Layout;

const Sidebar = ({ children }) => (
  <Sider
    width="20vw"
    theme="light"
    style={{
      backgroundColor: "#1A9AE0"
    }}
  >
    {children}
  </Sider>
);

export default Sidebar;
