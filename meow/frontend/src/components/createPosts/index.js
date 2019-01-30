import React from "react";
import { connect } from "react-redux";
import { Form, Select, Input, Button } from "antd";

// import { loadPosts } from "../../actions/post";
import { createPost } from "../../actions/post";

let dataStore;
class createPosts extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      slug: "",
      story_url: "",
      post_twitter: "",
      post_facebook: ""
    };
  }

  handleSubmit = () => {
    this.state.slug = document.getElementById("slug").value;
    this.state.story_url = document.getElementById("story_url").value;
    this.state.post_twitter = document.getElementById("twitter_id").value;
    let date = {
      pub_date: "2018-07-24",
      pub_time: "13:43"
    };
    const state = Object.assign(this.state, date);

    this.props.createPost(this.state).then(data => {
      console.log(data);
      // dataStore = res.data;
      // this.setState({ data: dataStore });
    });
  };
  render() {
    return (
      <Form>
        <Form.Item label="Slug" labelCol={{ span: 3 }} wrapperCol={{ span: 8 }}>
          <Input placeholder="input slug" id="slug" />
        </Form.Item>
        <Form.Item label="Story url" labelCol={{ span: 3 }} wrapperCol={{ span: 8 }}>
          <Input placeholder="input story url" id="story_url" />
        </Form.Item>
        <Form.Item label="Twitter ID" labelCol={{ span: 3 }} wrapperCol={{ span: 8 }}>
          <Input placeholder="input twitter id" id="twitter_id" />
        </Form.Item>
        <Form.Item label=" " labelCol={{ span: 3 }} wrapperCol={{ span: 8 }}>
          <Button type="primary" onClick={this.handleSubmit}>
            Check
          </Button>
        </Form.Item>
      </Form>
      // <Input placeholder="Input name" />
    );
  }
}

const mapDispatchToProps = {
  createPost
};

export default connect(
  null,
  mapDispatchToProps
)(createPosts);
