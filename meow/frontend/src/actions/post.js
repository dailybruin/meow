import { postPost, postList, postDetail } from "../services/api";

const createPostRequest = () => ({
  type: "CREATE_POST_REQUEST"
});

const createPostSuccess = () => ({
  type: "CREATE_POST_SUCCESS"
});

export const createPost = data => {
  return dispatch => {
    dispatch(createPostRequest);

    return postPost(data).then(
      ({ data, status }) => {
        if (status >= 400) {
          dispatch({
            type: "CREATE_SECTION_FAIL",
            message: "Could not create section."
          });
        } else {
          dispatch(createPostSuccess());
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
    type: "EDIT_POST_SLUG",
    payload: data
  });
