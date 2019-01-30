import React from "react";
import { Route, Switch } from "react-router-dom";
import { Layout } from "antd";

import Sidebar from "../Sidebar";
import Header from "../Header";
import Posts from "../Posts";
import createPosts from "../createPosts";

const { Content } = Layout;

const Home = ({ props }) => (
  <Layout>
    <Sidebar />
    <Layout>
      <Header />
      <Content style={{ margin: "24px 16px 0", overflow: "initial" }}>
        <Switch>
          <Route exact path="/" component={Posts} />
          <Route exact path="/createPosts" component={createPosts} />
        </Switch>
      </Content>
    </Layout>
  </Layout>
);

export default Home;
