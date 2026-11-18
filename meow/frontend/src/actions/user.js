import { getMe, userDetail, logout as apiLogout, putUser } from "../services/api";
import { alertError } from "./alert";

const loginSuccess = ({ username, firstName, isAuthenticated, theme }) => ({
  type: "USER_LOGIN_SUCCESS",
  payload: {
    username,
    firstName,
    isAuthenticated,
    theme
  }
});

export const login = () => {
  return dispatch => {
    return getMe()
      .then(({ data }) => {
        dispatch(
          loginSuccess({
            username: data.username,
            firstName: data.first_name,
            theme: data.theme,
            isAuthenticated: true
          })
        );
      })
      .catch(err => {
        dispatch({
          type: "USER_LOGIN_FAIL",
          message: "Could not get current user."
        });
        if (err.response.status >= 500)
          dispatch({
            type: "NETWORK_ERROR",
            message: "Could not connect to server."
          });
      });
  };
};

export const logout = () => dispatch => {
  // End the server session before authorization redirects to the login page.
  return apiLogout()
    .then(() => {
      dispatch({ type: "LOGOUT" });
    })
    .catch(error => {
      dispatch(
        alertError("Sign out failed", "Could not end the server session. Please try again.")
      );
      throw error;
    });
};

export const getUser = username => {
  return dispatch => {
    return userDetail(username)
      .then(({ data }) => data)
      .catch(err => {
        const { status } = err.response;

        if (status >= 400 && status < 500)
          dispatch({
            type: "PROFILE_FAIL",
            message: `Could not get specified user "${username}"`
          });
        else
          dispatch({
            type: "NETWORK_ERROR",
            message: "Could not connect to server."
          });
      });
  };
};

export const editUser = newData => dispatch => {
  return putUser(newData)
    .then(({ data }) => {
      if (newData.selected_theme) {
        dispatch({
          type: "THEME_CHANGE",
          payload: {
            theme: newData.selected_theme
          }
        });
      }
      return data;
    })
    .catch(err => {
      const { status } = err.response;
      if (status >= 400 && status < 500)
        dispatch({
          type: "EDIT_USER_FAIL",
          message: `Could not edit current user"`
        });
      else
        dispatch({
          type: "NETWORK_ERROR",
          message: "Could not connect to server."
        });
    });
};
