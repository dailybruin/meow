import React from "react";
import "./style.css";

function NotFound(props) {
  return (
    <div className="not-found-body">
      <h1> 404 </h1>
      <h2> We couldn't find your page... </h2>
      <h2> but we found you this: </h2>
      <iframe
        width="560"
        height="315"
        src="https://www.youtube.com/embed/yJ5YHdt2GIM"
        frameborder="0"
        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen
      />
    </div>
  );
}

export default NotFound;
