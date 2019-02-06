import React from "react";
import { Route, Switch } from "react-router-dom";
import { withRouter } from "react-router-dom";
import { Layout } from "antd";

import Sidebar from "../Sidebar";
import Header from "../Header";
import Posts from "../Posts";
import EditPost from "../EditPost";
import Sections from "../Settings/Sections";
import Permissions from "../Settings/Permissions";
import { OnlineRedir } from "../../services/auth";

const { Content } = Layout;

const PrettyPadding = ({ children }) => (
  <div style={{ margin: "24px 16px 0", overflow: "initial" }}>{children}</div>
);
const PaddedPosts = () => (
  <PrettyPadding>
    <Posts />
  </PrettyPadding>
);
const PrettyPermissions = () => (
  <PrettyPadding>
    <Permissions />
  </PrettyPadding>
);

class Home extends React.Component {
  render() {
    const { location } = this.props;

    const contentStyles =
      location.pathname === "/add" || location.pathname.substring(0, 5) === "/edit"
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
          <Sidebar />
          <Content style={contentStyles}>
            <Switch>
              <Route exact path="/" component={PaddedPosts} />
              <Route path="/add" component={EditPost} />
              <Route path="/edit/:postId" component={EditPost} />
              <Route path="/settings/sections" component={OnlineRedir(Sections)} />
              <Route path="/settings/permissions" component={OnlineRedir(PrettyPermissions)} />
            </Switch>
          </Content>
        </Layout>
      </Layout>
    );
  }
}

export default withRouter(Home);
