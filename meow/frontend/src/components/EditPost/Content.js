import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { Button, Row, Col } from "antd";

import EditForm from "./EditForm";

class EditPost extends React.Component {
  nevermind = () => {
    this.props.history.push("/");
  };

  handleFormChange = changedFields => {
    this.props.editPost(changedFields);
  };

  handleOk = () => {
    this.props.savePost();
  };

  render() {
    return (
      <div
        style={{
          border: "3px solid black",
          borderRadius: "25px",
          backgroundColor: "white",
          padding: "2.2em 2em"
        }}
      >
        <EditForm {...this.props} onChange={this.handleFormChange} />
        <Row
          style={{
            marginBottom: "1.2em"
          }}
        >
          <Col span={12}>
            {this.props.pub_ready_copy_user !== null
              ? `Copy-edited by: ${this.props.pub_ready_copy_user}`
              : `Not copy-edited`}
          </Col>
          <Col span={12}>
            {this.props.pub_ready_online_user !== null
              ? `Marked ready by: ${this.props.pub_ready_online_user}`
              : `Not ready to send`}
          </Col>
        </Row>
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

const mapStateToProps = state => ({
  slug: state.default.post.slug,
  story_url: state.default.post.story_url,
  post_facebook: state.default.post.post_facebook,
  post_twitter: state.default.post.post_twitter,
  pub_ready_copy: state.default.post.pub_ready_copy,
  pub_ready_online: state.default.post.pub_ready_online,
  pub_ready_copy_user: state.default.post.pub_ready_copy_user,
  pub_ready_online_user: state.default.post.pub_ready_online_user,
  section: state.default.post.section,
  sections: state.default.section.sections
});

// const mapDispatchToProps = {
//   getPost: postId => getPost(postId),
//   editPost: data => editPost(data),
//   savePost: postId => savePost(postId)
// };

export default withRouter(EditPost);
