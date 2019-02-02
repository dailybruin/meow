import { postPost, postList, postDetail } from "../services/api";

const savePostRequest = () => ({
  type: "SAVE_POST_REQUEST"
});

const savePostSuccess = () => ({
  type: "SAVE_POST_SUCCESS"
});

export const savePost = postId => (dispatch, getState) => {
  dispatch(savePostRequest);

  const postData = getState().default.post;

  return postPost(postId, postData).then(
    ({ data, status }) => {
      if (status >= 400) {
        dispatch({
          type: "SAVE_POST_FAIL",
          message: "Could not save or create post."
        });
      } else {
        dispatch(savePostSuccess());
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

export const loadPosts = () => {
  return dispatch => {
    return postList().then(
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

export const editPost = data => dispatch =>
  dispatch({
    type: "EDIT_POST",
    payload: data
  });
