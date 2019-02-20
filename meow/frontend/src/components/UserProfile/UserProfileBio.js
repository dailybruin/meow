import React from "react";

function UserProfileBio(props) {
  let defaultBio = "You have no bio. meow :(";
  return (
    // <div></div>
    <div className="user-profile-bio-container">
      <h2 className="user-profile-bio-header">about</h2>
      <p className="user-profile-bio-paragraph">{props.bio || defaultBio}</p>
    </div>
  );
}

export default UserProfileBio;
