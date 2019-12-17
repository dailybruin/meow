import React from "react";
import UserProfileThemeRow from "./UserProfileThemeRow";
import CreateModal from "./UserProfileThemeCreateModal";
<<<<<<< HEAD
import UserProfileAdditionalThemeRow from "./UserProfileAdditionalThemeRow";
=======
>>>>>>> Added theme color dial in the frontend, added new themeAdd view in views.py
import "./styling.css";
import { Icon } from "antd";

class UserProfileTheme extends React.Component {
<<<<<<< HEAD
  state = {
    visible: false,
    seemore: false
  };
=======
  state = { visible: false };
>>>>>>> Added theme color dial in the frontend, added new themeAdd view in views.py

  showModal = () => {
    this.setState({
      visible: true
    });
  };

  handleOk = e => {
    console.log(e);
    this.setState({
      visible: false
    });
  };

  handleCancel = e => {
    console.log(e);
    this.setState({
      visible: false
    });
  };

  render() {
    let seemore = [];
    if (this.state.seemore === false) {
      seemore.push(
        <div className="user-profile-theme-see-more">
          <button
            onClick={() => {
              this.setState({ seemore: true });
              this.props.loadadditionalThemes();
            }}
          >
            see more...
          </button>
        </div>
      );
    } else {
      this.props.additionalthemes.map(item => {
        let active_theme = item.name === this.props.selected_theme.name;
        console.log("item id:");
        console.log(item.id);
        if (this.props.starred_themes_id.indexOf(item.id) > -1) {
          seemore.push(
            <UserProfileAdditionalThemeRow
              starred={true}
              unstarfavoriteTheme={this.props.unstarfavoriteTheme}
              active={active_theme}
              theme={item}
              canEdit={this.props.canEdit}
            />
          );
        } else {
          seemore.push(
            <UserProfileAdditionalThemeRow
              starred={false}
              starfavoriteTheme={this.props.starfavoriteTheme}
              active={active_theme}
              theme={item}
              canEdit={this.props.canEdit}
            />
          );
        }
      });
      seemore.push(
        <div className="user-profile-theme-see-more">
          <button
            onClick={() => {
              this.setState({ seemore: false });
            }}
          >
            close
          </button>
        </div>
      );
    }
    return (
      <div>
        <div className="user-profile-theme-container">
          <h2 className="user-profile-theme-header">theme: </h2>
          <div className="user-profile-theme-box">
            {this.props.themes.map((value, index) => {
              let active = value.name === this.props.selected_theme.name;
              //  return <p key={index}>{value.themeColor}</p>
<<<<<<< HEAD
<<<<<<< HEAD
              let disabled = false;
              if (index === 0 || index === 1) {
                disabled = true;
              }
=======
>>>>>>> Added theme color dial in the frontend, added new themeAdd view in views.py
              return (
                <UserProfileThemeRow
                  canEdit={this.props.canEdit}
                  key={value.id}
                  theme={value}
                  active={active}
                  editCurrentTheme={this.props.editCurrentTheme}
                  index={index}
                  name={value.name}
                  empty={false}
                  username={this.props.username}
<<<<<<< HEAD
                  deleteTheme={this.props.deleteTheme}
                  disabled={disabled}
=======
>>>>>>> Added theme color dial in the frontend, added new themeAdd view in views.py
                />
              );
=======
              if (index === 0 || index === 1) {
                return (
                  <UserProfileThemeRow
                    canEdit={this.props.canEdit}
                    key={value.id}
                    theme={value}
                    active={active}
                    editCurrentTheme={this.props.editCurrentTheme}
                    index={index}
                    name={value.name}
                    empty={false}
                    username={this.props.username}
                    deleteTheme={this.props.deleteTheme}
                    disabled={true}
                  />
                );
              } else {
                return (
                  <UserProfileThemeRow
                    canEdit={this.props.canEdit}
                    key={value.id}
                    theme={value}
                    active={active}
                    editCurrentTheme={this.props.editCurrentTheme}
                    index={index}
                    name={value.name}
                    empty={false}
                    username={this.props.username}
                    deleteTheme={this.props.deleteTheme}
                    disabled={false}
                  />
                );
              }
>>>>>>> Implemented theme add, theme delete and theme update functions in views.py of user profile
            })}
          </div>
          <div className="user-profile-theme-add-button-container">
            <button className="user-profile-theme-add-button">
              <Icon
                type="plus-circle"
                style={{
                  fontSize: "40px",
                  color: "#b3b3b3"
                }}
                onClick={this.showModal}
              />
            </button>
          </div>
<<<<<<< HEAD
          <div style={{ marginTop: 12 }}>{seemore}</div>
=======
>>>>>>> Added theme color dial in the frontend, added new themeAdd view in views.py
        </div>

        <CreateModal
          handleCancel={this.handleCancel}
          visible={this.state.visible}
          handleOk={this.handleOk}
          handleCancel={this.handleCancel}
          addNewTheme={this.props.addNewTheme}
          name={this.props.name}
          saveTheme={this.props.saveTheme}
          username={this.props.username}
        />
      </div>
    );
  }
}

// //it is important that this component
// const mapStateToProps = (state) => {
//   return { theme: state.default.user.theme };
// }

export default UserProfileTheme;
