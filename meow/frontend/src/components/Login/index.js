import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { Divider, Button } from "antd";

import { login } from "../../actions/user";

const AUTH_URL =
  process.env.NODE_ENV === "production"
    ? "https://meow.dailybruin.com/api/v1/auth/login/meow/"
    : "http://localhost:5000/api/v1/auth/login/meow/";

class Login extends React.Component {
  componentDidMount() {
    this.props.login().then(() => {
      if (this.props.isAuthenticated) {
        this.props.history.push("/");
      }
    });
  }

  render() {
    let img_index = Math.floor(10 * Math.random() + 1);
    let img_extension = img_index == 5 ? "png" : "jpg";
    let img_url = `/static/cats/${img_index}.${img_extension}`;
    let img_d = new Date(),
      img_m = 3,
      img_dd = 1;
    let img_address_modifier = img_d.getMonth() === img_m && img_d.getDate() === img_dd;
    img_url = img_address_modifier ? `/static/other/2.jpg` : img_url;

    return (
      <div
        style={{
          width: "100vw",
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          backgroundImage: `url("${img_url}")`,
          backgroundSize: "cover"
        }}
      >
        <div
          style={{
            left: "10vw",
            bottom: "20vh",
            position: "absolute",
            textAlign: "center",
            height: "fit-content",
            padding: "1em",
            borderRadius: "8px"
          }}
        >
          <h1
            style={{
              fontSize: "5em",
              color: "white"
            }}
          >
            {!img_address_modifier ? "meow" : "scott"}
          </h1>
          <Button href={AUTH_URL} size="large" icon="slack">
            Sign in with Slack
          </Button>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  isAuthenticated: state.default.user.isAuthenticated
});

const mapDispatchToProps = {
  login
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Login)
);
