import config from "../config";

const initialState = { device: config.DESKTOP };

export default function mobile(state = initialState, action) {
  switch (action.type) {
    case "SET_DEVICE":
      return {
        device: action.device
      };
    default:
      return state;
  }
}
