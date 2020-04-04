import React from "react";
import "./styling.css";
import { connect } from "react-redux";
import { Menu, Dropdown, Icon } from "antd";
import { editUser } from "../../actions/user";
import EditModal from "./UserProfileThemeEditModal";
import { IoLogoOctocat } from "react-icons/io";

class UserProfileThemeRow extends React.Component {
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

  menu = () => {
    console.log("clicked");
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
            console.log(this.props.index);
            console.log("delete");
            this.props.deleteTheme(this.props.index); //theme deletion function that is passed down
          }}
        >
          <a className={"user-profile-theme-row-dropdown-menu-item-delete"}>Delete</a>
        </Menu.Item>
      </Menu>
    );
  };

  icon = () => {
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

        <div className={"user-profile-theme-row-dropdown"}>
          <Dropdown overlay={this.menu} disabled={this.props.disabled}>
            {this.icon()}
          </Dropdown>
        </div>

        <EditModal
          handleCancel={this.handleCancel}
          visible={this.state.visible}
          handleOk={this.handleOk}
          handleCancel={this.handleCancel}
          editCurrentTheme={this.props.editCurrentTheme}
          index={this.props.index}
          name={this.props.name}
          theme={this.props.theme}
          username={this.props.username}
        />
      </div>
    );
  }

  setAsCurrentTheme = () => {
    if (this.props.canEdit) {
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
}

const mapDispatchToProps = {
  editUser: data => editUser(data)
};

export default connect(
  null,
  mapDispatchToProps
)(UserProfileThemeRow);
