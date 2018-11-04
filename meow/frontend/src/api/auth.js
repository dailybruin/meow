import axios from 'axios';
import { USER_LOGIN_URL, USER_LOGOUT_URL, USER_URL } from './constants';
import getConfig from './config';

export const loginApi = username => axios.post(USER_LOGIN_URL, { username }, getConfig());

export const logoutApi = () => axios.post(USER_LOGOUT_URL, null, getConfig());

export const fetchUserProfileApi = username => {
  return axios.get(USER_URL + username, getConfig());
};

export const fetchUsersApi = () => axios.get(USER_URL, getConfig());
