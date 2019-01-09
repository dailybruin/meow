import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import { auth } from '../../actions';
import Header from '../Header/Header';
import Sidebar from '../Sidebar/Sidebar';
import '../scss/components/_body.scss';

class Home extends Component {
  render() {
    return (
      <div>
        <Header />
        <Sidebar />
        <div class="body">
          <nav>
            <Link to="/posts">Posts</Link>
            <Link to="/add">Add</Link>
            <Link to="/posts/2">Post #2</Link>
            <Link to="/logout">Logout</Link>
          </nav>
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  logout: () => dispatch(auth.logout())
});

export default withRouter(
  connect(
    null,
    mapDispatchToProps
  )(Home)
);
