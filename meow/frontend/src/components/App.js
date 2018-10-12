import React from "react";
import { Route, Link } from "react-router-dom";
import PostMaker from "./examples/PostMaker";
import CaptionBox from "./SMPost/CaptionBox";
import SingleLineBox from "./SMPost/SingleLineBox";
import FilterableWrapper from "./examples/FilterableWrapper";
import UserMaker from "./examples/UserMaker";
import Header from "./Header/Header";

class App extends React.Component {
  render() {
    return (
      <div>
        <Header />
        <nav>
          <Link to="/posts">Posts</Link>
          <Link to="/add">Add</Link>
        </nav>
        <div>
          <Route path="/posts" component={FilterableWrapper} />
          <Route path="/add" component={PostMaker} />
        </div>
      </div>
    );
  }
}

export default App;
