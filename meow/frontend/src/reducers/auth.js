import * as types from '../actions/types';

export default function auth(state = {}, action) {
  switch (action.type) {
    case 'USER_LOADING':
      return {
        ...state,
        isLoading: true
      };
    //should it just be a string or is it better to import types?
    case types.FETCH_USER:
      return {
        ...state,
        user: action.data.user
      };

    case 'LOGIN_SUCCESSFUL':
      return {
        ...state,
        isAuthenticated: true,
        token: action.data.key,
        isLoading: false,
        errors: null
      };

    case 'LOGIN_FAILED':
    case 'LOGOUT':
      return {};

    default:
      return state;
  }
}
