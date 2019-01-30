import React from 'react';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';

import { post } from '../../actions';

class SMPost extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null
    };
    this.renderPost = this.renderPost.bind(this);
    this.renderNull = this.renderNull.bind(this);
  }

  componentDidMount() {
    const postId = this.props.match.params.post_id;

    this.props.fetchPost(postId).then(res => {
      this.setState({ data: res });
    });
  }

  renderNull() {
    return <div>No post data yet! :(</div>;
  }

  renderPost() {
    return (
      <div>
        <h1>{this.state.data.id}</h1>
        <h2>{this.state.data.slug}</h2>
      </div>
    );
  }

  render() {
    return this.state.data ? this.renderPost() : this.renderNull();
  }
}

const mapDispatchToProps = dispatch => ({
  fetchPost: postId => dispatch(post.fetchPost(postId))
});

export default withRouter(
  connect(
    null,
    mapDispatchToProps
  )(SMPost)
);
