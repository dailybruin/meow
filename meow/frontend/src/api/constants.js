export const API_URL =
  process.env.NODE_ENV === 'production'
    ? process.env.REACT_APP_PROD_API_URL
    : process.env.REACT_APP_DEV_API_URL;
export const USER_URL = `${API_URL}user/`;
export const USER_REGISTER_URL = `${USER_URL}register/`;
export const USER_LOGIN_URL = `${USER_URL}login/`;
export const USER_LOGOUT_URL = `${USER_URL}logout/`;
export const USER_EDIT_URL = '/edit/';
export const USER_DELETE_URL = '/delete/';
