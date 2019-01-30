import React from "react";
import { Form, Row, Col, Input, Select, Checkbox, Divider } from "antd";
import "./EditForm.css";

const CheckboxGroup = Checkbox.Group;
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

    return (
      <Form layout="horizontal" className="login-form">
        <Form.Item {...formItemLayout} label="slug">
          {getFieldDecorator("slug", {
            rules: []
          })(<Input placeholder="type slug here" />)}
        </Form.Item>
        <Form.Item {...formItemLayout} label="url">
          {getFieldDecorator("url", {
            rules: []
          })(<Input placeholder="https://dailybruin.com/..." />)}
        </Form.Item>
        <Form.Item {...formItemLayout} label="sections">
          <CheckboxGroup options={["Daily Bruin", "Opinion", "Sports"]} />
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
            <Form.Item>
              {getFieldDecorator("copy_edited", {
                rules: []
              })(<Checkbox style={{ fontSize: "1.2em" }}>Copy-edited</Checkbox>)}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item>
              <Checkbox style={{ fontSize: "1.2em" }}>Ready to publish</Checkbox>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    );
  }
}

export default Form.create({
  onFieldsChange(props, changedFields) {
    props.onChange(changedFields);
  },
  mapPropsToFields(props) {
    return {
      slug: Form.createFormField({
        ...props.slug,
        value: props.slug.value
      }),
      url: Form.createFormField({
        ...props.url,
        value: props.url.value
      }),
      post_facebook: Form.createFormField({
        ...props.post_facebook,
        value: props.post_facebook.value
      }),
      post_twitter: Form.createFormField({
        ...props.post_twitter,
        value: props.post_twitter.value
      }),
      copy_edited: Form.createFormField({
        ...props.copy_edited,
        value: props.copy_edited.value
      })
    };
  },
  onValuesChange(_, values) {
    console.log("on values change");
    console.log(values);
  }
})(EditForm);
