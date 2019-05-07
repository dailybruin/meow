import { postPost, postList, postDetail, postSendNow } from "../services/api";
import { alertError, alertSuccess } from "./alert";

const savePostRequest = () => ({
  type: "SAVE_POST_REQUEST"
});

const savePostSuccess = () => ({
  type: "SAVE_POST_SUCCESS"
});

export const savePost = (postId, postData) => dispatch => {
  dispatch(savePostRequest);

  return postPost(postId, postData).then(
    ({ data, status }) => {
      console.log(status);
      if (status >= 400) {
        dispatch({
          type: "SAVE_POST_FAIL",
          message: "Could not save or create post."
        });
        //alertError("Saving failed :(", "Maybe the url is not a valid url?")(dispatch);
      } else {
        dispatch(savePostSuccess());
        alertSuccess("Saved successfully!")(dispatch);
        return data;
      }
    },
    err => {
      console.log(err.response.data["story_url"][0]);
      //story_url: Array [ "Enter a valid URL." ]
      let description = "Unknown error";
      let data = err.response.data;
      if (data["story_url"] !== undefined) {
        description = "Invalid URL";
      }
      alertError("Saving failed :(", description)(dispatch);
      dispatch({
        type: "NETWORK_ERROR",
        message: "Could not connect to server."
      });
    }
  );
};

export const loadPosts = YMD => dispatch => {
  return postList(YMD).then(
    ({ data, status }) => {
      if (status >= 400) {
        dispatch({
          type: "LOAD_POSTS_FAIL",
          message: "Could not load posts."
        });
      } else {
        dispatch({
          type: "LOAD_POSTS_SUCCESS"
        });
        return data;
      }
    },
    err => {
      dispatch({
        type: "NETWORK_ERROR",
        message: "Could not connect to server."
      });
    }
  );
};

export const sendPostNow = postId => {
  return dispatch => {
    return postSendNow(postId).then(
      ({ data, status }) => {
        if (status >= 400) {
          dispatch({
            type: "POST_SEND_NOW_FAIL",
            message: `Could not send ${postId} now.`
          });
        } else {
          dispatch({ type: "POST_SEND_NOW_SUCCESS", payload: data });
          return status; //returning status instead of data
        }
      },
      err => {
        dispatch({
          type: "NETWORK_ERROR",
          message: "Could not connect to server."
        });
      }
    );
  };
};

export const getPost = postId => {
  return dispatch => {
    return postDetail(postId).then(
      ({ data, status }) => {
        if (status >= 400) {
          dispatch({
            type: "FETCH_POST_FAIL",
            message: `Could not load section ${postId}.`
          });
        } else {
          dispatch({ type: "FETCH_POST_SUCCESS", payload: data });
          return data;
        }
      },
      err => {
        //TODO figure out what errors happen and what object is returned
        console.log(err.response.data);
        //story_url: Array [ "Enter a valid URL." ]
        let description = "Unknown error";
        let data = err.response.data;
        if (data["story_url"] !== undefined) {
          description = "Invalid URL";
        }
        alertError("Send now failed :(", description)(dispatch);

        dispatch({
          type: "NETWORK_ERROR",
          message: "Could not connect to server."
        });
      }
    );
  };
};

export const editPost = data => dispatch =>
  dispatch({
    type: "EDIT_POST",
    payload: data
  });
