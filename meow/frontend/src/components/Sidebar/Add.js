import React from "react";
import { connect } from "react-redux";
import { Calendar, TimePicker, Button } from "antd";
import "./Add.css";

import { editPost } from "../../actions/post";

class LeftSidebarAdd extends React.Component {
  handleFormChange = changedFields => {
    this.props.editPost(changedFields);
  };

  render() {
    return (
      <div className="leftSidebarAdd">
        <div style={{ width: "100%", backgroundColor: "white" }}>
          <Calendar fullscreen={false} />
        </div>
        <TimePicker use12Hours format="h:mm a" />
        <Button
          style={{
            backgroundColor: "white",
            color: "black",
            border: "2px solid black",
            borderRadius: "20px",
            fontSize: "1.4em"
          }}
          type="primary"
          size="large"
        >
          now!
        </Button>
      </div>
    );
  }
}

const mapDispatchToProps = {
  editPost: data => editPost(data)
};

export default connect(mapDispatchToProps)(LeftSidebarAdd);
