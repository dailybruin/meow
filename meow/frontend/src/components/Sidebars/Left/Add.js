import React from "react";
import { DatePicker, TimePicker, Button } from "antd";
import "./Add.css";

class LeftSidebarAdd extends React.Component {
  render() {
    return (
      <div className="leftSidebarAdd">
        <DatePicker />
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

export default LeftSidebarAdd;
