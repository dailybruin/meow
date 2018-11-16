import * as types from '../actions/types';

export default function post(state = {}, action) {
  switch (action.type) {
    case 'FETCH_POSTS':
      return {
        ...state,
        posts: action.data.posts
      };
    default:
      return state;
  }
}
