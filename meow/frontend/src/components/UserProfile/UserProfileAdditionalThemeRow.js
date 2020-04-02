import React from "react";
import "./styling.css";
import { connect } from "react-redux";
import { editUser } from "../../actions/user";
import { FaStar, FaRegStar } from "react-icons/fa";
import { MdFavorite } from "react-icons/md";

class UserProfileAdditionalThemeRow extends React.Component {
  render() {
    return (
      <div class="user-profile-theme-row-row-with-nav">
        <div
          className={`user-profile-theme-row${this.props.active ? "-active" : ""}`}
          onClick={this.setAsCurrentTheme}
        >
          {this.createHandOrGap()}
          <span className="user-profile-theme-row-name">{this.props.theme.name}</span>
          <div
            className="user-profile-theme-dot"
            style={{ backgroundColor: this.props.theme.primary }}
          />
          <div
            className="user-profile-theme-dot"
            style={{ backgroundColor: this.props.theme.secondary }}
          />
          <div
            className="user-profile-theme-dot"
            style={{ backgroundColor: this.props.theme.primary_font_color }}
          />
          <div
            className="user-profile-theme-dot"
            style={{ backgroundColor: this.props.theme.secondary_font_color }}
          />
          <div
            className="user-profile-theme-dot"
            style={{ backgroundColor: this.props.theme.tertiary }}
          />
        </div>

        <div className={"user-profile-theme-row-star"}>{this.starSelected()}</div>
      </div>
    );
  }

  setAsCurrentTheme = () => {
    if (this.props.canEdit) {
      console.log(this.props.editUser);
      //this will trigger the api call and update the redux state and cause a rerender.
      this.props.editUser({ selected_theme: this.props.theme });
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
    console.log("Count: ");
    console.log(this.props.theme.favorite_count);
    if (this.props.starred === true) {
      if (this.props.theme.favorite_count >= 5) {
        return (
          <div
            onClick={() => {
              this.props.unstarfavoriteTheme(this.props.theme);
              console.log("clicked_star");
            }}
          >
            <MdFavorite
              style={{
                marginTop: 11,
                fontSize: 30,
                color: "#d94a4a"
              }}
            />
          </div>
        );
      } else {
        return (
          <div
            onClick={() => {
              this.props.unstarfavoriteTheme(this.props.theme);
              console.log("clicked_star");
            }}
          >
            <FaStar
              style={{
                marginTop: 11,
                fontSize: 30,
                color: "#e6cf00"
              }}
            />
          </div>
        );
      }
    } else {
      return (
        <div
          onClick={() => {
            this.props.starfavoriteTheme(this.props.theme);
            console.log("clicked_star");
          }}
        >
          <FaRegStar
            style={{
              marginTop: 11,
              fontSize: 30,
              color: "#cfcfcf"
            }}
          />
        </div>
      );
    }
  };
}

const mapDispatchToProps = {
  editUser: data => editUser(data)
};

export default connect(
  null,
  mapDispatchToProps
)(UserProfileAdditionalThemeRow);
