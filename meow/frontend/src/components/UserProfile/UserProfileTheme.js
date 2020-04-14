import React from "react";
import UserProfileThemeRow from "./UserProfileThemeRow";
import UserProfileThemeModal from "./UserProfileThemeModal";
import UserProfileAdditionalThemeRow from "./UserProfileAdditionalThemeRow";
import "./styling.css";
import { Icon } from "antd";
import { themeAdd } from "../../services/api.js";

class UserProfileTheme extends React.PureComponent {
  defaultTheme = {
    name: "",
    id: -1,
    primary: "#FFFFFF",
    secondary: "#FFFFFF",
    primary_font_color: "#FFFFFF",
    secondary_font_color: "#FFFFFF",
    tertiary: "#FFFFFF",
    favorite_count: 0,
    author: this.props.username
  };

  state = {
    visible: false,
    seeMore: false,
    mounted: false,
    animateUnmount: false
  };

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

  unmountAdditionalThemes = () => {
    this.setState({ animateUnmount: false, seeMore: false });
  };

  unmountModal = e => {
    this.setState({
      mounted: false
    });
  };

  render() {
    let seeMore = [];
    if (this.state.seeMore === false) {
      seeMore.push(
        <div className="user-profile-theme-see-more">
          <button
            onClick={() => {
              this.setState({ seeMore: true });
              this.props.loadAdditionalThemes();
            }}
            style={{ animation: "fadeIn 1s" }}
          >
            see more...
          </button>
        </div>
      );
    } else {
      this.props.additionalThemes.map(item => {
        let activeTheme = item.name === this.props.selected_theme.name;
        let starred = item.hasOwnProperty("starred") ? true : false;
        console.log(`starred is ${starred}`);
        seeMore.push(
          <UserProfileAdditionalThemeRow
            starred={starred}
            clickHandler={starred ? this.props.unstarFavoriteTheme : this.props.starFavoriteTheme}
            active={activeTheme}
            theme={item}
            canEdit={this.props.canEdit}
            themeChanger={this.props.themeChanger}
            animateUnmount={this.state.animateUnmount}
            unmountAdditionalThemes={this.unmountAdditionalThemes}
          />
        );
      });
      seeMore.push(
        <div className="user-profile-theme-see-more">
          <button
            onClick={() => {
              this.setState({ animateUnmount: true });
            }}
            style={{ animation: `${this.state.animateUnmount ? "slideout" : "slidein"} 1s` }}
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
              let disabled = false;
              if (index === 0 || index === 1) {
                disabled = true;
              }
              console.log(value);
              return (
                <UserProfileThemeRow
                  canEdit={this.props.canEdit}
                  key={index}
                  theme={value}
                  active={active}
                  editCurrentTheme={this.props.editCurrentTheme}
                  index={index}
                  name={value.name}
                  empty={false}
                  username={this.props.username}
                  deleteTheme={this.props.deleteTheme}
                  disabled={disabled}
                  themeChanger={this.props.themeChanger}
                />
              );
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
          <div style={{ marginTop: 12 }}>{seeMore}</div>
        </div>
        {this.state.mounted === true ? (
          <UserProfileThemeModal
            handleCancel={this.handleCancel}
            handleOk={this.handleOk}
            visible={this.state.visible}
            unmountModal={this.unmountModal}
            theme={this.defaultTheme}
            onSubmit={themeAdd}
            username={this.props.username}
            onSuccess={this.props.addNewTheme}
            buttonText={"create theme"}
          />
        ) : null}
      </div>
    );
  }
}

// //it is important that this component
// const mapStateToProps = (state) => {
//   return { theme: state.default.user.theme };
// }

export default UserProfileTheme;
