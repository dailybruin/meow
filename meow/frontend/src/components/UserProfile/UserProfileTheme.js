import React from "react";

import UserProfileThemeRow from "./UserProfileThemeRow";
import CreateModal from "./UserProfileThemeCreateModal";
import "./styling.css";
import { Icon } from "antd";

class UserProfileTheme extends React.Component {
  state = { visible: false };

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
    return (
      <div>
        <div className="user-profile-theme-container">
          <h2 className="user-profile-theme-header">theme: </h2>
          <div className="user-profile-theme-box">
            {this.props.themes.map((value, index) => {
              let active = value.name === this.props.selected_theme.name;
              //  return <p key={index}>{value.themeColor}</p>
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
