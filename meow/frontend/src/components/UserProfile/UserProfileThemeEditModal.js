import React from "react";
import "./styling.css";
import { Icon, Modal, Button } from "antd";
import { SketchPicker } from "react-color";

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
    name: this.props.name
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
        </div>

        <div className={"user-profile-theme-row-modal-items"}>
          <div className={"user-profile-theme-row-modal-color-dots-container"}>
            {this.state.colors.map((item, index) => {
              if (item.empty) {
                console.log(this.state.name);
                if (index === this.state.current) {
                  return (
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
                  );
                } else {
                  return (
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
                  );
                }
              } else {
                console.log(this.state.name);
                if (index === this.state.current) {
                  return (
                    <button
                      className={"user-profile-theme-row-modal-color-dot"}
                      style={{
                        backgroundColor: item.color,
                        border: "5px solid #000"
                      }}
                    />
                  );
                } else {
                  return (
                    <button
                      className={"user-profile-theme-row-modal-color-dot"}
                      style={{
                        backgroundColor: item.color
                      }}
                      onClick={() => this.handleColorDotClick(index)}
                    />
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
              var themetoEdit = {
                oldname: this.oldname,
                name: this.state.name,
                primary: this.state.colors[0].color,
                secondary: this.state.colors[1].color,
                primary_font_color: this.state.colors[2].color,
                secondary_font_color: this.state.colors[3].color,
                tertiary: this.state.colors[4].color,
                id: -1, //id is not used here, database id is not here yet
                author: this.props.username
              };
              console.log("editing");
              console.log(themetoEdit);
              this.props.editCurrentTheme(themetoEdit, this.props.index);
              this.props.handleCancel();
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
