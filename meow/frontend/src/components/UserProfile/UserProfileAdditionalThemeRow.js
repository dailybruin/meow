import React from "react";
import "./styling.css";
import { connect } from "react-redux";
import { editUser } from "../../actions/user";
import { FaStar, FaRegStar } from "react-icons/fa";
import { MdFavorite } from "react-icons/md";
import { Tooltip } from "antd";

class UserProfileAdditionalThemeRow extends React.Component {
  render() {
    return (
      <div className="user-profile-theme-row-row-with-nav">
        <div
          className={`user-profile-theme-row${this.props.active ? "-active" : ""}`}
          onClick={this.setAsCurrentTheme}
        >
          {this.createHandOrGap()}
          <span className="user-profile-theme-row-name">{this.props.theme.name}</span>
          <Tooltip title="header, primary side-bar color">
            <div
              className="user-profile-theme-dot"
              style={{ backgroundColor: this.props.theme.primary }}
            />
          </Tooltip>
          <Tooltip title="secondary side-bar color">
            <div
              className="user-profile-theme-dot"
              style={{ backgroundColor: this.props.theme.secondary }}
            />
          </Tooltip>
          <Tooltip title="header font-color">
            <div
              className="user-profile-theme-dot"
              style={{ backgroundColor: this.props.theme.primary_font_color }}
            />
          </Tooltip>
          <Tooltip title="sidebar font-color">
            <div
              className="user-profile-theme-dot"
              style={{ backgroundColor: this.props.theme.secondary_font_color }}
            />
          </Tooltip>
          <Tooltip title="new meow button">
            <div
              className="user-profile-theme-dot"
              style={{ backgroundColor: this.props.theme.tertiary }}
            />
          </Tooltip>
        </div>

        <div className={"user-profile-theme-row-star"}>{this.starSelected()}</div>
      </div>
    );
  }

  setAsCurrentTheme = () => {
    if (this.props.canEdit) {
      //this will trigger the api call and update the redux state and cause a rerender.
      this.props.editUser({ selected_theme: this.props.theme });
      this.props.themeChanger(this.props.theme);
    }
  };

  createHandOrGap = () => {
    if (this.props.active) {
      return <img src="/static/other/bongocat.png" className="user-profile-theme-row-hand" />;
    } else {
      return <span className="user-profile-theme-row-hand" />;
    }
  };

  starSelected = () => {
    let clickHandler = null;
    let icon = null;
    if (this.props.starred === true) {
      clickHandler = () => {
        this.props.unstarfavoriteTheme(this.props.theme);
      };
      if (this.props.favorite_count >= 5) {
        icon = (
          <MdFavorite
            style={{
              marginTop: 11,
              fontSize: 30,
              color: "#d94a4a"
            }}
          />
        );
      } else {
        icon = (
          <FaStar
            style={{
              marginTop: 11,
              fontSize: 30,
              color: "#e6cf00"
            }}
          />
        );
      }
    } else {
      clickHandler = () => {
        this.props.starfavoriteTheme(this.props.theme);
      };
      icon = (
        <FaRegStar
          style={{
            marginTop: 11,
            fontSize: 30,
            color: "#cfcfcf"
          }}
        />
      );
    }

    return <div onClick={clickHandler}>{icon}</div>;
  };
}

const mapDispatchToProps = {
  editUser: data => editUser(data)
};

export default connect(
  null,
  mapDispatchToProps
)(UserProfileAdditionalThemeRow);
