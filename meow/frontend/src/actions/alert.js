export const alert_type_none = "NONE";
export const alert_type_warning = "WARNING";
export const alert_type_error = "ERROR";
export const alert_type_success = "SUCCESS";

import { Button, notification } from "antd";

const openNotification = (type, title, description) => {
  notification.destroy(); //clears notifications
  notification[type]({
    message: title,
    description: description,
    onClick: () => {
      console.log("Notification Clicked!");
    }
  });
};

export const alertNone = () => {
  return dispatch => {
    dispatch({
      type: "PUSH_ALERT",
      payload: {
        type: alert_type_none,
        title: title,
        description: description
      }
    });
  };
};

export const alertSuccess = (title, description) => {
  return dispatch => {
    dispatch({
      type: "PUSH_ALERT",
      payload: {
        type: alert_type_success,
        title: title,
        description: description
      }
    });
  };
};

export const alertError = (title, description) => {
  return dispatch => {
    dispatch({
      type: "PUSH_ALERT",
      payload: {
        type: alert_type_error,
        title: title,
        description: description
      }
    });
    openNotification("error", title, description);
  };
};

export const alertWarning = (title, description) => {
  return dispatch => {
    dispatch({
      type: "PUSH_ALERT",
      payload: {
        type: alert_type_warning,
        title: title,
        description: description
      }
    });
  };
};
