import React from "react";
import { Switch, Route, Link } from "react-router-dom";
import PostMaker from "./examples/PostMaker";
import CaptionBox from "./SMPost/CaptionBox";
import SingleLineBox from "./SMPost/SingleLineBox";
import FilterableWrapper from "./examples/FilterableWrapper";
import UserMaker from "./examples/UserMaker";
import Header from "./Header/Header";
import SMPost from "./SMPost/SMPost";

class App extends React.Component {
  render() {
    return (
      <div>
        <Header />
        <nav>
          <Link to="/posts">Posts</Link>
          <Link to="/add">Add</Link>
          <Link to="/posts/2">Post #2</Link>
        </nav>
        <div>
          <Switch>
            <Route exact path="/posts" component={FilterableWrapper} />
            <Route path="/posts/:post_id" component={SMPost} />
            <Route path="/add" component={PostMaker} />
          </Switch>
        </div>
      </div>
    );
  }
}

export default App;
