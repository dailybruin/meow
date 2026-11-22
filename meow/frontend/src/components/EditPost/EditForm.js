import React from "react";
import { Form, Row, Col, Input, Checkbox, Radio } from "antd";
import { getTweetLength } from "../../../../meow/utils/tweetLength.js";
import { Copy, Online } from "../../services/auth";
import { WithContext as ReactTags } from "react-tag-input";
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

const TWITTER_MAX_LENGTH = 280; // this is hardcoded and does not change if the backend changes.
const TWITTER_MAX_RECOMMENDED_LENGTH = 232;

const FB_MAX_LENGTH = 75;
const FB_MAX_RECOMMENDED_LENGTH = 50;

class EditForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      story_url_errors: "",
      twitter_length: 0, //even if post_twitter has something, the constructor will be called
      //before that data is avialable so just set it to 0.
      facebook_length: 0,
      newsletter_length: 0
    };
  }

  static getDerivedStateFromProps(props, current_state) {
    const { getFieldValue } = props.form;
    const updates = {};
    // this is kinda gross but unfortunately, its neccessary for
    // setting the length if post was a non empty string
    // before the editing session started
    const twitter_length_from_field = getTweetLength(
      getFieldValue("post_twitter"),
      props.story_url != null
    );
    if (twitter_length_from_field != current_state.twitter_length) {
      updates.twitter_length = twitter_length_from_field;
    }
    const wordCount = text =>
      text
        ? text
            .trim()
            .split(/\s+/)
            .filter(Boolean).length
        : 0;
    const facebook_length_from_field = wordCount(getFieldValue("post_facebook"));
    if (facebook_length_from_field != current_state.facebook_length) {
      updates.facebook_length = facebook_length_from_field;
    }
    const newsletter_length_from_field = wordCount(getFieldValue("post_newsletter"));
    if (newsletter_length_from_field != current_state.newsletter_length) {
      updates.newsletter_length = newsletter_length_from_field;
    }
    return Object.keys(updates).length > 0 ? updates : null;
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

  responsiveRender = (firstComp, secondComp) => {
    if (this.props.mobile === true) {
      return (
        <React.Fragment>
          <Row className="customEditFormRow" type="flex" gutter={12}>
            {firstComp}
          </Row>
          <Row className="customEditFormRow" type="flex" gutter={12}>
            {secondComp}
          </Row>
        </React.Fragment>
      );
    } else {
      return (
        <Row type="flex" gutter={12}>
          <Col span={12}>{firstComp}</Col>
          <Col span={12}>{secondComp}</Col>
        </Row>
      );
    }
  };

  /** tags **/
  handleDelete = i => {
    const { setFieldsValue, getFieldsValue } = this.props.form;
    const tags = getFieldsValue(["tags"]).tags;
    if (tags === undefined) return;
    setFieldsValue({
      tags: tags.filter((tag, index) => index !== i)
    });
  };
  handleAddition = tag => {
    const { setFieldsValue, getFieldsValue } = this.props.form;
    if (getFieldsValue(["tags"]).tags === undefined) {
      setFieldsValue({ tags: [tag] });
    } else {
      setFieldsValue({ tags: [...getFieldsValue(["tags"]).tags, tag] });
    }
  };

  handleDrag = (tag, currPos, newPos) => {
    const { setFieldsValue, getFieldsValue } = this.props.form;
    const tags = getFieldsValue(["tags"]).tags;
    if (tags === undefined) return;
    // mutate array
    tags.splice(currPos, 1);
    tags.splice(newPos, 0, tag);

    // re-render
    setFieldsValue({ tags });
  };

  handleClickpub = e => {
    this.setState({
      ...this.state,
      click_pubready: e.target.checked
    });
  };

  getWordCount = text =>
    text
      ? text
          .trim()
          .split(/\s+/)
          .filter(Boolean).length
      : 0;

  render() {
    const { getFieldDecorator, getFieldsValue, getFieldValue } = this.props.form;

    let no_urlwarning = null;
    if (
      getFieldsValue(["pub_ready_online"]).pub_ready_online &&
      (this.props.story_url == null || this.props.story_url.trim() == "")
    ) {
      no_urlwarning = (
        <p className="no-url-warning">Warning: post can still be sent, but no url was entered</p>
      );
    } else if (!getFieldsValue(["pub_ready_online"]).pub_ready_online) {
      no_urlwarning = null;
    }

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
          {no_urlwarning}
        </Form.Item>
      ),
      null,
      this.props.user_groups
    );

    const { tags } = this.state;
    const hasUrl = !!(this.props.story_url && this.props.story_url.trim());
    const twitterLength = getTweetLength(getFieldValue("post_twitter") || "", hasUrl);

    console.log(getFieldsValue(["tags"]).tags);
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
          <p className="no-section-error">
            {this.props.section == null ? this.props.sectionError : ""}
          </p>
        </Form.Item>
        <Form.Item {...formItemLayout} label="tags">
          {getFieldDecorator("tags", {
            rules: []
          })(
            <ReactTags
              tags={getFieldsValue(["tags"]).tags}
              suggestions={this.props.suggestions || [{ id: "feature", text: "feature" }]}
              inputFieldPosition="top"
              handleDelete={this.handleDelete}
              handleAddition={this.handleAddition}
              handleDrag={this.handleDrag}
              delimiters={[13, 188]}
            />
          )}
        </Form.Item>
        {this.responsiveRender(
          <Form.Item label="facebook">
            {getFieldDecorator("post_facebook", {
              rules: []
            })(
              <TextArea
                rows={6}
                onChange={v => {
                  const count = this.getWordCount(v.target.value);
                  this.setState({ facebook_length: count });
                }}
              />
            )}
            <span
              style={{
                color:
                  this.state.facebook_length >= FB_MAX_LENGTH
                    ? "red"
                    : this.state.facebook_length >= FB_MAX_RECOMMENDED_LENGTH
                    ? "#F59F00"
                    : "black"
              }}
            >
              {this.state.facebook_length} / {FB_MAX_LENGTH} words
            </span>
          </Form.Item>,
          <Form.Item label="twitter">
            {getFieldDecorator("post_twitter", {
              rules: []
            })(<TextArea rows={6} />)}
            <span
              style={{
                color:
                  twitterLength >= TWITTER_MAX_LENGTH
                    ? "red"
                    : twitterLength >= TWITTER_MAX_RECOMMENDED_LENGTH
                    ? "#F59F00"
                    : "black"
              }}
            >
              {twitterLength > TWITTER_MAX_LENGTH
                ? `Over X's limit by ${twitterLength - TWITTER_MAX_LENGTH}`
                : `${twitterLength} / ${TWITTER_MAX_LENGTH}`}
            </span>
          </Form.Item>
        )}
        {this.responsiveRender(
          <Form.Item label="newsletter">
            {getFieldDecorator("post_newsletter", {
              rules: []
            })(
              <TextArea
                rows={6}
                onChange={v => {
                  // console.log(v.target.value.length);
                  const count = this.getWordCount(v.target.value);
                  this.setState({ newsletter_length: count });
                }}
              />
            )}
            <span
              style={{
                color:
                  this.state.newsletter_length >= FB_MAX_LENGTH
                    ? "red"
                    : this.state.newsletter_length >= FB_MAX_RECOMMENDED_LENGTH
                    ? "#F59F00"
                    : "black"
              }}
            >
              {this.state.newsletter_length} / {FB_MAX_LENGTH} words
            </span>
          </Form.Item>,
          <Form.Item label="notes">
            {getFieldDecorator("post_notes", {
              rules: []
            })(<TextArea rows={6} />)}
          </Form.Item>
        )}
        {this.responsiveRender(
          <Form.Item label="instagram">
            {getFieldDecorator("post_instagram", {
              rules: []
            })(<TextArea rows={6} />)}
          </Form.Item>
        )}
        {this.responsiveRender(<CopyEdited />, <OnlineReady />)}
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
      tags: Form.createFormField({
        ...props.tags,
        value: props.tags
      }),
      post_facebook: Form.createFormField({
        ...props.post_facebook,
        value: props.post_facebook
      }),
      post_twitter: Form.createFormField({
        ...props.post_twitter,
        value: props.post_twitter
      }),
      post_newsletter: Form.createFormField({
        ...props.post_newsletter,
        value: props.post_newsletter
      }),
      post_notes: Form.createFormField({
        ...props.post_notes,
        value: props.post_notes
      }),
      post_instagram: Form.createFormField({
        ...props.post_instagram,
        value: props.post_instagram
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
