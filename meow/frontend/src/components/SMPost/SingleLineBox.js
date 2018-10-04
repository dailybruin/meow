import React from "react";
import PropTypes from "prop-types";

export default class SingleLineBox extends React.Component {
  constructor(props) {
    super(props);
  }

  renderSlug = () => {
    return (
      <div>
        <label htmlFor="slug">Slug</label>
        <input type="text" name="slug" id="slug" />
      </div>
    );
  };

  renderUrl = () => {
    return (
      <div>
        <label htmlFor="url">Article Link</label>
        <input type="url" name="url" id="url" />
      </div>
    );
  };

  render() {
    return this.props.type.toLowerCase() === "slug"
      ? this.renderSlug()
      : this.renderUrl();
  }
}

SingleLineBox.propTypes = {
  type: PropTypes.string.isRequired
};
