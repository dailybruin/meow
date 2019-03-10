import React from "react";

import UserProfileThemeRow from "./UserProfileThemeRow";

import "./styling.css";

function UserProfileTheme(props) {
  return (
    <div className="user-profile-theme-container">
      <h2 className="user-profile-theme-header">theme: </h2>
      <div className="user-profile-theme-box">
        {props.themes.map((value, index) => {
          value.active = value.id === props.selected_theme.id;
          //  return <p key={index}>{value.themeColor}</p>
          return <UserProfileThemeRow key={value.id} theme={value} />;
        })}
      </div>
    </div>
  );
}

export default UserProfileTheme;
