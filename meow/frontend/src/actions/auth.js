// import routes from '../../routes';
const USER = '/login/';
const LOGIN = '/login/slack/';
const REGISTER = '/registration/';

export const login = () => {
  return (dispatch, getState) => {
    const headers = { 'Content-Type': 'application/json' };

    return fetch(
      'https://slack.com/oauth/authorize?scope=identity.basic,identity.email,identity.team,identity.avatar&client_id=4526132454.463841426112',
      { headers }
    )
      .then(res => {
        console.log('here!');
        console.log(res);
        if (res.status < 500) {
          return res.json().then(data => {
            return { status: res.status, data };
          });
        }
        console.log('Server error during login.');
        throw res;
      })
      .then(res => {
        if (res.status === 200) {
          dispatch({ type: 'LOGIN_SUCCESSFUL', data: res.data });
          return res.data;
        }

        if (res.status === 403 || res.status === 401) {
          dispatch({ type: 'AUTHENTICATION_ERROR', data: res.data });
          throw res.data;
        }

        dispatch({ type: 'LOGIN_FAILED', data: res.data });
        throw res.data;
      });
  };
};

export const logout = () => {
  return (dispatch, getState) => {
    const headers = { 'Content-Type': 'application/json' };

    return fetch('/api/auth/logout/', { headers, body: '', method: 'POST' })
      .then(res => {
        if (res.status === 204) {
          return { status: res.status, data: {} };
        }

        if (res.status < 500) {
          return res.json().then(data => {
            return { status: res.status, data };
          });
        }

        console.log('Server error during logout');
        throw res;
      })
      .then(res => {
        if (res.status === 204) {
          dispatch({ type: 'LOGOUT_SUCCESSFUL' });
          return res.data;
        }

        if (res.status === 403 || res.status === 401) {
          dispatch({ type: 'AUTHENTICATION_ERROR', data: res.data });
          throw res.data;
        }
      });
  };
};

export const register = (username, password) => {
  return (dispatch, getState) => {
    const headers = { 'Content-Type': 'application/json' };
    const body = JSON.stringify({
      username,
      password
    });

    return fetch(REGISTER, { headers, body, method: 'POST' })
      .then(res => {
        if (res.status < 500) {
          return res.json().then(data => {
            return { status: res.status, data };
          });
        }
        console.log('Server error during register!');
        throw res;
      })
      .then(res => {
        if (res.status === 200) {
          dispatch({ type: 'REGISTRATION_SUCCESSFUL', data: res.data });
          return res.data;
        }

        if (res.status === 403 || res.status === 401) {
          dispatch({ type: 'AUTHENTICATION_ERROR', data: res.data });
          throw res.data;
        }

        dispatch({ type: 'REGISTRATION_FAILED', data: res.data });
        throw res.data;
      });
  };
};

export const fetchUser = () => {
  return (dispatch, getState) => {
    dispatch({
      type: 'USER_LOADING'
    });

    const token = getState().auth.token;
    console.log(token);

    const headers = { 'Content-Type': 'application/json' };

    if (token) {
      headers.Authorization = `Token ${token}`;
    }

    return fetch(USER, { headers }).then(res => {
      if (res.status < 500) {
        if (res.status === 200) {
          res.json().then(data => {
            dispatch({ type: 'USER_LOADED', user: data });
            return data;
          });
        }
        console.log('dispatching auth error');
        dispatch({ type: 'AUTHENTICATION_ERROR', data: res.data });
        throw res.data;
      }
      console.log('Server error during login.');
      throw res;
    });
  };
};
