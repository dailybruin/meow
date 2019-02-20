const initialState = { time: [], sections: [], status: [] };

export default function section(state = initialState, action) {
  switch (action.type) {
    case "LOAD_SECTIONS_SUCCESS":
      return {
        ...state,
        sections: action.payload
      };

    case "CHANGE_TIME":
      return {
        ...state,
        time: action.time
      };
    case "ADD_STATUS":
      return {
        ...state,
        status: [...state.status, action.status]
      };
    case "REMOVE_STATUS":
      return {
        ...state,
        status: state.status.filter(x => x !== action.status)
      };
    case "ADD_SECTION":
      return {
        ...state,
        sections: [...state.sections, action.section]
      };
    case "REMOVE_SECTION":
      return {
        ...state,
        sections: state.sections.filter(x => x !== action.section)
      };
    default:
      return state;
  }
}
