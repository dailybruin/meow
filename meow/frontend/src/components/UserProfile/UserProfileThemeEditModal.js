import React from "react";
import "./styling.css";
import { Icon, Modal, Button, Tooltip } from "antd";
import { SketchPicker } from "react-color";
import { themeEdit } from "../../services/api.js";

class EditModal extends React.Component {
  state = {
    colors: [
      { color: this.props.theme.primary, empty: false },
      { color: this.props.theme.secondary, empty: false },
      { color: this.props.theme.primary_font_color, empty: false },
      { color: this.props.theme.secondary_font_color, empty: false },
      { color: this.props.theme.tertiary, empty: false }
    ],
    current: 0, //this is the index of the selection
    name: this.props.name,
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
  oldname = this.stateCopy.name;
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
      console.log(item.color);
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
    console.log(this.state.current);
    console.log(this.stateCopy);
    this.stateCopy.current = this.state.current;
    this.stateCopy.colors[this.state.current].color = color.hex;
    this.stateCopy.colors[this.state.current].empty = false;
    this.setState(this.stateCopy);
  };

  handleColorDotClick = index => {
    this.setState({ current: index });
    console.log(this.state.current);
  };

  handleInputChange = e => {
    e.preventDefault();
    this.stateCopy.name = e.target.value;
    this.setState(this.stateCopy);
    console.log(this.state.name);
    console.log(this.props.theme);
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
            onChange={this.handleInputChange}
            value={this.state.name}
          />
          {this.errorMesage()}
        </div>
        <div className={"user-profile-theme-row-modal-items"}>
          <div className={"user-profile-theme-row-modal-color-dots-container"}>
            {this.state.colors.map((item, index) => {
              if (item.empty) {
                console.log(this.state.name);
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
                console.log(this.state.name);
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
              let themetoEdit = {
                oldname: this.oldname,
                name: this.state.name,
                primary: this.state.colors[0].color,
                secondary: this.state.colors[1].color,
                primary_font_color: this.state.colors[2].color,
                secondary_font_color: this.state.colors[3].color,
                tertiary: this.state.colors[4].color,
                id: this.props.theme.id,
                author: this.props.username
              };
              themeEdit(themetoEdit).then(d => {
                console.log(d);
                if (d.status === 200) {
                  let themetoModify = {
                    name: this.state.name,
                    primary: this.state.colors[0].color,
                    secondary: this.state.colors[1].color,
                    primary_font_color: this.state.colors[2].color,
                    secondary_font_color: this.state.colors[3].color,
                    tertiary: this.state.colors[4].color,
                    id: this.props.theme.id,
                    author: this.props.username
                  };
                  this.props.editCurrentTheme(themetoModify, this.props.index);
                  this.props.handleCancel();
                } else {
                  console.log(d.data);
                  let stateDuplicate = Object.assign({}, this.state);
                  stateDuplicate.error = true;
                  stateDuplicate.error_msg = d.data;
                  this.setState(stateDuplicate);
                }
              });
            }}
          >
            <Icon type="plus" />
            save colors
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

export default EditModal;
