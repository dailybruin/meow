import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { Button } from "antd";
import "./index.css";
import SettingsButton from "./SettingsButton";

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
    this.props.history.push("/add");
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
          backgroundColor: "#2a73b2",
          height: "13vh",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          paddingLeft: "3em",
          paddingRight: "3em"
        }}
      >
        <h1 onClick={this.toHome} style={{ fontSize: "3em", cursor: "pointer" }}>
          meow
        </h1>
        <h2>today: {this.state.time}</h2>
        {this.state.showNewmeow ? (
          <div>
            <span onClick={this.toMe} style={{ fontSize: "1.3em", cursor: "pointer" }}>
              Hi there, {this.props.firstName}!
            </span>
            <SettingsButton />
            <Button
              style={{
                marginLeft: "0.6em",
                backgroundColor: "white",
                color: "black",
                border: "2px solid black",
                borderRadius: "20px",
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
  firstName: state.default.user.firstName
});

export default withRouter(connect(mapStateToProps)(Header));
