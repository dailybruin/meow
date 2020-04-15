import cloneDeep from "lodash.clonedeep";
import React from "react";
import "./styling.css";
import { Icon, Modal, Button, Tooltip } from "antd";
import { SketchPicker } from "react-color";

class UserProfileThemeModal extends React.PureComponent {
  tooltipMessage = [
    "header, primary side-bar color",
    "secondary side-bar color",
    "header font-color",
    "sidebar font-color",
    "new meow button"
  ];

  state = {
    colors: [],
    current: 0,
    name: "",
    isError: false,
    errorMessage: ""
  };

  componentDidMount() {
    const {
      primary,
      secondary,
      primary_font_color,
      secondary_font_color,
      tertiary
    } = this.props.theme;

    this.setState(prevState => ({
      ...prevState,
      colors: [primary, secondary, primary_font_color, secondary_font_color, tertiary],
      name: this.props.theme.name
    }));
  }

  handleChangeComplete = color => {
    this.setState(prevState => {
      const newColors = cloneDeep(prevState.colors);
      newColors[prevState.current] = color.hex;
      return { colors: newColors };
    });
  };

  handleColorDotClick = index => {
    this.setState({ current: index });
  };

  handleInputChange = e => {
    e.preventDefault();
    this.setState({
      name: e.target.value,
      isError: false,
      errorMessage: ""
    });
  };

  renderErrorMessage = () => {
    if (this.state.isError) {
      return <p style={{ color: "red", margin: 0 }}>{this.state.errorMessage}</p>;
    }
  };

  renderColorDots = () => {
    let colorDots = [];
    this.state.colors.map((item, index) => {
      index === this.state.current
        ? colorDots.push(
            <Tooltip title={this.tooltipMessage[index]}>
              <button
                className={"user-profile-theme-row-modal-color-dot"}
                style={{
                  backgroundColor: item,
                  border: "5px solid #000"
                }}
              />
            </Tooltip>
          )
        : colorDots.push(
            <Tooltip title={this.tooltipMessage[index]}>
              <button
                className={"user-profile-theme-row-modal-color-dot"}
                style={{
                  backgroundColor: item
                }}
                onClick={() => this.handleColorDotClick(index)}
              />
            </Tooltip>
          );
    });
    return colorDots;
  };

  render() {
    return (
      <Modal
        afterClose={this.props.unmountModal}
        destroyOnClose={true}
        visible={this.props.visible}
        title={null}
        onOk={this.props.handleOk}
        onCancel={this.props.handleCancel}
        footer={null}
        className={"user-profile-theme-row-modal"}
      >
        <div className={"user-profile-theme-row-modal-items"}>
          <input
            className={"user-profile-theme-row-modal-input"}
            placeholder="insert name here"
            onChange={this.handleInputChange}
            value={this.state.name}
          />
          {this.renderErrorMessage()}
        </div>
        <div className={"user-profile-theme-row-modal-items"}>
          <div className={"user-profile-theme-row-modal-color-dots-container"}>
            {this.renderColorDots()}
          </div>
        </div>

        <div className={"user-profile-theme-row-modal-items"}>
          <SketchPicker
            color={this.state.colors[this.state.current]}
            disableAlpha={true}
            className={"user-profile-theme-row-modal-colorpicker"}
            onChangeComplete={this.handleChangeComplete}
            closable={true}
          />
        </div>

        <div className={"user-profile-theme-row-modal-items"}>
          <Button
            className={"user-profile-theme-row-modal-create-new-theme"}
            onClick={() => {
              const { colors, name } = this.state;
              let themeObject = {
                oldname: this.props.theme.name,
                name: name,
                primary: colors[0],
                secondary: colors[1],
                primary_font_color: colors[2],
                secondary_font_color: colors[3],
                tertiary: colors[4],
                id: this.props.theme.id,
                author: this.props.username
              };
              this.props.onSubmit(themeObject).then(d => {
                if (d.status === 200) {
                  delete themeObject.oldname;
                  themeObject.id = d.data;
                  this.props.onSuccess(themeObject);
                  this.props.handleCancel();
                } else {
                  this.setState({
                    isError: true,
                    errorMessage: d.data
                  });
                }
              });
            }}
          >
            <Icon type="plus" />
            {this.props.buttonText}
          </Button>
        </div>

        <div className={"user-profile-theme-row-modal-items"}>
          <button
            className={"user-profile-theme-row-modal-cancel"}
            onClick={this.props.handleCancel}
          >
            cancel
          </button>
        </div>
      </Modal>
    );
  }
}

export default UserProfileThemeModal;
