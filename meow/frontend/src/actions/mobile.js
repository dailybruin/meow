import config from "../config";

const setDevice = width => dispatch => {
  let device;

  if (width < 600) {
    device = config.MOBILE;
  } else if (width < 1200) {
    device = config.TABLET;
  } else {
    device = config.DESKTOP;
  }

  dispatch({
    type: "SET_DEVICE",
    device
  });
};

export default setDevice;
