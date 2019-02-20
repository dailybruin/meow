import React from "react";
import "./styling.css";

function UserProfileSocialMedia(props) {
  return (
    <a href={props.href}>
      <img src={props.src} className="user-profile-social-media-bubble" alt={props.alt} />
    </a>
  );
}

export default UserProfileSocialMedia;
