import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { Modal, Input, Form } from "antd";

import "./index.css";

const ORIGIN =
  process.env.NODE_ENV === "production"
    ? "https://meow.dailybruin.com"
    : typeof window !== "undefined"
    ? window.location.origin
    : "http://localhost:5000";
const FB_URL = `${ORIGIN}/api/v1/fb-redir/`;
const TWIT_URL = `${ORIGIN}/api/v1/twitter-redir/`;

class SectionModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: props.name,
      id: props.id,
      facebook_account_handle: props.facebook_account_handle,
      twitter_account_handle: props.twitter_account_handle
    };
  }

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
            <a href={TWIT_URL}>
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
