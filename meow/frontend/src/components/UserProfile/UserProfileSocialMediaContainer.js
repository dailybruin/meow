import React from "react";
import "./styling.css";

import { Button } from "antd";
import UserProfileSocialMedia from "./UserProfileSocialMedia";
import { editUser } from "../../actions/user";
import { connect } from "react-redux";

class UserProfileSocialMediaContainer extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isEditing: false,
      instagram: props.instagram,
      twitter: props.twitter
    };
  }

  allowEditing = () => {
    this.instagram_component.allowEditing();
    this.twitter_component.allowEditing();
    this.setState({
      isEditing: true
    });
  };

  //TODo: find a better way to update this components state when its children
  // save maybe context?
  saveLinks = () => {
    let changes = {
      ...this.instagram_component.stopEditingAndReturnChanges(),
      ...this.twitter_component.stopEditingAndReturnChanges()
    };
    this.props.editUser(changes);
    this.setState({
      ...changes,
      isEditing: false
    });
  };

  displayEditButton = () => {
    //this will only be called if canEdit == true
    if (this.state.isEditing) {
      return (
        <Button onClick={this.saveLinks} type="danger" icon="save" size="large" shape="round">
          Save Social Media Links
        </Button>
      );
    } else {
      return (
        <Button onClick={this.allowEditing} type="primary" icon="edit" size="large" shape="round">
          Edit Social Media Links
        </Button>
      );
    }
  };

  render() {
    if (this.props.canEdit) {
      return (
        <div className="user-profile-social-media-container">
          <div>
            <UserProfileSocialMedia
              ref={self => {
                this.instagram_component = self;
              }}
              href={this.state.instagram}
              medium="instagram"
              canEdit={this.props.canEdit}
            />
            <UserProfileSocialMedia
              ref={self => {
                this.twitter_component = self;
              }}
              href={this.state.twitter}
              medium="twitter"
              canEdit={this.props.canEdit}
            />
          </div>
          <div className="user-profile-social-media-container-edit-button">
            {this.displayEditButton()}
          </div>
        </div>
      );
    } else {
      return (
        <li className="user-profile-basic-info-form-group">
          <UserProfileSocialMedia
            href={this.state.instagram}
            medium="instagram"
            canEdit={this.props.canEdit}
          />
          <UserProfileSocialMedia
            href={this.state.twitter}
            medium="twitter"
            canEdit={this.props.canEdit}
          />
        </li>
      );
    }
  }
}

const mapDispatchToProps = {
  editUser: data => editUser(data)
};

export default connect(
  null,
  mapDispatchToProps
)(UserProfileSocialMediaContainer);
