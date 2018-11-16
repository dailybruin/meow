import axios from 'axios';
import { POST } from './constants';
import * as types from './types';

export const createPost = postData => {
  return (dispatch, getState) => {};
};

export const getPosts = token => {
  return (dispatch, getState) => {
    const body = {
      headers: {
        Authorization: 'Token ' + token
      }
    };
    return axios.get(POST + token, body).then(res => {
      console.log('Res.data: ' + JSON.stringify(res));
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
