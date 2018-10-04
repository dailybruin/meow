import React from "react";
import PropTypes from "prop-types";

export default class CaptionBox extends React.Component {
  constructor(props) {
    super(props);
  }

  renderFB = () => {
    return (
      <div>
        <label htmlFor="fb_post">Facebook Post</label>
        <textarea type="text" name="fb_post" id="fb_post" />
      </div>
    );
  };

  renderTwitter = () => {
    return (
      <div>
        <label htmlFor="tweet">Tweet</label>
        <textarea type="text" name="tweet" id="tweet" />
      </div>
    );
  };

  render() {
    return this.props.type.toLowerCase() === "fb"
      ? this.renderFB()
      : this.renderTwitter();
  }
}

CaptionBox.propTypes = {
  type: PropTypes.string.isRequired
};
