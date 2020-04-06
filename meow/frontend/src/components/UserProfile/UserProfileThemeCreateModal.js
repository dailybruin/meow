import React from "react";
import "./styling.css";
import { Icon, Modal, Button, Tooltip } from "antd";
import { SketchPicker } from "react-color";
import { themeAdd } from "../../services/api.js";

class CreateModal extends React.Component {
  state = {
    colors: [
      { color: "#FFFFFF", empty: true },
      { color: "#FFFFFF", empty: true },
      { color: "#FFFFFF", empty: true },
      { color: "#FFFFFF", empty: true },
      { color: "#FFFFFF", empty: true }
    ],
    current: 0, //this is the index of the selection
    name: "",
    error: false,
    error_msg: "",
    tooltip_msg: [
      "header, primary side-bar color",
      "secondary side-bar color",
      "header font-color",
      "sidebar font-color",
      "new meow button"
    ]
  };

  stateCopy = Object.assign({}, this.state);
  resetState = {
    colors: [
      { color: "#FFFFFF", empty: true },
      { color: "#FFFFFF", empty: true },
      { color: "#FFFFFF", empty: true },
      { color: "#FFFFFF", empty: true },
      { color: "#FFFFFF", empty: true }
    ],
    current: 0, //this is the index of the selection
    name: "",
    error: false,
    error_msg: "",
    tooltip_msg: [
      "header, primary side-bar color",
      "secondary side-bar color",
      "header font-color",
      "sidebar font-color",
      "new meow button"
    ]
  };

  items = this.stateCopy.colors.map((item, index) => {
    if (item.empty) {
      return (
        <button
          className={"user-profile-theme-row-modal-color-dot"}
          style={{
            backgroundColor: item.color
          }}
          onClick={() => this.handleColorDotClick(index)}
        >
          <Icon type="plus-circle" />
        </button>
      );
    } else {
      return (
        <button
          className={"user-profile-theme-row-modal-color-dot"}
          style={{
            backgroundColor: item.color
          }}
        />
      );
    }
  });

  handleChangeComplete = color => {
    this.stateCopy.current = this.state.current;
    this.stateCopy.colors[this.state.current].color = color.hex;
    this.stateCopy.colors[this.state.current].empty = false;
    this.setState(this.stateCopy);
  };

  handleColorDotClick = index => {
    this.setState({ current: index });
  };

  handleInputChange = e => {
    e.preventDefault();
    this.stateCopy.name = e.target.value;
    this.setState(this.stateCopy);
  };

  errorMesage = () => {
    if (this.state.error) {
      return <p style={{ color: "red", margin: 0 }}>{this.state.error_msg}</p>;
    }
  };

  render() {
    return (
      <Modal
        visible={this.props.visible}
        title={null}
        onOk={this.props.handleOk}
        onCancel={this.props.handleCancel}
        footer={null}
        closable={false}
        className={"user-profile-theme-row-modal"}
      >
        <div className={"user-profile-theme-row-modal-items"}>
          <input
            className={"user-profile-theme-row-modal-input"}
            placeholder="insert name here"
            value={this.state.name}
            onChange={this.handleInputChange}
          />
          {this.errorMesage()}
        </div>

        <div className={"user-profile-theme-row-modal-items"}>
          <div className={"user-profile-theme-row-modal-color-dots-container"}>
            {this.state.colors.map((item, index) => {
              if (item.empty) {
                if (index === this.state.current) {
                  return (
                    <Tooltip title={this.state.tooltip_msg[index]}>
                      <button
                        className={"user-profile-theme-row-modal-color-dot"}
                        style={{
                          backgroundColor: item.color,
                          border: "5px solid #000"
                        }}
                        onClick={() => this.handleColorDotClick(index)}
                      >
                        <Icon
                          className={"user-profile-theme-row-modal-color-dot-plusicon"}
                          type="plus"
                        />
                      </button>
                    </Tooltip>
                  );
                } else {
                  return (
                    <Tooltip title={this.state.tooltip_msg[index]}>
                      <button
                        className={"user-profile-theme-row-modal-color-dot"}
                        style={{
                          backgroundColor: item.color
                        }}
                        onClick={() => this.handleColorDotClick(index)}
                      >
                        <Icon
                          className={"user-profile-theme-row-modal-color-dot-plusicon"}
                          type="plus"
                        />
                      </button>
                    </Tooltip>
                  );
                }
              } else {
                if (index === this.state.current) {
                  return (
                    <Tooltip title={this.state.tooltip_msg[index]}>
                      <button
                        className={"user-profile-theme-row-modal-color-dot"}
                        style={{
                          backgroundColor: item.color,
                          border: "5px solid #000"
                        }}
                      />
                    </Tooltip>
                  );
                } else {
                  return (
                    <Tooltip title={this.state.tooltip_msg[index]}>
                      <button
                        className={"user-profile-theme-row-modal-color-dot"}
                        style={{
                          backgroundColor: item.color
                        }}
                        onClick={() => this.handleColorDotClick(index)}
                      />
                    </Tooltip>
                  );
                }
              }
            })}
          </div>
        </div>

        <div className={"user-profile-theme-row-modal-items"}>
          <SketchPicker
            color={this.state.colors[this.state.current].color}
            disableAlpha={true}
            className={"user-profile-theme-row-modal-colorpicker"}
            onChangeComplete={this.handleChangeComplete}
          />
        </div>

        <div className={"user-profile-theme-row-modal-items"}>
          <Button
            className={"user-profile-theme-row-modal-create-new-theme"}
            onClick={() => {
              var themetoAdd = {
                name: this.state.name,
                primary: this.state.colors[0].color,
                secondary: this.state.colors[1].color,
                primary_font_color: this.state.colors[2].color,
                secondary_font_color: this.state.colors[3].color,
                tertiary: this.state.colors[4].color,
                author: this.props.username,
                id: -1
              };
              themeAdd(themetoAdd).then(d => {
                if (d.status === 200) {
                  themetoAdd.id = d.data;
                  this.props.addNewTheme(themetoAdd);
                  this.props.handleCancel();
                  this.setState(this.resetState);
                  this.stateCopy = {
                    colors: [
                      { color: "#FFFFFF", empty: true },
                      { color: "#FFFFFF", empty: true },
                      { color: "#FFFFFF", empty: true },
                      { color: "#FFFFFF", empty: true },
                      { color: "#FFFFFF", empty: true }
                    ],
                    current: 0, //this is the index of the selection
                    name: "",
                    id: -1,
                    error: false,
                    error_msg: "",
                    tooltip_msg: [
                      "header, primary side-bar color",
                      "secondary side-bar color",
                      "header font-color",
                      "sidebar font-color",
                      "new meow button"
                    ]
                  };
                } else {
                  let stateDuplicate = Object.assign({}, this.state);
                  stateDuplicate.error = true;
                  stateDuplicate.error_msg = d.data;
                  this.setState(stateDuplicate);
                }
              });
            }}
          >
            <Icon type="plus" />
            create new theme
          </Button>
        </div>

        <div className={"user-profile-theme-row-modal-items"}>
          <button
            className={"user-profile-theme-row-modal-cancel"}
            onClick={() => {
              this.props.handleCancel();
              this.setState({
                ...this.state,
                error: false,
                error_msg: ""
              });
            }}
          >
            cancel
          </button>
        </div>
      </Modal>
    );
  }
}

export default CreateModal;
