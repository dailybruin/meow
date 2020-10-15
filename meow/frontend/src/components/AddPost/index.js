import React from "react";
import EditPost from "../EditPost";

const dateOpts = {
  year: "numeric",
  month: "2-digit",
  day: "2-digit"
};

const timeOpts = {
  hour: "2-digit",
  minute: "2-digit",
  hour12: false
};

const AddPost = () => {
  const date = new Date();

  const defaultData = {
    slug: null,
    story_url: null,
    post_facebook: null,
    post_twitter: null,
    pub_ready_copy_user: null,
    pub_ready_online_user: null,
    pub_ready_copy: false,
    pub_ready_online: false,
    section: null,
    version_number: 0,
    pub_date: new Intl.DateTimeFormat("en-GB", dateOpts)
      .format(date)
      .split("/")
      .reverse()
      .join("-"),
    pub_time: new Intl.DateTimeFormat("en-US", timeOpts).format(date).concat(":00")
  };

  return <EditPost defaultData={defaultData} />;
};

export default AddPost;
