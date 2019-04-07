import React from "react";
import "./styling.css";
import { connect } from "react-redux";

import { editUser } from "../../actions/user";

class UserProfileThemeRow extends React.Component {
  render() {
    return (
      <div
        className={`user-profile-theme-row${this.props.active ? "-active" : ""}`}
        onClick={this.setAsCurrentTheme}
      >
        {this.createHandOrGap()}
        <span className="user-profile-theme-row-name">{this.props.theme.name}</span>
        <div
          className="user-profile-theme-dot"
          style={{ backgroundColor: "#" + this.props.theme.primary }}
        />
        <div
          className="user-profile-theme-dot"
          style={{ backgroundColor: "#" + this.props.theme.secondary }}
        />
        <div
          className="user-profile-theme-dot"
          style={{ backgroundColor: "#" + this.props.theme.primary_font_color }}
        />
        <div
          className="user-profile-theme-dot"
          style={{ backgroundColor: "#" + this.props.theme.secondary_font_color }}
        />
        <div
          className="user-profile-theme-dot"
          style={{ backgroundColor: "#" + this.props.theme.tertiary }}
        />
      </div>
    );
  }

  setAsCurrentTheme = () => {
    if (this.props.canEdit) {
      console.log(this.props.editUser);
      //this will trigger the api call and update the redux state and cause a rerender.
      this.props.editUser({ selected_theme: this.props.theme });
    }
  };

  createHandOrGap = () => {
    if (this.props.active) {
      return (
        <img src="/static/src/assets/other/bongocat.png" className="user-profile-theme-row-hand" />
      );
    } else {
      return <span className="user-profile-theme-row-hand" />;
    }
  };
}

const mapDispatchToProps = {
  editUser: data => editUser(data)
};

export default connect(
  null,
  mapDispatchToProps
)(UserProfileThemeRow);
