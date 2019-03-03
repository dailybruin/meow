import React from "react";
import { Route, Switch } from "react-router-dom";
import { withRouter } from "react-router-dom";
import { Layout } from "antd";

import Header from "../Header";
import Posts from "../Posts";
import EditPost from "../EditPost";
import Sections from "../Settings/Sections";
import Permissions from "../Settings/Permissions";
import UserProfile from "../UserProfile";
import { OnlineRedir } from "../../services/auth";

const PrettyPadding = ({ children }) => (
  <div style={{ margin: "24px 16px 0", overflow: "initial" }}>{children}</div>
);
const PrettyPermissions = () => (
  <PrettyPadding>
    <Permissions />
  </PrettyPadding>
);
const PrettyUserProfile = () => (
  <PrettyPadding>
    <UserProfile />
  </PrettyPadding>
);

class Home extends React.Component {
  render() {
    return (
      <Layout
        style={{
          minHeight: "100vh"
        }}
      >
        <Header />
        <Layout>
          <Switch>
            <Route exact path="/" component={Posts} />
            <Route path="/add" component={EditPost} />
            <Route path="/edit/:postId" component={EditPost} />

            <Route path="/settings/sections" component={OnlineRedir(Sections)} />
            <Route path="/settings/permissions" component={OnlineRedir(PrettyPermissions)} />
            <Route path="/profile/:username" component={PrettyUserProfile} />
            <Route path="/me" component={PrettyUserProfile} />
          </Switch>
        </Layout>
      </Layout>
    );
  }
}

export default withRouter(Home);
