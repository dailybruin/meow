import { sectionList } from "../services/api";

export const loadSections = () => dispatch =>
  sectionList().then(
    ({ data, status }) => {
      if (status >= 400) {
        dispatch({
          type: "LOAD_SECTIONS_FAIL",
          message: "Could not load sections."
        });
      } else {
        dispatch({
          type: "LOAD_SECTIONS_SUCCESS",
          payload: data
        });
      }
    },
    err => {
      dispatch({
        type: "NETWORK_ERROR",
        message: "Could not connect to server."
      });
    }
  );
