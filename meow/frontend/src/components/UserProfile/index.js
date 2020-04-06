import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import UserProfileImage from "./UserProfileImage";
import UserProfileBasicInfo from "./UserProfileBasicInfo";
import UserProfileBio from "./UserProfileBio";
import UserProfileTheme from "./UserProfileTheme";
import { editUser } from "../../actions/user.js";
import "./styling.css";
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

  editCurrentTheme = (themeDetails, index) => {
    let stateCopy = Object.assign({}, this.state);
    stateCopy.themes[index] = themeDetails;
    this.setState(stateCopy);
    //do a theme change here with redux
    if (this.state.selected_theme.id === themeDetails.id) {
      console.log("time to change theme after edit");
      stateCopy.selected_theme = this.state.themes[index];
      this.setState(stateCopy);
      this.props.editUser({ selected_theme: themeDetails });
    }
  };

  addNewTheme = themeDetails => {
    let stateCopy = Object.assign({}, this.state);
    stateCopy.themes.push(themeDetails);
    stateCopy.selected_theme = stateCopy.themes[stateCopy.themes.length - 1];
    this.props.editUser({ selected_theme: stateCopy.selected_theme });
    this.setState(stateCopy);
  };

  deleteTheme = index => {
    let stateCopy = Object.assign({}, this.state);
    let themename = stateCopy.themes[index].name;
    themeDelete(stateCopy.themes[index]).then(d => {
      if (d.status === 200) {
        stateCopy.themes.splice(index, 1);
        if (this.state.selected_theme.name === themename) {
          stateCopy.selected_theme = d.data;
          this.setState(stateCopy);
          this.props.editUser({ selected_theme: d.data });
        }
      }
    });
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
            deleteTheme={this.deleteTheme}
            loadadditionalThemes={this.loadadditionalThemes}
            additionalthemes={this.state.additionalthemes}
            starfavoriteTheme={this.starfavoriteTheme}
            starred_themes_id={this.state.starred_themes_id}
            unstarfavoriteTheme={this.unstarfavoriteTheme}
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

// const mapDispatchtoProps = dispatch => {
//   return {
//     changeTheme: (selected_theme) => {
//       dispatch({
//         type: "THEME_CHANGE",
//         payload: {
//           theme: selected_theme
//         }
//       });
//     }
//   }
// }

const mapDispatchToProps = {
  editUser: data => editUser(data)
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(UserProfile)
);
