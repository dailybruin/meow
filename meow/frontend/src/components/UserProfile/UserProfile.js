import React from "react";
import axios from "axios";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import UserProfileImage from "./UserProfileImage";
import UserProfileBasicInfo from "./UserProfileBasicInfo";
import UserProfileBio from "./UserProfileBio";
import UserProfileTheme from "./UserProfileTheme";
import "./styling.css";

class UserProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null
    };
  }

  componentWillMount() {
    //posts.js for Examples. PUt in user.js
    //
    let user_id = this.props.match.params.user_id;
    this.setState({
      user_id: user_id,
      profile_img:
        "https://pixel.nymag.com/imgs/daily/intelligencer/2018/09/24/24-bongo-cat.w700.h700.jpg",
      first_name: "Bongo",
      last_name: "Cat",
      instagram: "http://instagram.com",
      twitter: "http://twitter.com",
      role: "DJ",
      slack_username: "bcat",
      email: "bcat@media.ucla.edu",
      bio:
        "Cat ipsum dolor sit amet, fall over dead (not really but gets sypathy) where is my slave? I'm getting hungry demand to have some of whatever the human is cooking, then sniff the offering and walk away. Slap owner's face at 5am until human fills food dish curl into a furry donut, love you, then bite you. Attack the dog then pretend like nothing happened attack dog, run away and pretend to be victim stick butt in face. The door is opening! how exciting oh, it's you, meh chew foot ignore the human until she needs to get up, then climb on her lap and sprawl yet fooled again thinking the dog likes me.",
      themes: [
        { themeColor: "#FF0000" },
        { themeColor: "#FFA500" },
        { themeColor: "#FFFF00" },
        { themeColor: "#00FF00" },

        { themeColor: "#87CEEB", isActive: true },
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
    //instead of axios
    //this.props.loadPosts.then(res=>{

    //})
  }

  render() {
    //not sure if background_color is being access correctly
    return (
      <div className="user-profile-container">
        <UserProfileImage profile_img={this.state.profile_img} />
        <UserProfileBasicInfo
          name={this.state.first_name + " " + this.state.last_name}
          role={this.state.role}
          slack_username={this.state.slack_username}
          email={this.state.email}
          instagram={this.state.instagram}
          twitter={this.state.twitter}
        />
        <UserProfileBio bio={this.state.bio} />
        <UserProfileTheme themes={this.state.themes} />
      </div>
      // <div className="user-profile-container">
      // <UserProfileImage profile_img={this.state.profile_img} />
      //   // <UserProfileBasicInfo
      //   //   name={this.state.first_name + " " + this.state.last_name}
      //   //   role={this.state.role}
      //   //   slack_username={this.state.slack_username}
      //   //   email={this.state.email}
      //   // />
      // </div>
    );
  }
}

const mapStateToProps = state => ({});

export default withRouter(connect(mapStateToProps)(UserProfile));
