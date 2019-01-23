import React from "react";
import axios from "axios";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import UserProfileImage from "./UserProfileImage";
import UserProfileBasicInfo from "./UserProfileBasicInfo";
import "./styling.css";

class UserProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null
    };
  }

  componentWillMount() {
    //posts.js for Examples. PUt in user.js
    //
    let user_id = this.props.match.params.user_id;
    this.setState({
      user_id: user_id,
      profile_img: "https://i.kym-cdn.com/entries/icons/original/000/027/115/maxresdefault.jpg",
      first_name: "Bongo",
      last_name: "Cat",
      role: "DJ",
      slack_username: "bcat",
      email: "bcat@media.ucla.edu"
    });
    //instead of axios
    //this.props.loadPosts.then(res=>{

    //})
  }

  render() {
    //not sure if background_color is being access correctly
    return (
      <div className="user-profile-container">
        <UserProfileImage profile_img={this.state.profile_img} />
        <UserProfileBasicInfo
          name={this.state.first_name + " " + this.state.last_name}
          role={this.state.role}
          slack_username={this.state.slack_username}
          email={this.state.email}
        />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  token: state.auth.token
});

export default withRouter(connect(mapStateToProps)(UserProfile));
