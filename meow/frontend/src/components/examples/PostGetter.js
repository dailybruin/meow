import React from 'react';
import { withRouter } from 'react-router';
import axios from 'axios';
import ReactTable from 'react-table';
import '../scss/PostGetter.scss';

function Td({ children, to }) {
  // Conditionally wrapping content into a link
  const content = to ? (
    <Link className={styles.content} to={to}>
      {children}
    </Link>
  ) : (
    <div className={styles.content}>{children}</div>
  );

  return <td>{content}</td>;
}

function convertTimestamps(posts) {
  for (var i = 0; i < posts.length; i++) {
    var time = posts[i].pub_time;
    var hours = time.substring(0, 2);
    if (hours > 12) {
      var newtime = hours % 12;
      newtime = newtime + time.substring(2, 5) + ' PM';
      posts[i].pub_time = newtime;
    } else {
      var newtime = hours;
      newtime = newtime + time.substring(2, 5) + ' AM';
      posts[i].pub_time = newtime;
    }
  }
}

class PostGetterBase extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const cols = [
      // { Header: 'Post ID', accessor: 'id' },
      { Header: 'section', accessor: 'section' },
      { Header: 'slug', accessor: 'slug' },
      // { Header: 'link', accessor: 'story_url' },
      { Header: 'tweet', accessor: 'id_twitter' },
      { Header: 'facebook', accessor: 'id_facebook' },
      { Header: 'post time', accessor: 'pub_time' },
      { Header: 'status', accessor: 'status' }
    ];

    const posts = this.props.posts;
    const newPosts = posts;
    convertTimestamps(newPosts);

    return (
      <ReactTable
        data={newPosts}
        pageSize={5}
        // minRows={posts.length}
        columns={cols}
        className="react-table"
        noDataText="No posts found!"
        getTdProps={(state, rowInfo) => {
          return {
            onClick: () => {
              this.props.history.push(`/posts/${rowInfo.original.id}`);
            }
          };
        }}
      />
    );
  }
}

const PostGetter = withRouter(PostGetterBase);
export default PostGetter;
