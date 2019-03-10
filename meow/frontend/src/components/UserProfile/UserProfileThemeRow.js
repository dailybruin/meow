import React from "react";
import "./styling.css";

class UserProfileThemeRow extends React.Component {
  render() {
    return (
      <div className={`user-profile-theme-row${this.props.theme.active ? "-active" : ""}`}>
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

  createHandOrGap = () => {
    if (this.props.theme.active) {
      return (
        <img src="/static/src/assets/other/bongocat.png" className="user-profile-theme-row-hand" />
      );
    } else {
      return <span className="user-profile-theme-row-hand" />;
    }
  };
}

export default UserProfileThemeRow;
