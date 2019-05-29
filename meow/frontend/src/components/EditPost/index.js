import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import { Layout } from "antd";

import EditSidebar from "./Sidebar";
import EditContent from "./Content";
import Sidebar from "../Sidebar";

import { getMe } from "../../services/api";

import { getPost, editPost, savePost, sendPostNow } from "../../actions/post";
import { alertError } from "../../actions/alert";

import { loadSections } from "../../actions/section";

const { Content } = Layout;
const contentStyles = { position: "relative", transform: "translateY(-30px)" };

class EditPost extends React.Component {
  state = {
    sections: this.props.sections
  };

  componentDidMount() {
    const { postId } = this.props.match.params;

    getMe().then(res => {
      console.log(res.data);
      this.setState({
        user_groups: res.data.groups
      });
    });

    if (postId) {
      this.props.getPost(postId).then(data => {
        this.setState({
          ...data,
          pub_ready_copy_old: data.pub_ready_copy,
          pub_ready_online_old: data.pub_ready_online
        });
      });
      this.props.loadSections();
    } else {
      this.setState({
        ...this.props.defaultData
      });
    }
  }

  editField = changedField => {
    this.setState({
      ...changedField
    });
  };

  savePost = () => {
    const { postId } = this.props.match.params;

    this.props
      .savePost(postId, {
        slug: this.state.slug,
        story_url: this.state.story_url,
        section: this.state.section,
        pub_date: this.state.pub_date,
        pub_time: this.state.pub_time,
        pub_ready_copy: false,
        pub_ready_online: false,
        post_facebook: this.state.post_facebook,
        post_twitter: this.state.post_twitter,
        post_instagram: this.state.post_instagram,
        post_notes: this.state.post_notes,
        pub_ready_copy: this.state.pub_ready_copy,
        pub_ready_online: this.state.pub_ready_online
      })
      .then(data => {
        if (data) {
          this.props.history.push("/");
        } else {
        }
      });
  };

  deletePost = () => {
    const { postId } = this.props.match.params;

    this.props.savePost(postId, { is_active: false }).then(data => {
      if (data) {
        this.props.history.push("/");
      } else {
      }
    });
  };

  sendNow = () => {
    const { postId } = this.props.match.params;
    this.props
      .savePost(postId, {
        slug: this.state.slug,
        story_url: this.state.story_url,
        section: this.state.section,
        pub_date: this.state.pub_date,
        pub_time: this.state.pub_time,
        pub_ready_copy: false,
        pub_ready_online: false,
        post_facebook: this.state.post_facebook,
        post_twitter: this.state.post_twitter,
        post_instagram: this.state.post_instagram,
        post_notes: this.state.post_notes,
        pub_ready_copy: this.state.pub_ready_copy,
        pub_ready_online: this.state.pub_ready_online
      })
      .then(data => {
        if (data) {
          this.props.sendPostNow(postId).then(response => {
            console.log(response);
            if (response.error) {
            } else {
              //using double == because status might be a string.
              this.props.history.push("/");
            }
          });
        }
      });
  };

  render() {
    return (
      <React.Fragment>
        <Sidebar>
          <EditSidebar
            {...this.state}
            editPost={this.editField}
            delete={this.deletePost.bind(this)}
            sendNow={this.sendNow}
          />
        </Sidebar>
        <Content style={contentStyles}>
          <EditContent
            {...this.state}
            editPost={this.editField}
            savePost={this.savePost.bind(this)}
            user_groups={this.state.user_groups}
          />
        </Content>
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => ({
  sections: state.default.section.sections
});

const mapDispatchToProps = {
  getPost: postId => getPost(postId),
  loadSections,
  editPost: data => editPost(data),
  savePost: (postId, postData) => savePost(postId, postData),
  sendPostNow: postId => sendPostNow(postId)
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(EditPost)
);
