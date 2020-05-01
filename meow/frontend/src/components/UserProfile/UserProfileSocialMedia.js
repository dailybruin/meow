import React from "react";
import "./styling.css";

import { Button, Input } from "antd";

import { editUser } from "../../actions/user";
import { connect } from "react-redux";

//TODO: refactor this and the bio into one editable component or something
//cuz they share a lot of code (mostly bc I copy pasted it but heh)

const SOCIAL_MEDIA_STUFF = {
  instagram: {
    src: "/static/social_media/instagram.png",
    alt: "Instagram logo"
  },
  twitter: {
    src: "/static/social_media/twitter.png",
    alt: "Twitter logo"
  }
};

class UserProfileSocialMedia extends React.PureComponent {
  ///slightly hackish but in order to specify the type of
  //social media link, one past pass medium="instagram"
  //or medium="twitter"
  constructor(props) {
    super(props);
    this.state = {
      isEditing: false,
      value: props.href
    };
  }

  allowEditing = () => {
    this.setState({
      isEditing: true
    });
  };

  stopEditingAndReturnChanges = () => {
    let tmp = {};
    if (this.props.href != this.state.value) {
      //basically tmp = {instagram: this.state.value} or tmp = {twitter: this.state.value}
      tmp[this.props.medium] = this.state.value;
    }

    this.setState({
      isEditing: false
    });
    return tmp;
  };

  // displayEditButton = () => {
  //   if (this.props.canEdit && this.state.isEditing) {
  //     return (
  //       <Button onClick={this.saveBio} type="danger" icon="save" size="large" shape="round">
  //         Save Bio
  //       </Button>
  //     );
  //   } else if (this.props.canEdit) {
  //     return (
  //       <Button onClick={this.allowEditing} type="primary" icon="edit" size="large" shape="round">
  //         Edit Bio
  //       </Button>
  //     );
  //   }
  // };

  render() {
    let defaultLink = "";
    if (this.props.canEdit && !this.props.href) {
      // Is IS current user
      // And they need to set a bio
      defaultLink = "You have no bio. meow :(";
    } else if (!this.props.href && !this.props.canEdit) {
      // This is someone else's empty bio
      defaultLink = "They have no bio. meow :(";
    }

    let val;
    if (this.state.value && !this.state.isEditing) {
      val = this.props.href;
    } else if (this.state.value && this.state.isEditing) {
      val = this.state.value;
    } else if (!this.state.value) {
      val = defaultLink;
    }

    if (this.state.isEditing) {
      return (
        <div className="user-profile-social-media-inline">
          <img
            src={SOCIAL_MEDIA_STUFF[this.props.medium].src}
            className="user-profile-social-media-bubble"
            alt={SOCIAL_MEDIA_STUFF[this.props.medium].alt}
          />
          <Input
            onChange={v => {
              this.setState({ value: v.target.value });
            }}
            value={this.state.value}
          />
        </div>
      );
    } else if (this.props.canEdit) {
      //case where we can edit but we aren't editing right now
      //we want to display the links next to the image
      return (
        <div>
          <img
            src={SOCIAL_MEDIA_STUFF[this.props.medium].src}
            className="user-profile-social-media-bubble"
            alt={SOCIAL_MEDIA_STUFF[this.props.medium].alt}
          />
          <span className="user-profile-social-media-url">{this.props.href}</span>
        </div>
      );
    } else {
      return (
        <a className="user-profile-social-media" href={this.props.href}>
          <img
            src={SOCIAL_MEDIA_STUFF[this.props.medium].src}
            className="user-profile-social-media-bubble"
            alt={SOCIAL_MEDIA_STUFF[this.props.medium].alt}
          />
        </a>
      );
    }
  }
}

export default UserProfileSocialMedia;
