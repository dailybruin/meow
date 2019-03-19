import React from "react";
import { Layout } from "antd";
import { connect } from "react-redux";

const { Sider } = Layout;

class Sidebar extends React.Component {
  render() {
    return (
      <Sider
        width="20vw"
        theme="light"
        style={{
          backgroundColor: `#${this.props.theme.secondary}`
        }}
      >
        {this.props.children}
      </Sider>
    );
  }
}

const mapStateToProps = state => ({
  theme: state.default.user.theme
});

export default connect(mapStateToProps)(Sidebar);
