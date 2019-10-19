import React from "react";
import "./styling.css";

function UserProfileThemeDot(props) {
  let className = `user-profile-theme-dot${props.isActive ? "-active" : ""}`;
  return <div className={className} style={{ backgroundColor: props.themeColor }} />;
}

export default UserProfileThemeDot;
