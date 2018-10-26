import React from 'react';
import { Route, Switch, Link } from 'react-router-dom';

import PostMaker from '../examples/PostMaker';
import UserMaker from '../examples/UserMaker';
import Header from '../Header/Header';
import FilterableWrapper from '../examples/FilterableWrapper';
import Sidebar from '../Sidebar/Sidebar';
import SMPost from '../SMPost/SMPost';

export default function Home() {
  return (
    <div>
      <Header />
      <Sidebar />
      <nav>
        <Link to="/posts">Posts</Link>
        <Link to="/add">Add</Link>
        <Link to="/posts/2">Post #2</Link>
        <Link to="/signup">SignUP</Link>
      </nav>
      <div>
        <Switch>
          <Route exact path="/posts" component={FilterableWrapper} />
          <Route path="/posts/:post_id" component={SMPost} />
          <Route path="/add" component={PostMaker} />
          <Route path="/signup" component={UserMaker} />
        </Switch>
      </div>
    </div>
  );
}
