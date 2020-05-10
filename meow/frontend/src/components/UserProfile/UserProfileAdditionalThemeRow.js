import React from "react";
import "./styling.css";
import { connect } from "react-redux";
import { editUser } from "../../actions/user";
import { FaStar, FaRegStar } from "react-icons/fa";
import { Tooltip } from "antd";

class UserProfileAdditionalThemeRow extends React.PureComponent {
  render() {
    return (
      <div className="user-profile-theme-row-row-with-nav">
        <div
          className={`user-profile-theme-row${this.props.active ? "-active" : ""}`}
          onClick={this.setAsCurrentTheme}
          style={{ animation: `${this.props.animateUnmount ? "slideout" : "slidein"} 1s` }}
          onAnimationEnd={() => {
            if (this.props.animateUnmount === true) {
              this.props.unmountAdditionalThemes();
            }
          }}
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
        <p
          style={{
            marginLeft: -6,
            animation: `${this.props.animateUnmount ? "slideout" : "slideIn"} 1s`
          }}
        >
          {this.props.theme.favorite_count}
        </p>
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
    let renderIcon = this.props.starred ? (
      <FaStar
        className="starred-icon"
        onClick={() => {
          this.props.clickHandler(this.props.theme);
        }}
        style={{ animation: `${this.props.animateUnmount ? "slideout" : "rotateIn"} 1s` }}
      />
    ) : (
      <FaRegStar
        className="unstarred-icon"
        onClick={() => {
          this.props.clickHandler(this.props.theme);
        }}
        style={{ animation: `${this.props.animateUnmount ? "slideout" : "rotateIn"} 1s` }}
      />
    );
    return <div>{renderIcon}</div>;
  };
}

const mapDispatchToProps = {
  editUser: data => editUser(data)
};

export default connect(
  null,
  mapDispatchToProps
)(UserProfileAdditionalThemeRow);
