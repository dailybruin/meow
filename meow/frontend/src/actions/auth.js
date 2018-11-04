// import routes from '../../routes';
const USER = '/login/';
const LOGIN = '/login/slack/';
const REGISTER = '/rest-auth/slack/';

export const login = () => {
  return (dispatch, getState) => {
    const headers = { 'Content-Type': 'application/json' };

    return fetch('/accounts/', { headers })
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

export const register = code => {
  console.log('inside register and code is');
  console.log(code);
  return (dispatch, getState) => {
    const headers = { 'Content-Type': 'application/json' };
    const body = JSON.stringify({
      code
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
        console.log('in register res is:');
        console.log(res);
        if (res.status === 200) {
          dispatch({ type: 'REGISTRATION_SUCCESSFUL', data: res.data });
          return res.data;
        }

        if (res.status === 403 || res.status === 401) {
          dispatch({ type: 'LOGIN_FAILED', data: res.data });
          throw res.data;
        }

        dispatch({ type: 'REGISTRATION_FAILED', data: res.data });
        throw res.data;
      });
  };
};
