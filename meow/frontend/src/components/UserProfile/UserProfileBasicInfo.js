import React from "react";
import UserProfileSocialMediaContainer from "./UserProfileSocialMediaContainer";
import "./styling.css";

//= =========================== helper functions =======================//

//= =========================== ACTUAL FUNCTIONAL Component ===================//
function UserProfileBasicInfo(props) {
  return (
    <div className="user-profile-basic-info-container">
      <ul className="user-profile-basic-info-table">
        <li className="user-profile-basic-info-form-group">
          <p className="user-profile-basic-info-title">name: </p>
          <div className="user-profile-basic-info-data">{props.name}</div>
        </li>

        <li className="user-profile-basic-info-form-group">
          <p className="user-profile-basic-info-title">role: </p>
          <div className="user-profile-basic-info-data">{props.role}</div>
        </li>

        <li className="user-profile-basic-info-form-group">
          <p className="user-profile-basic-info-title">email: </p>
          <div className="user-profile-basic-info-data">{props.email}</div>
        </li>

        <li className="user-profile-basic-info-form-group">
          <p className="user-profile-basic-info-title">slack: </p>
          <div className="user-profile-basic-info-data">{props.slack_username}</div>
        </li>

        {/* <UserProfileSocialMediaContainer
          canEdit={props.canEdit}
          instagram={props.instagram}
          twitter={props.twitter}
        /> */}
      </ul>
    </div>
  );
}

export default UserProfileBasicInfo;
