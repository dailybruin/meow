import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { Button } from "antd";

import { login } from "../../actions/user";

const ORIGIN =
  process.env.NODE_ENV === "production"
    ? "https://meow.dailybruin.com"
    : typeof window !== "undefined"
    ? window.location.origin
    : "http://localhost:5000";

const AUTH_URL = `${ORIGIN}/api/v1/auth/login/meow/`;

class Login extends React.Component {
  componentDidMount() {
    this.props.login().then(() => {
      if (this.props.isAuthenticated) {
        this.props.history.push("/");
      }
    });
  }

  render() {
    const imgIndex = Math.floor(10 * Math.random() + 1);
    const imgExtension = imgIndex === 5 ? "png" : "jpg";
    const imgUrl = `/static/cats/${imgIndex}.${imgExtension}`;

    return (
      <div
        style={{
          width: "100vw",
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          backgroundImage: `url("${imgUrl}")`,
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
            {"meow"}
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
