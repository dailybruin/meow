import React from "react";
import axios from "axios";

const ENDPOINT = "/api/post/";

export default class PostMaker extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      slug: "",
      story_url: "",
      post_twitter: ""
    };
  }

  handleChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  handleSubmit = e => {
    e.preventDefault();
    let date = {
      pub_date: "2018-07-24",
      pub_time: "08:43"
    };

    const state = Object.assign(this.state, date);

    axios.post(ENDPOINT, state).then(res => {
      console.log("axious post");
      console.log(res);
    });
  };

  render() {
    const { slug, story_url, post_twitter } = this.state;

    return (
      <div className="column">
        <form onSubmit={this.handleSubmit}>
          <div className="field">
            <label className="label">Slug</label>
            <div className="control">
              <input
                className="input"
                type="text"
                name="slug"
                onChange={this.handleChange}
                value={slug}
                required
              />
            </div>
          </div>
          <div className="field">
            <label className="label">story_url</label>
            <div className="control">
              <input
                className="input"
                type="url"
                name="story_url"
                onChange={this.handleChange}
                value={story_url}
                required
              />
            </div>
          </div>
          <div className="field">
            <label className="label">tweet</label>
            <div className="control">
              <textarea
                className="textarea"
                type="text"
                name="post_twitter"
                onChange={this.handleChange}
                value={post_twitter}
                required
              />
            </div>
          </div>
          <div className="control">
            <button type="submit" className="button is-info">
              Create Post
            </button>
          </div>
        </form>
      </div>
    );
  }
}
