import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { Divider, Button } from "antd";

import { login } from "../../actions/user";

const AUTH_URL = "http://localhost:5000/api/v1/auth/login/meow/";

class Login extends React.Component {
  componentDidMount() {
    this.props.login().then(() => {
      if (this.props.isAuthenticated) {
        console.log("RES LOGIN");
        this.props.history.push("/");
      }
    });
  }

  render() {
    let img_index = Math.floor(10 * Math.random() + 1);
    let img_extension = img_index == 5 ? "png" : "jpg";
    let img_url = `/static/src/assets/cats/${img_index}.${img_extension}`;

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
            width: "80%",
            maxWidth: "400px",
            marginTop: "10%",
            textAlign: "center",
            height: "fit-content",
            padding: "1em",
            background: "rgba(255, 255, 255, 0.5)",
            borderRadius: "8px"
          }}
        >
          <Divider>
            <h1>meow</h1>
          </Divider>
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
