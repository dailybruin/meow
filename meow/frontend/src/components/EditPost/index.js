import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import { createPost } from "../../actions/post";
import EditForm from "./EditForm";
import { Button } from "antd";

class EditPost extends React.Component {
  state = {
    fields: {
      slug: "",
      url: "",
      post_facebook: "",
      post_twitter: ""
    }
  };

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
      post_twitter: this.state.fields.post_twitter.value
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
              fontFamily: '"Varela Round", sans-serif',
              color: "white"
            }}
            size="large"
            onClick={this.nevermind}
          >
            nevermind
          </Button>
          <Button
            style={{
              backgroundColor: "#1A9AE0",
              borderRadius: "20px",
              fontSize: "2em",
              fontFamily: '"Varela Round", sans-serif'
            }}
            type="primary"
            size="large"
            onClick={this.handleOk}
          >
            create
          </Button>
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = {
  createPost
};

export default withRouter(
  connect(
    null,
    mapDispatchToProps
  )(EditPost)
);
