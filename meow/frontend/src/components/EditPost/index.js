import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import moment from "moment";
import { Layout } from "antd";

import EditSidebar from "./Sidebar";
import EditContent from "./Content";
import Sidebar from "../Sidebar";
import HistoryBar from "../HistoryBar";

const dateMatcher = /\?date=(\d{4})\-(\d{2})\-(\d{2})/;

import { getMe } from "../../services/api";
import { getPost, editPost, savePost, sendPostNow } from "../../actions/post";
import { alertError } from "../../actions/alert";

import { logout } from "../../actions/user";

import { loadSections } from "../../actions/section";
import config from "../../config";
import "./Tags.css";

const { Content } = Layout;
const contentStyles = { position: "relative", transform: "translateY(-30px)" };

class EditPost extends React.Component {
  state = {
    sections: this.props.sections
  };

  componentDidMount() {
    const { postId } = this.props.match.params;

    getMe()
      .then(res => {
        this.setState({
          user_groups: res.data.groups
        });
      })
      .catch(err => {
        // any error we logout
        this.props.logout();
      });

    if (postId) {
      this.props.getPost(postId).then(data => {
        this.setState({
          ...data,
          tags: data.tags
            ? data.tags.map(x => {
                return { id: x, text: x };
              })
            : [],
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
          //console.log(moment(dateString, "YYYY-MM-DD", true));
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

  //both send now and save Post use this so its better if its in one place.
  savePostPromise = postId => {
    return this.props.savePost(postId, {
      slug: this.state.slug,
      story_url: this.state.story_url,
      section: this.state.section,
      pub_date: this.state.pub_date,
      pub_time: this.state.pub_time,
      pub_ready_copy: false,
      pub_ready_online: false,
      post_facebook: this.state.post_facebook,
      post_twitter: this.state.post_twitter,
      post_newsletter: this.state.post_newsletter,
      post_notes: this.state.post_notes,
      pub_ready_copy: this.state.pub_ready_copy,
      pub_ready_online: this.state.pub_ready_online,
      tags: this.state.tags.map(x => {
        return x.text;
      })
    });
  };

  savePost = () => {
    const { postId } = this.props.match.params;

    this.savePostPromise(postId).then(data => {
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

    this.savePostPromise(postId).then(data => {
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

  /**
   * This function is used by the HistoryBar compoenent
   * to replace current posts with one of the historic edits.
   * It should be passed to HistoryBar and no other componenets
   * should call this function!
   * @param {string} fb facebook post string
   * @param {string} tw twitter post string
   */
  replaceWithHistory = (fb, tw, nl) => {
    this.setState({ post_facebook: fb, post_twitter: tw, post_newsletter: nl });
  };

  renderDesktop() {
    const { postId } = this.props.match.params;

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
        <div style={{ width: "25vw" }}>
          <HistoryBar replaceWithHistory={this.replaceWithHistory} postId={postId} />
        </div>
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
  sendPostNow: postId => sendPostNow(postId),
  logout
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(EditPost)
);
