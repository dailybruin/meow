import React from "react";
import "./styling.css";
import { connect } from "react-redux";
import { Menu, Dropdown, Icon, Tooltip } from "antd";
import { editUser } from "../../actions/user";
import UserProfileThemeModal from "./UserProfileThemeModal";
import { IoLogoOctocat } from "react-icons/io";
import { themeEdit } from "../../services/api.js";

class UserProfileThemeRow extends React.PureComponent {
  state = { visible: false, mounted: false };

  showModal = () => {
    this.setState({
      visible: true,
      mounted: true
    });
  };

  handleOk = e => {
    this.setState({
      visible: false
    });
  };

  handleCancel = e => {
    this.setState({
      visible: false
    });
  };

  unmountModal = () => {
    this.setState({
      mounted: false
    });
  };

  renderMenu = () => {
    return (
      <Menu className={"user-profile-theme-row-dropdown-menu"}>
        <Menu.Item
          onClick={this.showModal}
          key="0"
          className={"user-profile-theme-row-dropdown-menu-item"}
        >
          <a className={"user-profile-theme-row-dropdown-menu-item-edit"}>Edit</a>
        </Menu.Item>
        <Menu.Item
          key="1"
          className={"user-profile-theme-row-dropdown-menu-item"}
          onClick={() => {
            this.props.deleteTheme(this.props.index); //theme deletion function that is passed down
          }}
        >
          <a className={"user-profile-theme-row-dropdown-menu-item-delete"}>Delete</a>
        </Menu.Item>
      </Menu>
    );
  };

  renderIcon = () => {
    if (this.props.disabled === false) {
      return <Icon type="ellipsis" className={"user-profile-theme-row-dropdown-icon"} />;
    } else {
      return (
        <IoLogoOctocat
          style={{
            fontSize: 30,
            marginTop: 14,
            marginLeft: 1
          }}
        />
      );
    }
  };

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

        <div className={"user-profile-theme-row-dropdown"}>
          <Dropdown overlay={this.renderMenu} disabled={this.props.disabled}>
            {this.renderIcon()}
          </Dropdown>
        </div>
        {this.state.mounted === true ? (
          <UserProfileThemeModal
            handleCancel={this.handleCancel}
            visible={this.state.visible}
            handleOk={this.handleOk}
            theme={this.props.theme}
            username={this.props.username}
            unmountModal={this.unmountModal}
            onSubmit={themeEdit}
            onSuccess={this.props.editCurrentTheme}
            buttonText={"save colors"}
          />
        ) : null}
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
}

const mapDispatchToProps = {
  editUser: data => editUser(data)
};

export default connect(
  null,
  mapDispatchToProps
)(UserProfileThemeRow);
