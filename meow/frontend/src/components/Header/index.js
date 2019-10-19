import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { Button } from "antd";
import "./index.css";
import SettingsButton from "./SettingsButton";
import config from "../../config";

const options = { month: "long", day: "2-digit", hour: "2-digit", minute: "2-digit" };

class Header extends Component {
  state = {
    time: new Date().toLocaleString("en-US", options),
    showNewmeow: !(
      this.props.location.pathname === "/add" ||
      this.props.location.pathname.substring(0, 5) === "/edit"
    )
  };

  componentDidMount() {
    setInterval(() => {
      this.setState({
        time: new Date().toLocaleString("en-US", options)
      });
    }, 1000);
  }

  newmeow = () => {
    let passedDate = this.props.location.search;
    this.props.history.push({
      pathname: "/add",
      search: passedDate && passedDate.length > 1 ? passedDate.substring(1, passedDate.length) : "" //substr strip "?"
    });
  };

  toHome = () => {
    if (this.props.location.pathname !== "/" || this.props.location.search) {
      this.props.history.push("/");
    }
  };

  toMe = () => {
    this.props.history.push("/me");
  };

  render() {
    return (
      <div
        className="meow-header"
        style={{
          backgroundColor: `#${this.props.theme.primary}`,
          height: "13vh",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          paddingLeft: `${this.props.device === config.MOBILE ? "1em" : "3em"}`,
          paddingRight: `${this.props.device === config.MOBILE ? "1em" : "3em"}`,
          color: `#${this.props.theme.primary_font_color}`
        }}
      >
        <h1 onClick={this.toHome} style={{ fontSize: "3em", cursor: "pointer" }}>
          meow
        </h1>
        {this.props.device === config.MOBILE ? null : <h2>today: {this.state.time}</h2>}
        {this.state.showNewmeow ? (
          <div>
            <span onClick={this.toMe} style={{ fontSize: "1.3em", cursor: "pointer" }}>
              Hi there, {this.props.firstName}!
            </span>
            <SettingsButton />
            <Button
              style={{
                marginLeft: "0.6em",
                backgroundColor: "#ffe600",
                color: "black",
                borderRadius: "20px",
                border: "none",
                boxShadow: "0 4px 4px rgba(0,0,0,0.5)",
                fontSize: "1.4em"
              }}
              type="primary"
              size="large"
              onClick={this.newmeow}
            >
              new meow
            </Button>
          </div>
        ) : null}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  username: state.default.user.username,
  firstName: state.default.user.firstName,
  theme: state.default.user.theme,
  device: state.default.mobile.device
});

export default withRouter(connect(mapStateToProps)(Header));
