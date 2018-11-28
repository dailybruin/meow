import React from 'react';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';

import PostGetter from './PostGetter';
import Sidebar from '../Sidebar/Sidebar';
import { post } from '../../actions';

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
    this.props.fetchPosts().then(res => {
      this.setState({ posts: res });
    });
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
        <p onClick={this.handleToggle}>CLICK ME TO FILTER</p>
        <PostGetter posts={posts} />
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  fetchPosts: () => dispatch(post.fetchPosts())
});

// const mapStateToProps = state => ({
//   token: state.auth.token
// });

export default withRouter(
  connect(
    null,
    mapDispatchToProps
  )(FilterableWrapper)
);
