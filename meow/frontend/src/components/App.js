import React from "react";
import PostMaker from "./examples/PostMaker";
import CaptionBox from "./SMPost/CaptionBox";
import SingleLineBox from "./SMPost/SingleLineBox";
import FilterableWrapper from "./examples/FilterableWrapper";

class App extends React.Component {
  render() {
    return (
      <div>
        <FilterableWrapper />
        <PostMaker />
      </div>
    );
  }
}

export default App;
