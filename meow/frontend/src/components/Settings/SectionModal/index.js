import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { Modal, Input, Form } from "antd";

import "./index.css";

const FB_URL = "http://localhost:5000/api/v1/fb-redir/";

class SectionModal extends React.Component {
  state = {
    name: this.props.name,
    id: this.props.id,
    facebook_account_handle: this.props.facebook_account_handle,
    twitter_account_handle: this.props.twitter_account_handle
  };

  render() {
    const { name, facebook_account_handle, twitter_account_handle } = this.state;

    return (
      <Modal
        wrapClassName="meow-section-modal"
        title={name}
        okText="Save"
        visible={this.props.showModal}
        onCancel={() => this.props.dismiss()}
        destroyOnClose
      >
        <div className="soc">
          <span>facebook: </span>
          {facebook_account_handle}
          <div>
            <a href={FB_URL}>
              <img src="https://i.stack.imgur.com/oL5c2.png" alt="Connect with Facebook" />
            </a>
          </div>
        </div>
        <div className="soc">
          <span>twitter: </span>
          {twitter_account_handle}
          <div>
            <a href="">
              <img src="https://i.imgur.com/8kGZAvb.png" alt="Connect with Twitter" />
            </a>
          </div>
        </div>
      </Modal>
    );
  }
}

const mapDispatchToProps = {};

export default withRouter(
  connect(
    null,
    mapDispatchToProps
  )(SectionModal)
);
