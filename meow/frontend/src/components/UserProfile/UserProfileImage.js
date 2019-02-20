import React from "react";
import "./styling.css";

function UserProfileImage(props) {
  return (
    <div className="user-profile-image-container">
      <img className="user-profile-image" src={props.profile_img} alt="profile-picture" />
    </div>
  );
}

export default UserProfileImage;
