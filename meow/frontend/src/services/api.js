import axios from "axios";
import config from "../config";

axios.defaults.xsrfCookieName = "csrftoken";
axios.defaults.xsrfHeaderName = "X-CSRFToken";
axios.defaults.withCredentials = true;

const { SERVER_URL } = config;

export const getMe = () => {
  return axios
    .get(`${SERVER_URL}/users/me/`, {
      withCredentials: true
    })
    .then(res => {
      return {
        data: res.data,
        status: res.status
      };
    });
};

export const logout = () => {
  return axios
    .get(`${SERVER_URL}/users/logout/`, {
      withCredentials: true
    })
    .then(res => {
      return {
        status: res.status
      };
    });
};

export const userDetail = username => {
  return axios
    .get(`${SERVER_URL}/users/${username}`, {
      withCredentials: true
    })
    .then(res => {
      return res;
    });
};

export const postList = () => {
  return axios
    .get(`${SERVER_URL}/posts/`, {
      withCredentials: true
    })
    .then(res => ({
      data: res.data,
      status: res.status
    }));
};
