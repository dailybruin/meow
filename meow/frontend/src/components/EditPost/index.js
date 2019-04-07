import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import { Layout } from "antd";

import EditSidebar from "./Sidebar";
import EditContent from "./Content";
import Sidebar from "../Sidebar";

import { getPost, editPost, savePost } from "../../actions/post";
import { loadSections } from "../../actions/section";

const { Content } = Layout;
const contentStyles = { position: "relative", transform: "translateY(-30px)" };

class EditPost extends React.Component {
  state = {
    sections: this.props.sections
  };

  componentDidMount() {
    const { postId } = this.props.match.params;

    if (postId) {
      this.props.getPost(postId).then(data => {
        this.setState({
          ...data
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
        post_twitter: this.state.post_twitter
      })
      .then(data => {
        if (data) {
          this.props.history.push("/");
        } else {
        }
      });
  };

  render() {
    return (
      <React.Fragment>
        <Sidebar>
          <EditSidebar {...this.state} editPost={this.editField} />
        </Sidebar>
        <Content style={contentStyles}>
          <EditContent {...this.state} editPost={this.editField} save={this.savePost.bind(this)} />
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
  savePost: (postId, postData) => savePost(postId, postData)
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(EditPost)
);
