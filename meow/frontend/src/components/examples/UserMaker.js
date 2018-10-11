import React from "react";
import axios from "axios";

const ENDPOINT = "/api/profile/";

export default class UserMaker extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      email: "",
      password: ""
    };
  }

  handleChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  handleSubmit = e => {
    e.preventDefault();

    axios.post(ENDPOINT, this.state).then(res => {
      console.log("axious post");
      console.log(res);
    });
  };

  render() {
    const { username, email, password } = this.state;

    return (
      <div className="column">
        <form onSubmit={this.handleSubmit}>
          <div className="field">
            <label className="label">Username</label>
            <div className="control">
              <input
                className="input"
                type="text"
                name="username"
                onChange={this.handleChange}
                value={username}
                required
              />
            </div>
          </div>
          <div className="field">
            <label className="label">Email</label>
            <div className="control">
              <input
                className="input"
                type="email"
                name="email"
                onChange={this.handleChange}
                value={email}
                required
              />
            </div>
          </div>
          <div className="field">
            <label className="label">Password</label>
            <div className="control">
              <input
                className="input"
                type="text"
                name="password"
                onChange={this.handleChange}
                value={password}
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
