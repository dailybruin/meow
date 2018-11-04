import axios from 'axios';

import { LOGIN, REGISTER } from './constants';
import * as types from './types';

export const login = e => {
  return (dispatch, getState) => {
    e.preventDefault();
    window.location.replace(LOGIN);
  };
};

export const logout = () => {
  return (dispatch, getState) => {
    console.log('logout action');
    dispatch({
      type: types.LOGOUT
    });
  };
};

export const register = code => {
  return (dispatch, getState) => {
    const headers = { 'Content-Type': 'application/json' };
    const body = {
      headers,
      code
    };
    console.log(body);

    return axios.post(REGISTER, body).then(res => {
      if (res.status === 200) {
        dispatch({ type: types.LOGIN_SUCCESSFUL, data: res.data });
        return res.data;
      }

      dispatch({ type: types.LOGIN_FAILED, data: res.data });
      throw res.data;
    });
  };
};
