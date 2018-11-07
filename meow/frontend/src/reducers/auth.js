export default function auth(state = {}, action) {
  switch (action.type) {
    case 'USER_LOADING':
      return {
        ...state,
        isLoading: true
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
