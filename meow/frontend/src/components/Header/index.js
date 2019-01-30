import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { Layout, Row, Col, Button } from "antd";
import "./index.css";

const { Header: AntdHeader } = Layout;

const options = { month: "long", day: "2-digit", hour: "2-digit", minute: "2-digit" };

class Header extends Component {
  state = {
    time: new Date().toLocaleString("en-US", options)
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

  getTime = () => {
    setInterval(this.getTime, 60000);
  };

  render() {
    return (
      <div
        className="meow-header"
        style={{
          backgroundColor: "#0080C6",
          height: "13vh",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          paddingLeft: "3em",
          paddingRight: "3em"
        }}
      >
        <h1 style={{ fontSize: "3em" }}>meow</h1>
        <h2>today: {this.state.time}</h2>
        {this.props.location.pathname !== "/add" ? (
          <div>
            <span style={{ fontSize: "1.3em" }}>Hi there, {this.props.firstName}!</span>
            <Button
              style={{
                backgroundColor: "white",
                color: "black",
                border: "2px solid black",
                borderRadius: "20px",
                fontSize: "1.4em",
                marginLeft: "1.4em"
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
