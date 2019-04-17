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

class EditForm extends React.Component {
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

    return (
      <Form layout="horizontal" className="login-form">
        <Form.Item {...formItemLayout} label="slug">
          {getFieldDecorator("slug", {
            rules: []
          })(<Input placeholder="type slug here" />)}
        </Form.Item>
        <Form.Item {...formItemLayout} label="url">
          {getFieldDecorator("story_url", {
            rules: []
          })(<Input placeholder="https://dailybruin.com/..." />)}
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
              })(<TextArea rows={6} />)}
            </Form.Item>
          </Col>
        </Row>
        <Row type="flex" gutter={12}>
          <Col span={12}>
            <Form.Item label="instagram">
              {getFieldDecorator("post_instagram", {
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
