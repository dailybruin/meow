import React from "react";
// import './styling.css';

import { Input, Row, Column } from "antd";

function UserProfileBasicInfo(props) {
  console.log(Input);
  return (
    <div className="user-profile-basic-info-container">
      <ul className="user-profile-basic-info-table">
        <li className="user-profile-basic-info-form-group">
          <p className="user-profile-basic-info-title">name: </p>
          <Input className="user-profile-basic-info-data">{props.name}</Input>
        </li>

        <li className="user-profile-basic-info-form-group">
          <p className="user-profile-basic-info-title">role: </p>
          <span className="user-profile-basic-info-data">{props.role}</span>
        </li>

        <li className="user-profile-basic-info-form-group">
          <p className="user-profile-basic-info-title">email: </p>
          <span className="user-profile-basic-info-data">{props.email}</span>
        </li>

        <li className="user-profile-basic-info-form-group">
          <p className="user-profile-basic-info-title">slack: </p>
          <span className="user-profile-basic-info-data">{props.slack_username}</span>
        </li>
      </ul>
    </div>
  );
}

export default UserProfileBasicInfo;
