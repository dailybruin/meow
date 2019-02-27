import React from "react";
import "./styling.css";

function UserProfileThemeRow(props) {
  console.log(props);
  return (
    <div className="user-profile-theme-row">
      <span className="user-profile-theme-row-name">{props.theme.name}</span>
      <div
        className="user-profile-theme-dot"
        style={{ backgroundColor: "#" + props.theme.primary }}
      />
      <div
        className="user-profile-theme-dot"
        style={{ backgroundColor: "#" + props.theme.secondary }}
      />
      <div
        className="user-profile-theme-dot"
        style={{ backgroundColor: "#" + props.theme.primary_font_color }}
      />
      <div
        className="user-profile-theme-dot"
        style={{ backgroundColor: "#" + props.theme.secondary_font_color }}
      />
    </div>
  );
}

export default UserProfileThemeRow;
