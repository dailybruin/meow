const initialState = { type: "NONE", title: "", description: "" };
export default function error(state = initialState, action) {
  switch (action.type) {
    case "PUSH_ALERT":
      return {
        ...state,
        type: action.payload.type,
        title: action.payload.title,
        description: action.payload.description
      };
    default:
      return state;
  }
}
