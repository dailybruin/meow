import React from "react";
import { connect } from "react-redux";

import { Button, Input } from "antd";

import { editUser } from "../../actions/user";

const { TextArea } = Input;

const BIO_MAX_LENGTH = 512;

class UserProfileBio extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isEditing: false,
      value: this.props.bio
    };
  }

  allowEditing = () => {
    this.setState({
      isEditing: true
    });
  };

  saveBio = () => {
    this.props.editUser({
      bio: this.state.value
    });

    this.setState({
      isEditing: false
    });
  };

  displayEditButton = () => {
    if (this.props.canEdit && this.state.isEditing) {
      return (
        <Button onClick={this.saveBio} type="danger" icon="save" size="large" shape="round">
          Save Bio
        </Button>
      );
    } else if (this.props.canEdit) {
      return (
        <Button onClick={this.allowEditing} type="primary" icon="edit" size="large" shape="round">
          Edit Bio
        </Button>
      );
    }
  };

  render() {
    let defaultBio = "";
    if (this.props.canEdit && !this.props.bio) {
      // Is IS current user
      // And they need to set a bio
      defaultBio = "You have no bio. meow :(";
    } else if (!this.props.bio && !this.props.canEdit) {
      // This is someone else's empty bio
      defaultBio = "They have no bio. meow :(";
    }

    let val;
    if (this.state.value && !this.state.isEditing) {
      val = this.props.bio;
    } else if (this.state.value && this.state.isEditing) {
      val = this.state.value;
    } else if (!this.state.value) {
      val = defaultBio;
    }

    return (
      <div className="user-profile-bio-container">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between"
          }}
        >
          <h2 className="user-profile-bio-header">about</h2>
          {this.displayEditButton()}
        </div>
        {this.state.isEditing ? (
          <div>
            <TextArea
              onChange={v => {
                console.log(v.target.value);
                this.setState({ value: v.target.value });
              }}
              value={this.state.value}
              maxLength={BIO_MAX_LENGTH}
            />
            <span style={{ color: this.state.value.length == BIO_MAX_LENGTH ? "red" : "black" }}>
              {this.state.value.length} / {BIO_MAX_LENGTH}
            </span>
          </div>
        ) : (
          <p className="user-profile-bio-paragraph">{this.state.value || defaultBio}</p>
        )}
      </div>
    );
  }
}

const mapDispatchToProps = {
  editUser: data => editUser(data)
};

export default connect(
  null,
  mapDispatchToProps
)(UserProfileBio);
