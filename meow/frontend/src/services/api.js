import axios from "axios";
import config from "../config";

axios.defaults.xsrfCookieName = "csrftoken";
axios.defaults.xsrfHeaderName = "X-CSRFToken";
axios.defaults.withCredentials = true;

const { SERVER_URL } = config;

export const themeList = () => {
  return axios
    .get(`${SERVER_URL}/users/themes/`, {
      withCredentials: true
    })
    .then(res => {
      return {
        data: res.data,
        status: res.status
      };
    });
};

export const themeAdd = newTheme => {
  return axios.post(`${SERVER_URL}/users/themeAdd/`, newTheme).then(res => ({
    data: res.data,
    status: res.status
  }));
};

export const themeEdit = updatedTheme => {
  return axios.put(`${SERVER_URL}/users/themeEdit/`, updatedTheme).then(res => ({
    data: res.data,
    status: res.status
  }));
};

export const themeDelete = deletedTheme => {
  return axios.put(`${SERVER_URL}/users/themeDelete/`, deletedTheme).then(res => ({
    data: res.data,
    status: res.status
  }));
};

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

export const putUser = newData => {
  return axios.put(`${SERVER_URL}/users/me/`, newData).then(res => ({
    data: res.data,
    status: res.status
  }));
};

export const postList = YMD => {
  return axios
    .get(`${SERVER_URL}/post/?year=${YMD.year}&month=${YMD.month}&day=${YMD.day}`, {
      withCredentials: true
    })
    .then(res => ({
      data: res.data,
      status: res.status
    }));
};

export const postDetail = postId => {
  return axios
    .get(`${SERVER_URL}/post/${postId}`, {
      withCredentials: true
    })
    .then(res => ({
      data: res.data,
      status: res.status
    }));
};

export const getTagSuggestions = () => {
  return axios.get(`${SERVER_URL}/tags/suggestions`).then(res => ({
    data: res.data,
    status: res.status
  }));
};

const postTags = postData => {
  if (postData !== undefined && postData.tags !== undefined) {
    //return promise with no then we we can easily hook it together in the chain.
    return axios.post(`${SERVER_URL}/tags/create-many`, postData.tags);
  }
  return Promise.resolve();
};

export const postPost = (postId, postData) => {
  //first inspect the data to see if we have tags
  //they will be formated as an array of strings

  if (postId) {
    return postTags(postData).then(() =>
      axios.put(`${SERVER_URL}/post/${postId}`, postData).then(res => ({
        data: res.data,
        status: res.status
      }))
    );
  }

  return postTags(postData).then(() =>
    axios.post(`${SERVER_URL}/post/`, postData).then(res => ({
      data: res.data,
      status: res.status
    }))
  );
};

export const postSendNow = postId => {
  return axios.post(`${SERVER_URL}/post/${postId}/send_now`);
};

export const sectionList = () => {
  return axios
    .get(`${SERVER_URL}/section/`, {
      withCredentials: true
    })
    .then(res => ({
      data: res.data,
      status: res.status
    }));
};

export const getHistory = postId =>
  axios.get(`${SERVER_URL}/history/${postId}`).then(({ data, status }) => ({
    data,
    status
  }));
