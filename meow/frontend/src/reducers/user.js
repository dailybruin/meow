const initialState = { username: null, firstName: null, isAuthenticated: null };
export default function user(state = initialState, action) {
  switch (action.type) {
    case "LOGOUT": {
      return initialState;
    }
    case "USER_LOGIN_SUCCESS": {
      return {
        ...state,
        username: action.payload.username === "" ? null : action.payload.username,
        firstName: action.payload.firstName === "" ? null : action.payload.firstName,
        isAuthenticated: action.payload.isAuthenticated
      };
    }
    default:
      return state;
  }
}
