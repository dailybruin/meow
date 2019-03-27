const initialState = {
  username: null,
  firstName: null,
  isAuthenticated: null,
  //TODO: it feels wrong to hard code since we have this hardcoded in 2 places
  // (in the migrations which add the Daily Bruin theme)
  theme: {
    name: "Daily Bruin",
    primary: "3D73AD",
    secondary: "4699DA",
    primary_font_color: "FFFFFF",
    secondary_font_color: "FFFFFF",
    tertiary: "FFFFFF",
    id: 1
  }
};
export default function user(state = initialState, action) {
  switch (action.type) {
    case "LOGOUT": {
      return initialState;
    }
    case "USER_LOGIN_SUCCESS": {
      console.log(action.payload);
      return {
        ...state,
        username: action.payload.username === "" ? null : action.payload.username,
        firstName: action.payload.firstName === "" ? null : action.payload.firstName,
        //the selected theme
        theme: action.payload.theme ? action.payload.theme : initialState.theme,
        isAuthenticated: action.payload.isAuthenticated
      };
    }
    case "THEME_CHANGE": {
      return {
        ...state,
        theme: action.payload.theme
      };
    }
    default:
      return state;
  }
}
