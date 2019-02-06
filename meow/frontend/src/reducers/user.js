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
        lastName: action.payload.lastName === "" ? null : action.payload.lastName,
        slack_username: action.payload.slack_username === "" ? null : action.payload.slack_username,
        email: action.payload.email,
        role: action.payload.role,
        bio: action.payload.bio,
        profile_img: action.payload.profile_img,
        theme: action.payload.theme,
        isAuthenticated: action.payload.isAuthenticated
      };
    }
    default:
      return state;
  }
}
