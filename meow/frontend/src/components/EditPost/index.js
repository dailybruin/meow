import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { Layout } from "antd";

import EditSidebar from "./Sidebar";
import EditContent from "./Content";
import Sidebar from "../Sidebar";
import moment from "moment";
const dateMatcher = /\?date=(\d{4})\-(\d{2})\-(\d{2})/;

import { getMe } from "../../services/api";
import { getPost, editPost, savePost, sendPostNow } from "../../actions/post";
import { loadSections } from "../../actions/section";
import config from "../../config";

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
      //console.log(this.props.location);
      if (this.props.location.search) {
        //means that ?date=2019-05-17 is appended to the url

        let YMDArray = dateMatcher.exec(this.props.location.search);
        //console.log(YMDArray);
        if (YMDArray) {
          YMDArray.shift();
          let YMD = {
            year: YMDArray[0],
            month: YMDArray[1],
            day: YMDArray[2]
          };
          let dateString = `${YMD.year}-${YMD.month}-${YMD.day}`;
          console.log(moment(dateString, "YYYY-MM-DD", true));
          if (moment(dateString, "YYYY-MM-DD", true)._isValid) {
            this.setState({
              pub_date: dateString
            });
          }
        }
      }
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
    this.props.sendPostNow(postId).then(status => {
      if (status == 200) {
        //using double == because status might be a string.
        this.props.history.push("/");
      } else {
      }
    });
  };

  renderDesktop() {
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

  renderMobile() {
    return (
      <React.Fragment>
        <EditSidebar
          {...this.state}
          editPost={this.editField}
          delete={this.deletePost.bind(this)}
          sendNow={this.sendNow}
          mobile={true}
        />
        <EditContent
          {...this.state}
          editPost={this.editField}
          savePost={this.savePost.bind(this)}
          user_groups={this.state.user_groups}
          mobile={true}
        />
      </React.Fragment>
    );
  }

  render() {
    return this.props.device === config.MOBILE ? this.renderMobile() : this.renderDesktop();
  }
}

const mapStateToProps = state => ({
  sections: state.default.section.sections,
  device: state.default.mobile.device
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
