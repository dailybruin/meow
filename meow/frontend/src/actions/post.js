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
        console.log('Res.data: ' + res.data);
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

export const createPosts = newPost => {
  return (dispatch, getState) => {
    const { token } = getState().auth;

    console.log(newPost);
    // return axios
    //   .post(POST, {
    //     headers: {
    //       'Content-Type': 'application/json',
    //       Authorization: `Token ${token}`
    //     },
    //     // data: newPost,
    //   })
    return axios(POST, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${token}`
      },
      params: {
        code: newPost
      }
    }).then(res => {
      console.log('Res.data: ' + res.data);
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
