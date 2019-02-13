const initialState = { slug: "" };
export default function post(state = initialState, action) {
  switch (action.type) {
    case "FETCH_POST_SUCCESS":
      return {
        ...state,
        slug: action.payload.slug,
        story_url: action.payload.story_url,
        sections: action.payload.sections,
        post_facebook: action.payload.post_facebook,
        post_twitter: action.payload.post_twitter,
        pub_date: action.payload.pub_time,
        pub_time: action.payload.pub_time,
        pub_ready_copy_user: action.payload.pub_ready_copy_user,
        pub_ready_online_user: action.payload.pub_ready_online_user
      };
    case "EDIT_POST":
      return {
        ...state,
        ...action.payload
      };
    default:
      return state;
  }
}
