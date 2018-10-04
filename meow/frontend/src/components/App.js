import React from "react";
import PostMaker from "./examples/PostMaker";
import CaptionBox from "./SMPost/CaptionBox";
import SingleLineBox from "./SMPost/SingleLineBox";
import PostGetter from "./examples/PostGetter";

class App extends React.Component {
  render() {
    return (
      <div>
        <PostGetter />
        <SingleLineBox type="slug" />
        <SingleLineBox type="url" />
        <CaptionBox type="fb" />
        <CaptionBox type="twitter" />
        <PostMaker />
      </div>
    );
  }
}

export default App;
