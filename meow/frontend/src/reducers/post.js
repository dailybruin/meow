import * as types from '../actions/types';

export default function post(state = {}, action) {
  switch (action.type) {
    case types.FETCH_POSTS:
      return {
        ...state,
        posts: action.data.posts
      };
    case types.ADD_POST:
      return { ...state, posts: [...state.posts, action.data.post] };
    default:
      return state;
  }
}
