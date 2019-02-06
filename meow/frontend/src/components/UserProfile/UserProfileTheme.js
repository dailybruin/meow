import React from "react";

import UserProfileThemeDot from "./UserProfileThemeDot";

import "./styling.css";

function UserProfileTheme(props) {
  return (
    <div className="user-profile-theme-container">
      <h2 className="user-profile-theme-header">theme: </h2>
      <div className="user-profile-theme-box">
        {props.themes.map((value, index) => {
          //  return <p key={index}>{value.themeColor}</p>
          return (
            <UserProfileThemeDot
              key={index}
              isActive={value.isActive}
              themeColor={value.themeColor}
            />
          );
        })}
      </div>
    </div>
  );
}

export default UserProfileTheme;
