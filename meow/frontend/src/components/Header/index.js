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
    showNewmeow: null
  };

  componentDidMount() {
    this.setState({
      showNewmeow: !(
        this.props.location.pathname === "/add" ||
        this.props.location.pathname.substring(0, 5) === "/edit"
      )
    });
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
    let img_d = new Date(),
      img_m = 3,
      img_dd = 1;
    let img_address_modifier = img_d.getMonth() === img_m && img_d.getDate() === img_dd;

    if (img_address_modifier) {
      if (this.props.theme.name != "Scott") {
        this.props.editTheme({
          name: "Scott",
          primary: "1B1813",
          secondary: "614b37",
          primary_font_color: "C48A96",
          secondary_font_color: "C48A96",
          tertiary: "C48A96",
          id: 3
        });
      }
    }

    return (
      <div
        className="meow-header"
        style={{
          backgroundColor: `${this.props.theme.primary}`,
          height: "13vh",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          paddingLeft: `${this.props.device === config.MOBILE ? "1em" : "3em"}`,
          paddingRight: `${this.props.device === config.MOBILE ? "1em" : "3em"}`,
          color: `${this.props.theme.primary_font_color}`
        }}
      >
        <h1
          onClick={this.toHome}
          style={{
            fontSize: "3em",
            cursor: "pointer",
            color: `${this.props.theme.primary_font_color}`
          }}
        >
          {img_address_modifier ? "scott" : "meow"}
        </h1>
        {this.props.device === config.MOBILE ? null : (
          <h2 style={{ color: `${this.props.theme.primary_font_color}` }}>
            today: {this.state.time}
          </h2>
        )}
        {this.state.showNewmeow ? (
          <div>
            <span onClick={this.toMe} style={{ fontSize: "1.3em", cursor: "pointer" }}>
              Hi there, {this.props.firstName}!
            </span>
            <SettingsButton color={this.props.theme.primary_font_color} />
            <Button
              style={{
                marginLeft: "0.6em",
                backgroundColor: `${this.props.theme.tertiary}`,
                color: `black`,
                borderRadius: "20px",
                border: "none",
                boxShadow: "0 4px 4px rgba(0,0,0,0.5)",
                fontSize: "1.4em"
              }}
              type="primary"
              size="large"
              onClick={this.newmeow}
            >
              {img_address_modifier ? "new scott" : "new meow"}
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

const mapDispatchToProps = {
  editTheme: new_theme => dispatch => {
    dispatch({
      type: "THEME_CHANGE",
      payload: {
        theme: new_theme
      }
    });
  }
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Header)
);
