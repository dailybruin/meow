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
    case 'LOGOUT_SUCCESSFUL':
      return {
        ...state,
        errors: action.data.key,
        token: null,
        user: null,
        isAuthenticated: false,
        isLoading: false
      };

    default:
      return state;
  }
}
