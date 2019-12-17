import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import UserProfileImage from "./UserProfileImage";
import UserProfileBasicInfo from "./UserProfileBasicInfo";
import UserProfileBio from "./UserProfileBio";
import UserProfileTheme from "./UserProfileTheme";
import "./styling.css";
<<<<<<< HEAD
<<<<<<< HEAD
import {
  themeStarRemove,
  themeStarAdd,
  userDetail,
  themeList,
  themeAdd,
  themeEdit,
  themeDelete,
  additionalthemeList,
  starredthemesID
} from "../../services/api";
import { Modal } from "antd";
=======
import { userDetail, themeList, themeAdd } from "../../services/api";
>>>>>>> Added theme color dial in the frontend, added new themeAdd view in views.py
=======
import { userDetail, themeList, themeAdd, themeEdit, themeDelete } from "../../services/api";
import { Modal } from "antd";
>>>>>>> Implemented theme add, theme delete and theme update functions in views.py of user profile

class UserProfile extends React.Component {
  constructor(props) {
    super(props);
    //the most confusing part of this state is the 3 themes:
    //themes = a list of all themes avialable to the user.
    //         for now this is litterally all the themes in the themes table
    //theme = the theme selected by the current user. This comes from the redux state.
    //        By default, the theme is the Daily Bruin Theme.
    //        whenever a user logins in, the redux state's theme is set to the user's
    //selected_theme = the theme selected by the person whose profile is being shown
    //                 if nprajapati is looking at dnewman's profile, selected_theme = peach theme
    //                 (since that is dustin's theme) not dark theme (which is neil's theme).
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

      selected_theme: {
        name: "Daily Bruin",
        primary: "#00000",
        secondary: "#00000",
        primary_font_color: "#101010",
        secondary_font_color: "#123211",
        id: 1
      },
      themes: [
        {
          name: "Daily Bruin",
          primary: "#00000",
          secondary: "#00000",
          primary_font_color: "#101010",
          secondary_font_color: "#123211",
          id: 1
        }
      ],
      additionalthemes: [],
      starred_themes_id: []
    };
  }

  componentWillMount() {
    const { username } = this.props.match.params;

    themeList().then(d => {
      this.setState({
        ...this.state,
        themes: d.data
      });
    });

    if (username) {
      this.fetchUserFor(username);
    } else {
      // This is the /me route
      //TODO check if this is /me route
      this.fetchUserFor(this.props.username).then(() => {
        this.setState({
          isMe: true
        });
      });
    }
  }

  loadadditionalThemes = () => {
    starredthemesID().then(d => {
      console.log(d.data);
      this.setState({
        starred_themes_id: d.data
      });
    });
    additionalthemeList().then(d => {
      this.setState({
        ...this.state,
        additionalthemes: d.data
      });
    });
  };

  fetchUserFor = username => {
    return userDetail(username).then(d => {
      let data = d.data;
      console.log(d.data);
      this.setState({
        loading: false,
        first_name: data.first_name,
        last_name: data.last_name,
        instagram: data.instagram,
        twitter: data.twitter,
        role: data.role,
        profile_img: data.profile_img,
        slack_username: data.username,
        email: data.username + "@media.ucla.edu",
        bio: data.bio,
        selected_theme: data.selected_theme
      });
    });
  };

<<<<<<< HEAD
<<<<<<< HEAD
  ErrorModal = () => {
    Modal.warning({
=======
  ErrorModal = () => {
    Modal.error({
>>>>>>> Implemented theme add, theme delete and theme update functions in views.py of user profile
      title: "Naming Error",
      content: "Theme name must be unique!",
      maskClosable: true,
      closable: false,
      okButtonProps: { style: { display: "none" } },
      style: { marginTop: "30%" }
    });
  };

<<<<<<< HEAD
  editCurrentTheme = (themeDetails, index) => {
    var found = false;
    var stateCopy = Object.assign({}, this.state);
    for (let i = 0; i < stateCopy.themes.length; i++) {
      if (stateCopy.themes[i].name === themeDetails.name && i != index) {
        found = true;
      }
    }
    if (!found) {
      stateCopy.themes[index] = themeDetails;
      this.setState(stateCopy);
      console.log(stateCopy);
      themeEdit(this.state.themes[index]).then(d => {
        //update the index of the theme
        console.log("The id for the theme is " + d.data);
        stateCopy.themes[index].id = d.data;
        this.setState(stateCopy);
      });
    } else {
      console.log("Error: no same name themes allowed");
      this.ErrorModal();
    }
  };

  addNewTheme = themeDetails => {
    var found = false;
    var stateCopy = Object.assign({}, this.state);
    for (var item of stateCopy.themes) {
      if (item.name === themeDetails.name) {
        found = true;
      }
    }
    if (!found) {
      stateCopy.themes.push(themeDetails);
      this.setState(stateCopy);
      var index = this.state.themes.length - 1;
      themeAdd(this.state.themes[index]).then(d => {
        //update the index of the theme
        console.log("The id for the theme is " + d.data);
        stateCopy.themes[stateCopy.themes.length - 1].id = d.data;
        this.setState(stateCopy);
      });
    } else {
      console.log("Error: no same name themes allowed");
      this.ErrorModal();
    }
  };

  deleteTheme = index => {
    var stateCopy = Object.assign({}, this.state);
    stateCopy.themes[index].author = this.state.slack_username;
    themeDelete(stateCopy.themes[index]);
    stateCopy.themes.splice(index, 1);
    this.setState(stateCopy);
  };

  starfavoriteTheme = theme => {
    var stateCopy = Object.assign({}, this.state);
    themeStarAdd(theme).then(d => {
      console.log("List of starred themes index: ");
      stateCopy.starred_themes_id = d.data;
      stateCopy.additionalthemes.map(element => {
        if (element === theme) {
          element.favorite_count += 1;
          console.log(element);
        }
      });
      this.setState(stateCopy);
    });
  };

  unstarfavoriteTheme = theme => {
    var stateCopy = Object.assign({}, this.state);
    themeStarRemove(theme).then(d => {
      console.log("List of starred themes index: ");
      stateCopy.starred_themes_id = d.data;
      stateCopy.additionalthemes.map(element => {
        if (element === theme) {
          element.favorite_count -= 1;
          console.log(element);
        }
      });
      this.setState(stateCopy);
    });
=======
=======
>>>>>>> Implemented theme add, theme delete and theme update functions in views.py of user profile
  editCurrentTheme = (themeDetails, index) => {
    var found = false;
    var stateCopy = Object.assign({}, this.state);
    for (let i = 0; i < stateCopy.themes.length; i++) {
      if (stateCopy.themes[i].name === themeDetails.name && i != index) {
        found = true;
      }
    }
    if (!found) {
      stateCopy.themes[index] = themeDetails;
      this.setState(stateCopy);
      console.log(stateCopy);
      themeEdit(this.state.themes[index]); //call the post function
    } else {
      console.log("Error: no same name themes allowed");
      this.ErrorModal();
    }
  };

  addNewTheme = themeDetails => {
    var found = false;
    var stateCopy = Object.assign({}, this.state);
    for (var item of stateCopy.themes) {
      if (item.name === themeDetails.name) {
        found = true;
      }
    }
    if (!found) {
      stateCopy.themes.push(themeDetails);
      this.setState(stateCopy);
      var index = this.state.themes.length - 1;
      themeAdd(this.state.themes[index]);
    } else {
      console.log("Error: no same name themes allowed");
      this.ErrorModal();
    }
  };

  deleteTheme = index => {
    var stateCopy = Object.assign({}, this.state);
    stateCopy.themes[index].author = this.state.slack_username;
    themeDelete(stateCopy.themes[index]);
    stateCopy.themes.splice(index, 1);
    this.setState(stateCopy);
<<<<<<< HEAD
    console.log("debug");
    var index = this.state.themes.length - 1;
    themeAdd(this.state.themes[index]);
>>>>>>> Added theme color dial in the frontend, added new themeAdd view in views.py
=======
>>>>>>> Implemented theme add, theme delete and theme update functions in views.py of user profile
  };

  render() {
    console.log("Re render");
    console.log(this.state);
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
            canEdit={this.state.isMe}
          />
        </div>
        <div className="user-profile-row">
          <UserProfileBio canEdit={this.state.isMe} bio={this.state.bio} />
          <UserProfileTheme
            canEdit={this.state.isMe}
            themes={this.state.themes}
            selected_theme={this.state.isMe ? this.props.theme : this.state.selected_theme}
            editCurrentTheme={this.editCurrentTheme}
            addNewTheme={this.addNewTheme}
            saveTheme={this.saveTheme}
            username={this.state.slack_username}
<<<<<<< HEAD
<<<<<<< HEAD
            deleteTheme={this.deleteTheme}
            loadadditionalThemes={this.loadadditionalThemes}
            additionalthemes={this.state.additionalthemes}
            starfavoriteTheme={this.starfavoriteTheme}
            starred_themes_id={this.state.starred_themes_id}
            unstarfavoriteTheme={this.unstarfavoriteTheme}
=======
>>>>>>> Added theme color dial in the frontend, added new themeAdd view in views.py
=======
            deleteTheme={this.deleteTheme}
>>>>>>> Implemented theme add, theme delete and theme update functions in views.py of user profile
          />
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  username: state.default.user.username,
  theme: state.default.user.theme
});

export default withRouter(connect(mapStateToProps)(UserProfile));
