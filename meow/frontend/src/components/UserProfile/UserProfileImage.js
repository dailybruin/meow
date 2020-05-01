import React from "react";
import "./styling.css";
import Img from "react-image";
import { Spin } from "antd";

function UserProfileImage(props) {
  return (
    <div className="user-profile-image-container">
      <Img
        className="user-profile-image"
        src={props.profile_img}
        alt="profile-pic"
        loader={
          <div>
            <Spin size="large" />
          </div>
        }
        unloader={<img className="user-profile-image" src="static/cats/6.jpg" alt="default" />}
      />
    </div>
  );
}

export default UserProfileImage;
