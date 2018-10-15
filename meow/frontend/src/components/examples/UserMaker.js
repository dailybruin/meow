import React from "react";
import axios from "axios";

const ENDPOINT = "/api/rest-auth/registration/";

export default class UserMaker extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      email: "",
      password1: "",
      bio: ""
    };
  }

  handleChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  handleSubmit = e => {
    e.preventDefault();
    Object.assign(this.state, { password2: this.state.password1 });
    console.log(this.state);
    axios.post(ENDPOINT, this.state).then(res => {
      console.log("axious post");
      console.log(res);
    });
  };

  render() {
    const { username, email, password1, bio } = this.state;

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
                name="password1"
                onChange={this.handleChange}
                value={password1}
                required
              />
            </div>
          </div>
          <div className="field">
            <label className="label">Bio</label>
            <div className="control">
              <input
                className="input"
                type="text"
                name="bio"
                onChange={this.handleChange}
                value={bio}
                required
              />
            </div>
          </div>
          <div className="control">
            <button type="submit" className="button is-info">
              Create User
            </button>
          </div>
        </form>
      </div>
    );
  }
}
