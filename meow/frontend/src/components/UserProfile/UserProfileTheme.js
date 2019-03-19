import React from "react";

import UserProfileThemeRow from "./UserProfileThemeRow";

import "./styling.css";

class UserProfileTheme extends React.Component {
  render() {
    return (
      <div className="user-profile-theme-container">
        <h2 className="user-profile-theme-header">theme: </h2>
        <div className="user-profile-theme-box">
          {this.props.themes.map((value, index) => {
            let active = value.id === this.props.selected_theme.id;
            //  return <p key={index}>{value.themeColor}</p>
            return (
              <UserProfileThemeRow
                canEdit={this.props.canEdit}
                key={value.id}
                theme={value}
                active={active}
              />
            );
          })}
        </div>
      </div>
    );
  }
}

// //it is important that this component
// const mapStateToProps = (state) => {
//   return { theme: state.default.user.theme };
// }

export default UserProfileTheme;
