import { getMe, userDetail, logout as apiLogout } from "../services/api";

const loginSuccess = ({ username, firstName, isAuthenticated }) => ({
  type: "USER_LOGIN_SUCCESS",
  payload: {
    username,
    firstName,
    isAuthenticated
  }
});

export const login = () => {
  return dispatch => {
    return getMe().then(
      ({ data, status }) => {
        if (status >= 400) {
          dispatch({
            type: "USER_LOGIN_FAIL",
            message: "Could not get current user."
          });
        } else {
          dispatch(
            loginSuccess({
              username: data.username,
              firstName: data.first_name,
              isAuthenticated: true
            })
          );
        }
      },
      err => {
        dispatch({
          type: "NETWORK_ERROR",
          message: "Could not connect to server."
        });
      }
    );
  };
};

export const logout = () => {
  return dispatch => {
    dispatch({
      type: "LOGOUT"
    });

    return apiLogout().then(null, err => {
      dispatch({
        type: "NETWORK_ERROR",
        message: "Could not connect to server."
      });
    });
  };
};

export const getUser = username => {
  return dispatch => {
    return userDetail(username).then(
      ({ data, status }) => {
        if (status >= 400) {
          dispatch({
            type: "PROFILE_FAIL",
            message: `Could not get specified user "${username}"`
          });
        } else {
          return data;
        }
      },
      err => {
        dispatch({
          type: "NETWORK_ERROR",
          message: "Could not connect to server."
        });
      }
    );
  };
};