const initialState = { sections: [] };
export default function section(state = initialState, action) {
  switch (action.type) {
    case "LOAD_SECTIONS_SUCCESS":
      return {
        ...state,
        sections: action.payload
      };
    default:
      return state;
  }
}
