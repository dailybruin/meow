import React from "react";
import EditPost from "../EditPost";

const AddPost = () => {
  const defaultData = {
    slug: null,
    story_url: null,
    post_facebook: null,
    post_twitter: null,
    pub_ready_copy_user: false,
    pub_ready_online_user: false,
    section: null,
    pub_date: new Date(),
    pub_time: new Date()
  };

  return <EditPost defaultData={defaultData} />;
};

export default AddPost;
