import axios from 'axios';
import { POST } from './constants';
import * as types from './types';

// export const createPost = postData => {
//   return (dispatch, getState) => {};
// };

export const fetchPosts = () => {
  return (dispatch, getState) => {
    const { token } = getState().auth;

    return axios
      .get(POST, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Token ${token}`
        }
      })
      .then(res => {
        if (res.status === 200) {
          dispatch({
            type: types.FETCH_POSTS,
            data: {
              posts: res.data.posts
            }
          });
          return res.data;
        }
      });
  };
};

export const fetchPost = postId => {
  return (dispatch, getState) => {
    const { token } = getState().auth;
    const postURL = POST.concat(postId);

    return axios
      .get(postURL, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Token ${token}`
        }
      })
      .then(res => {
        if (res.status === 200) {
          dispatch({ type: types.FETCH_POST });
          return res.data;
        }
      });
  };
};

export const addPost = newPost => {
  return (dispatch, getState) => {
    const { token } = getState().auth;

    return axios
      .post(POST, newPost, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Token ${token}`
        }
      })
      .then(res => {
        if (res.status === 200) {
          dispatch({
            type: types.FETCH_POSTS,
            data: {
              posts: res.data.posts
            }
          });
          return res.data;
        }
      });
  };
};
