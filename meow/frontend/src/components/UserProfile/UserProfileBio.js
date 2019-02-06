import React from "react";

function UserProfileBio(props) {
  return (
    // <div></div>
    <div className="user-profile-bio-container">
      <h2 className="user-profile-bio-header">about</h2>
      <p className="user-profile-bio-paragraph">{props.bio}</p>
    </div>
  );
}

export default UserProfileBio;
