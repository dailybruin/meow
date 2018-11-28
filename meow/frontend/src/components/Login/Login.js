import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import './Login.scss';

import { auth } from '../../actions';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      catPicIndex: Math.floor(10 * Math.random() + 1)
    };
  }

  render() {
    let divBackgroundStyle = {
      'background-image': `url("/static/src/assets/cats/${this.state.catPicIndex}.${
        this.state.catPicIndex == 5 ? 'png' : 'jpg'
      }")`
    };

    //test purposes
    //divBackgroundStyle.background = 'url("https://news.nationalgeographic.com/content/dam/news/2018/05/17/you-can-train-your-cat/02-cat-training-NationalGeographic_1484324.ngsversion.1526587209178.adapt.1900.1.jpg")';

    return (
      <div className="login">
        <div className="background-pic" style={divBackgroundStyle} />
        <h1>
          meow
          <span>.dailybruin</span>
        </h1>
        <form onSubmit={this.props.login}>
          <button type="submit">Sign in with Slack</button>
        </form>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated
});

const mapDispatchToProps = dispatch => ({
  login: e => dispatch(auth.login(e))
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Login)
);
