import React from "react";
import { connect } from "react-redux";
import { Route, Switch, withRouter } from "react-router-dom";
import { Layout } from "antd";

import Header from "../Header";
import Posts from "../Posts";
import EditPost from "../EditPost";
import AddPost from "../AddPost";
import Sections from "../Settings/Sections";
import UserProfile from "../UserProfile";
import { OnlineRedir } from "../../services/auth";

import { loadSections } from "../../actions/section";

const PrettyPadding = ({ children }) => (
  <div style={{ margin: "24px 16px 0", overflow: "initial" }}>{children}</div>
);
const PrettySections = () => (
  <PrettyPadding>
    <Sections />
  </PrettyPadding>
);
const PrettyUserProfile = () => (
  <PrettyPadding>
    <UserProfile />
  </PrettyPadding>
);

class Home extends React.Component {
  state = {
    loading: true
  };

  componentDidMount() {
    this.props.loadSections().then(() => this.setState({ loading: false }));
  }

  render() {
    if (this.state.loading) {
      return null;
    }

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
            <Route path="/add" component={AddPost} />
            <Route path="/edit/:postId" component={EditPost} />
            <Route path="/settings/sections" component={OnlineRedir(PrettySections)} />
            <Route path="/profile/:username" component={PrettyUserProfile} />
            <Route path="/me" component={PrettyUserProfile} />
          </Switch>
        </Layout>
      </Layout>
    );
  }
}

const mapDispatchToProps = {
  loadSections
};

export default withRouter(
  connect(
    null,
    mapDispatchToProps
  )(Home)
);
