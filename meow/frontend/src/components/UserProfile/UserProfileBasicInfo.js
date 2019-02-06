import React from "react";
import UserProfileSocialMedia from "./UserProfileSocialMedia";
import "./styling.css";

function UserProfileBasicInfo(props) {
  return (
    <div className="user-profile-basic-info-container">
      <ul className="user-profile-basic-info-table">
        <li className="user-profile-basic-info-form-group">
          <p className="user-profile-basic-info-title">name: </p>
          <div className="user-profile-basic-info-data">
            {props.name}
            <hr className="user-profile-basic-info-horizontal-line" />
          </div>
        </li>

        <li className="user-profile-basic-info-form-group">
          <p className="user-profile-basic-info-title">role: </p>
          <div className="user-profile-basic-info-data">
            {props.role}
            <hr className="user-profile-basic-info-horizontal-line" />
          </div>
        </li>

        <li className="user-profile-basic-info-form-group">
          <p className="user-profile-basic-info-title">email: </p>
          <div className="user-profile-basic-info-data">
            {props.email}
            <hr className="user-profile-basic-info-horizontal-line" />
          </div>
        </li>

        <li className="user-profile-basic-info-form-group">
          <p className="user-profile-basic-info-title">slack: </p>
          <div className="user-profile-basic-info-data">
            {props.slack_username}
            <hr className="user-profile-basic-info-horizontal-line" />
          </div>
        </li>

        <li className="user-profile-basic-info-form-group">
          <UserProfileSocialMedia
            href={props.instagram}
            src="/static/src/assets/social_media/instagram.png"
            alt="Instagram logo"
          />
          <UserProfileSocialMedia
            href={props.twitter}
            src="/static/src/assets/social_media/twitter.png"
            alt="Twitter logo"
          />
        </li>
      </ul>
    </div>
  );
}

export default UserProfileBasicInfo;
