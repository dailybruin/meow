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
      loading: true,
      isMe: false,
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
      themes: []
    };
  }

  fetchUserFor = username => {
    return userDetail(username).then(d => {
      let data = d.data;

      this.setState({
        loading: false,
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
        themes: [
          { themeColor: "#FF0000" },
          { themeColor: "#FFA500" },
          { themeColor: "#FFFF00" },
          { themeColor: "#00FF00" },

          { themeColor: data.theme ? data.theme.background_color : "#000000", isActive: true },
          { themeColor: "#0000FF" },
          { themeColor: "#AD14E3" },
          { themeColor: "#000000" },

          { themeColor: "#ACF48B" },
          { themeColor: "#FFFA80" },
          { themeColor: "#F8BB8F" },
          { themeColor: "#EF8F8F" },

          { themeColor: "#C4C4C4" },
          { themeColor: "#D689F1" },
          { themeColor: "#8FA4EC" },
          { themeColor: "#B6EAFB" }
        ]
      });
    });
  };

  componentWillMount() {
    const { username } = this.props.match.params;

    themeList().then(d => console.log(d));

    if (username) {
      this.fetchUserFor(username);
    } else {
      // This is the /me route
      this.fetchUserFor(this.props.username).then(() => {
        this.setState({
          isMe: true
        });
      });
    }
  }

  render() {
    if (this.state.loading) {
      return null;
    }
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
          <UserProfileBio canEdit={this.state.isMe} bio={this.state.bio} />
          <UserProfileTheme canEdit={this.state.isMe} themes={this.state.themes} />
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  username: state.default.user.username
});

export default withRouter(connect(mapStateToProps)(UserProfile));
