import React from "react";
import { withRouter } from "react-router-dom";
import { Button, Icon } from "antd";
import { Online } from "../../services/auth";

class SettingsButton extends React.PureComponent {
  toSettings = () => {
    this.props.history.push("/settings/sections");
  };

  render() {
    return (
      <Button
        shape="circle"
        style={{
          margin: "0 0.6em 0 0.6em",
          backgroundColor: "transparent",
          fontSize: "1.4em",
          color: "white",
          border: "transparent"
        }}
        onClick={this.toSettings}
      >
        <Icon theme="filled" type="setting" />
      </Button>
    );
  }
}

export default Online(withRouter(SettingsButton));
