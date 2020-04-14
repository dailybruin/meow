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
  themeDelete,
  additionalthemeList
} from "../../services/api";
import cloneDeep from "lodash.clonedeep";

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
      additionalThemes: [],
      starredThemesId: []
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

  loadAdditionalThemes = () => {
    additionalthemeList().then(d => {
      this.setState(prevState => {
        let starredThemesArray = cloneDeep(d.data.additionalThemes);
        let starredThemesIdArray = cloneDeep(d.data.starredThemesId);
        let idTrackerMap = {};
        starredThemesIdArray.forEach(element => {
          idTrackerMap[element] = 1;
        });
        console.log(idTrackerMap);
        starredThemesArray.map(element => {
          if (idTrackerMap.hasOwnProperty(element.id)) {
            element["starred"] = true;
          }
        });
        return {
          ...prevState,
          additionalThemes: starredThemesArray,
          starredThemesId: starredThemesIdArray
        };
      });
    });
  };

  fetchUserFor = username => {
    return userDetail(username).then(d => {
      let data = d.data;
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

  editCurrentTheme = themeDetails => {
    this.setState(prevState => {
      const newThemes = cloneDeep(prevState.themes);
      let i = 0;
      for (; i < newThemes.length; i++) {
        if (newThemes[i].id === themeDetails.id) {
          newThemes[i] = themeDetails;
          break;
        }
      }
      return {
        ...prevState,
        themes: newThemes
      };
    });
    this.props.editUser({ selected_theme: themeDetails });
  };

  addNewTheme = themeDetails => {
    this.props.editUser({ selected_theme: themeDetails });
    this.setState(prevState => {
      return {
        themes: [...prevState.themes, themeDetails]
      };
    });
  };

  deleteTheme = index => {
    let themeName = this.state.themes[index].name;
    themeDelete(this.state.themes[index]).then(d => {
      if (d.status === 200) {
        if (this.state.selected_theme.name === themeName) {
          this.props.editUser({ selected_theme: d.data }).then(() => {
            const newThemes = cloneDeep(this.state.themes);
            newThemes.splice(index, 1);
            this.setState({
              selected_theme: d.data,
              themes: newThemes
            });
          });
        } else {
          const newThemes = cloneDeep(this.state.themes);
          newThemes.splice(index, 1);
          this.setState({
            themes: newThemes
          });
        }
      }
    });
  };

  themeChanger = data => {
    this.setState({
      selected_theme: data
    });
  };

  starFavoriteTheme = theme => {
    themeStarAdd(theme).then(d => {
      this.setState(prevState => {
        let additionalThemes = cloneDeep(prevState.additionalThemes);
        additionalThemes.map(element => {
          if (element.id === theme.id) {
            element["starred"] = true;
            element.favorite_count = d.data.favCount;
          }
        });
        return {
          starredThemesId: d.data.starredThemesId,
          additionalThemes: additionalThemes
        };
      });
    });
  };

  unstarFavoriteTheme = theme => {
    themeStarRemove(theme).then(d => {
      this.setState(prevState => {
        let additionalThemes = cloneDeep(prevState.additionalThemes);
        additionalThemes.map(element => {
          if (element.id === theme.id) {
            delete element["starred"];
            element.favorite_count = d.data.favCount;
          }
        });
        return {
          ...prevState,
          additionalThemes: additionalThemes,
          starredThemesId: d.data.starredThemesId
        };
      });
    });
  };

  render() {
    console.log(this.state);
    if (this.state.loading) {
      return null;
    }
    return (
      <div className="user-profile-main-container">
        <div className="user-profile-picture-bio-container">
          <UserProfileImage profile_img={this.state.profile_img} />
          <UserProfileBio canEdit={this.state.isMe} bio={this.state.bio} />
        </div>
        <div className="user-profile-user-info-themes-container">
          <UserProfileBasicInfo
            name={this.state.first_name + " " + this.state.last_name}
            role={this.state.role}
            slack_username={this.state.slack_username}
            email={this.state.email}
            instagram={this.state.instagram}
            twitter={this.state.twitter}
            canEdit={this.state.isMe}
          />
          <UserProfileTheme
            canEdit={this.state.isMe}
            themes={this.state.themes}
            selected_theme={this.state.isMe ? this.props.theme : this.state.selected_theme}
            editCurrentTheme={this.editCurrentTheme}
            addNewTheme={this.addNewTheme}
            saveTheme={this.saveTheme}
            username={this.state.slack_username}
            deleteTheme={this.deleteTheme}
            loadAdditionalThemes={this.loadAdditionalThemes}
            additionalThemes={this.state.additionalThemes}
            starFavoriteTheme={this.starFavoriteTheme}
            starredThemesId={this.state.starredThemesId}
            unstarFavoriteTheme={this.unstarFavoriteTheme}
            themeChanger={this.themeChanger}
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

const mapDispatchToProps = {
  editUser: data => editUser(data)
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(UserProfile)
);
