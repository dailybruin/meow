import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import UserProfileImage from "./UserProfileImage";
import UserProfileBasicInfo from "./UserProfileBasicInfo";
import UserProfileBio from "./UserProfileBio";
import UserProfileTheme from "./UserProfileTheme";
import "./styling.css";
import { userDetail, themeList } from "../../services/api";

class UserProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      profile_img:
        "https://pixel.nymag.com/imgs/daily/intelligencer/2018/09/24/24-bongo-cat.w700.h700.jpg",
      first_name: "Loading...",
      last_name: "Loading...",
      instagram: "http://instagram.com",
      twitter: "http://twitter.com",
      role: "Loading...",
      slack_username: "Loading...",
      email: "Loading...",
      bio: "Loading...",
      selected_theme: 1,
      themes: [
        // {
        //   name: "Daily Bruin",
        //   ​​​primary: "#3D73AD",
        //   primary_font_color: "FFFFFF",
        //   secondary: "4699DA",
        //   secondary_font_color: "FFFFFF",
        // },
        {
          name: "Daily Bruin",
          primary: "#00000",
          secondary: "#00000",
          primary_font_color: "#101010",
          secondary_font_color: "123211",
          id: 1
        }
      ]
    };
  }

  componentWillMount() {
    let username = this.props.match.params.username;

    themeList().then(d => {
      this.setState({
        ...this.state,
        themes: d.data
      });
    });
    userDetail(username).then(d => {
      let data = d.data;

      this.setState({
        profile_img:
          "https://pixel.nymag.com/imgs/daily/intelligencer/2018/09/24/24-bongo-cat.w700.h700.jpg",
        first_name: data.first_name,
        last_name: data.last_name,
        instagram: "http://instagram.com",
        twitter: "http://twitter.com",
        role: data.role,
        slack_username: data.username,
        email: data.username + "@media.ucla.edu",
        bio: data.bio,
        selected_theme: data.selected_theme
      });
    });
  }

  render() {
    return (
      <div className="user-profile-container">
        <div className="user-profile-row">
          <UserProfileImage profile_img={this.state.profile_img} />
          <UserProfileBasicInfo
            name={this.state.first_name + " " + this.state.last_name}
            role={this.state.role}
            slack_username={this.state.slack_username}
            email={this.state.email}
            instagram={this.state.instagram}
            twitter={this.state.twitter}
          />
        </div>
        <div className="user-profile-row">
          <UserProfileBio bio={this.state.bio} />
          <UserProfileTheme themes={this.state.themes} selected_theme={this.state.selected_theme} />
        </div>
      </div>
    );
  }
}

// const mapStateToProps = state => ({});

export default withRouter(connect(null)(UserProfile));
