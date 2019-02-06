import React from "react";
import "./styling.css";

function UserProfileThemeDot(props) {
  let className = `user-profile-theme-dot${props.isActive ? "-active" : ""}`;
  return <div className={className} style={{ "background-color": props.themeColor }} />;
}

export default UserProfileThemeDot;
