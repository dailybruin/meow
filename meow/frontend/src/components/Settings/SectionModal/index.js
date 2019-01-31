import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { Modal, Input, Form } from "antd";

import "./index.css";

const SlackChannel = Form.create({
  name: "slack_channel_form",
  onFieldsChange(props, changedFields) {
    props.onChange(changedFields);
  },
  mapPropsToFields(props) {
    return {
      slack_channel: Form.createFormField({
        ...props.slack_channel,
        value: props.slack_channel
      })
    };
  },
  onValuesChange(_, values) {
    console.log("on values change");
    console.log(values);
  }
})(props => {
  const { getFieldDecorator } = props.form;
  return (
    <Form layout="inline">
      <Form.Item label="slack channel">
        {getFieldDecorator("slack_channel", {
          rules: [{ required: true, message: "A channel is required!" }]
        })(<Input placeholder="Do not use the #" />)}
      </Form.Item>
    </Form>
  );
});

class SectionModal extends React.Component {
  state = {
    name: this.props.name,
    id: this.props.id,
    facebook_account_handle: this.props.facebook_account_handle,
    twitter_account_handle: this.props.twitter_account_handle,
    slack_channel: this.props.slack_channel
  };

  handleFormChange = changedFields => {
    this.setState({
      slack_channel: changedFields.slack_channel.value
    });
  };

  render() {
    const { name, facebook_account_handle, twitter_account_handle, slack_channel } = this.state;

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
            <a href="">
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
        <SlackChannel slack_channel={this.state.slack_channel} onChange={this.handleFormChange} />
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
