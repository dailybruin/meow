import React from 'react';
import axios from 'axios';
import PostGetter from './PostGetter';
import Sidebar from '../Sidebar/Sidebar';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import { post } from '../../actions';

const ENDPOINT = '/api/post/';

class FilterableWrapper extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: [],
      filteredPosts: [],
      gt2: false
    };
    this.handleToggle = this.handleToggle.bind(this);
  }

  componentDidMount() {
    this.props.getPosts(this.props.token);
  }

  handleToggle() {
    let filtered = !this.state.gt2;
    let newPosts = filtered
      ? this.state.posts.filter(post => {
          return post.id > 2;
        })
      : this.state.posts;
    this.setState({ filteredPosts: newPosts, gt2: filtered });
  }

  render() {
    const posts = this.state.filteredPosts;

    return (
      <div>
        <Sidebar />
        <PostGetter posts={posts} />
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  getPosts: token => dispatch(post.getPosts(token))
});

const mapStateToProps = state => ({
  token: state.auth.token
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(FilterableWrapper)
);
