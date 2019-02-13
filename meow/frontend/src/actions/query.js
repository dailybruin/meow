/**
 * @param time should be a moment object
 */
export const changeTime = time => {
  return dispatch => {
    dispatch({
      type: "CHANGE_TIME",
      time
    });
  };
};

export const addStatus = status => {
  return dispatch => {
    dispatch({
      type: "ADD_STATUS",
      status
    });
  };
};

export const removeStatus = status => {
  return dispatch => {
    dispatch({
      type: "REMOVE_STATUS",
      status
    });
  };
};

export const addSection = section => {
  return dispatch => {
    dispatch({
      type: "ADD_SECTION",
      section
    });
  };
};

export const removeSection = section => {
  return dispatch => {
    dispatch({
      type: "REMOVE_SECTION",
      section
    });
  };
};
