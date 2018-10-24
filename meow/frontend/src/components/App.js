import React from "react";
import { Switch, Route, Link } from "react-router-dom";
import PostMaker from "./examples/PostMaker";
import CaptionBox from "./SMPost/CaptionBox";
import SingleLineBox from "./SMPost/SingleLineBox";
import Filterable from "./examples/Filterable";
import Sidebar from './Sidebar/Sidebar';

class App extends React.Component {
  render() {
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
            <Route path="/" component={Filterable} />
          </Switch>
        </div>
      </div>
    );
  }
}

export default App;
