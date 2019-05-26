import React from "react";
import { Form, Row, Col, Input, Checkbox, Radio } from "antd";
import { Copy, Online } from "../../services/auth";
import "./EditForm.css";
import { getMe } from "../../services/api";

const RadioGroup = Radio.Group;
const { TextArea } = Input;

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
    md: { span: 4 },
    lg: { span: 5 },
    xl: { span: 4 }
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
    md: { span: 20 },
    lg: { span: 19 },
    xl: { span: 20 }
  }
};

let TWITTER_MAX_LENGTH = 232; //this is hardcoded and does not change if the backend changes.
let TWITTER_MAX_RECOMMENDED_LENGTH = 200;

class EditForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      story_url_errors: "",
      twitter_length: 0 //even if post_twitter has something, the constructor will be called
      //before that data is avialable so just set it to 0.
    };
  }

  static getDerivedStateFromProps(props, current_state) {
    const { getFieldValue } = props.form;
    //this is kinda gross but unfortunately, its neccessary for
    //setting the twitter_length if post_twitter was a non empty string
    //before the editing session started
    const twitter_length_from_field = getFieldValue("post_twitter")
      ? getFieldValue("post_twitter").normalize("NFC").length
      : 0;
    if (twitter_length_from_field != current_state.twitter_length) {
      return {
        twitter_length: twitter_length_from_field
      };
    }
    return null;
  }

  validateURL = (rule, value, callback) => {
    const form = this.props.form;
    //taken from stack overflow...probably works
    const re = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/;
    if (!value || re.test(value)) {
      this.setState({ story_url_errors: "" });
      callback();
    } else {
      this.setState({ story_url_errors: "meow thats not a url (hint: make sure to include http)" });
      callback("meow meow thats not a url");
    }
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const CopyEdited = Copy(
      () => (
        <Form.Item className="checkable-items">
          {getFieldDecorator("pub_ready_copy", {
            rules: [],
            valuePropName: "checked",
            initialValue: false
          })(<Checkbox style={{ fontSize: "1.2em" }}>Copy-edited</Checkbox>)}
        </Form.Item>
      ),
      null,
      this.props.user_groups
    );
    const OnlineReady = Online(
      () => (
        <Form.Item className="checkable-items">
          {getFieldDecorator("pub_ready_online", {
            rules: [],
            valuePropName: "checked",
            initialValue: true
          })(<Checkbox style={{ fontSize: "1.2em" }}>Ready to publish</Checkbox>)}
        </Form.Item>
      ),
      null,
      this.props.user_groups
    );

    // const urlError = isFieldTouched('story_url') && getFieldError('story_url');
    return (
      <Form layout="horizontal" className="login-form">
        <Form.Item {...formItemLayout} label="slug">
          {getFieldDecorator("slug", {
            rules: []
          })(<Input placeholder="type slug here" />)}
        </Form.Item>
        <Form.Item {...formItemLayout} label="url">
          {getFieldDecorator("story_url", {
            rules: [{ validator: this.validateURL }]
          })(
            <Input
              className={this.state.story_url_errors ? "field-with-errors" : ""}
              placeholder="https://dailybruin.com/..."
            />
          )}
          <span className="error-message">{this.state.story_url_errors}</span>
        </Form.Item>
        <Form.Item {...formItemLayout} label="sections">
          {getFieldDecorator("section", {
            rules: []
          })(
            <RadioGroup>
              {this.props.sections.map(x => (
                <Radio key={x.id} value={x.id}>
                  {x.name}
                </Radio>
              ))}
            </RadioGroup>
          )}
        </Form.Item>
        <Row type="flex" gutter={12}>
          <Col span={12}>
            <Form.Item label="facebook">
              {getFieldDecorator("post_facebook", {
                rules: []
              })(<TextArea rows={6} />)}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="twitter">
              {getFieldDecorator("post_twitter", {
                rules: []
              })(
                <TextArea
                  rows={6}
                  onChange={v => {
                    //console.log(v.target.value.length);
                    this.setState({ twitter_length: v.target.value.normalize("NFC").length });
                  }}
                  maxLength={TWITTER_MAX_LENGTH}
                />
              )}
              <span
                style={{
                  color:
                    this.state.twitter_length < TWITTER_MAX_RECOMMENDED_LENGTH ? "black" : "#F59F00"
                }}
              >
                {this.state.twitter_length} / {TWITTER_MAX_RECOMMENDED_LENGTH}
              </span>
            </Form.Item>
          </Col>
        </Row>
        <Row type="flex" gutter={12}>
          <Col span={12}>
            <Form.Item label="instagram">
              <span className="insta-note">Note: meow cannot post to instagram</span>
              {getFieldDecorator("post_instagram", {
                rules: []
              })(<TextArea rows={6} />)}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="notes">
              <span>&#8195;</span>
              {getFieldDecorator("post_notes", {
                rules: []
              })(<TextArea rows={6} />)}
            </Form.Item>
          </Col>
        </Row>
        <Row type="flex" gutter={12}>
          <Col span={12}>
            <CopyEdited />
          </Col>
          <Col span={12}>
            <OnlineReady />
          </Col>
        </Row>
      </Form>
    );
  }
}

export default Form.create({
  // onFieldsChange(props, changedFields) {
  //   props.onChange(changedFields);
  // },
  mapPropsToFields(props) {
    return {
      slug: Form.createFormField({
        ...props.slug,
        value: props.slug
      }),
      story_url: Form.createFormField({
        ...props.story_url,
        value: props.story_url
      }),
      section: Form.createFormField({
        ...props.section,
        value: props.section
      }),
      post_facebook: Form.createFormField({
        ...props.post_facebook,
        value: props.post_facebook
      }),
      post_twitter: Form.createFormField({
        ...props.post_twitter,
        value: props.post_twitter
      }),
      post_instagram: Form.createFormField({
        ...props.post_instagram,
        value: props.post_instagram
      }),
      post_notes: Form.createFormField({
        ...props.post_notes,
        value: props.post_notes
      }),
      pub_ready_copy: Form.createFormField({
        ...props.pub_ready_copy,
        value: props.pub_ready_copy
      }),
      pub_ready_online: Form.createFormField({
        ...props.pub_ready_online,
        value: props.pub_ready_online
      })
    };
  },
  onValuesChange(props, values) {
    props.onChange(values);
  }
})(EditForm);
