import axios from 'axios';

import { LOGIN, REGISTER, FETCH_USER_URL } from './constants';

import * as types from './types';

export const login = e => {
  return (dispatch, getState) => {
    e.preventDefault();
    window.location.replace(LOGIN);
  };
};

export const register = code => {
  return (dispatch, getState) => {
    const headers = { 'Content-Type': 'application/json' };
    const body = {
      headers,
      code
    };

    return axios.post(REGISTER, body).then(res => {
      console.log(res.data);
      if (res.status === 200) {
        dispatch({ type: types.LOGIN_SUCCESSFUL, data: res.data });
        return res.data;
      }

      dispatch({ type: types.LOGIN_FAILED, data: res.data });
      throw res.data;
    });
  };
};

export const fetch_user = token => {
  return (dispatch, getState) => {
    const body = {
      headers: {
        Authorization: 'Token ' + token
      }
    };

    return axios.get(FETCH_USER_URL + '' + token, body).then(res => {
      console.log('Res.data: ' + res.data.user);
      if (res.status === 200) {
        dispatch({
          type: types.FETCH_USER,
          data: {
            user: res.data.user
          }
        });
        //TODO: what does the return do? (other than preventing it from reaching throw res.data)
        return res.data;
      }
      throw res.data;
    });
  };
};
