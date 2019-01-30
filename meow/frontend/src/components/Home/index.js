import React from "react";
import { Route, Switch } from "react-router-dom";
import { withRouter } from "react-router-dom";
import { Layout } from "antd";

import LeftSidebar from "../Sidebars/Left";
import RightSidebar from "../Sidebars/Right";
import Header from "../Header";
import Posts from "../Posts";
import EditPost from "../EditPost";

const { Content } = Layout;

const PrettyPadding = ({ children }) => (
  <div style={{ margin: "24px 16px 0", overflow: "initial" }}>{children}</div>
);
const PaddedPosts = () => (
  <PrettyPadding>
    <Posts />
  </PrettyPadding>
);

class Home extends React.Component {
  render() {
    const { location } = this.props;

    const contentStyles =
      location.pathname === "/add"
        ? { position: "relative", transform: "translateY(-30px)" }
        : { backgroundColor: "white" };

    return (
      <Layout
        style={{
          minHeight: "100vh"
        }}
      >
        <Header />
        <Layout>
          <LeftSidebar />
          <Content style={contentStyles}>
            <Switch>
              <Route exact path="/" component={PaddedPosts} />
              <Route exact path="/add" component={EditPost} />
            </Switch>
          </Content>
        </Layout>
      </Layout>
    );
  }
}

export default withRouter(Home);
