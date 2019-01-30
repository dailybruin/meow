import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { Button } from "antd";

import { createPost } from "../../actions/post";
import EditForm from "./EditForm";

import { getPost } from "../../actions/post";

class EditPost extends React.Component {
  state = {
    fields: {
      slug: "",
      url: "",
      post_facebook: "",
      post_twitter: "",
      copy_edited: false
    }
  };

  componentDidMount() {
    const { postId } = this.props.match.params;

    if (postId) {
      this.props.getPost(postId).then(res => {
        console.log(res);
        this.setState({
          fields: {
            slug: {
              value: res.slug
            },
            url: {
              value: res.story_url
            },
            post_facebook: {
              value: res.post_facebook
            },
            post_twitter: {
              value: res.post_twitter
            },
            copy_edited: {
              value: res.pub_ready_copy
            }
          }
        });
      });
    }
  }

  nevermind = () => {
    this.props.history.push("/");
  };

  handleFormChange = changedFields => {
    this.setState(({ fields }) => ({
      fields: { ...fields, ...changedFields }
    }));
  };

  handleOk = () => {
    const data = {
      slug: this.state.fields.slug.value,
      story_url: this.state.fields.url.value,
      post_facebook: this.state.fields.post_facebook.value,
      post_twitter: this.state.fields.post_twitter.value,
      pub_ready_copy: this.state.fields.copy_edited.value
    };

    this.props.createPost(data).then(data => {
      if (data) {
        this.props.history.push("/");
      } else {
      }
    });
  };

  render() {
    const fields = this.state.fields;

    return (
      <div
        style={{
          border: "3px solid black",
          borderRadius: "25px",
          backgroundColor: "white",
          padding: "2.2em 2em"
        }}
      >
        <EditForm {...fields} onChange={this.handleFormChange} />
        <div
          style={{
            display: "flex",
            justifyContent: "space-between"
          }}
        >
          <Button
            style={{
              backgroundColor: "#CB0000",
              borderRadius: "20px",
              fontSize: "2em",
              color: "white"
            }}
            size="large"
            onClick={this.nevermind}
          >
            nevermind
          </Button>
          <Button
            style={{
              backgroundColor: "#3980bf",
              borderRadius: "20px",
              fontSize: "2em"
            }}
            type="primary"
            size="large"
            onClick={this.handleOk}
          >
            save
          </Button>
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = {
  createPost,
  getPost: postId => getPost(postId)
};

export default withRouter(
  connect(
    null,
    mapDispatchToProps
  )(EditPost)
);
