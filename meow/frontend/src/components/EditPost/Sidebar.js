import React from "react";
import { Calendar, TimePicker, Button } from "antd";
import moment from "moment";
import "./Sidebar.css";

class Sidebar extends React.Component {
  render() {
    return (
      <div className="leftSidebarAdd">
        <div style={{ width: "100%", backgroundColor: "white" }}>
          <Calendar
            fullscreen={false}
            value={moment(this.props.pub_date)}
            onChange={x => {
              this.props.editPost({
                pub_date: x.format("YYYY-MM-DD")
              });
            }}
          />
        </div>
        <TimePicker
          use12Hours
          format="h:mm a"
          value={moment(this.props.pub_time, "HH:mm:ss")}
          onChange={(x, timestring) => {
            //timestring = 2:00 pm (implied PST. Meow will always use PST for now)
            // we need to convert that 14:00:00
            // Note: we are avoiding date time because its notoriously bad
            // instead we are using moment.js
            this.props.editPost({
              pub_time: moment(timestring, "LT").format("HH:mm:ss")
            });
          }}
        />
        {this.props.mobile === true ? null : (
          <Button
            onClick={this.props.sendNow}
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
        )}
        {this.props.mobile === true ? null : (
          <Button
            onClick={this.props.delete}
            style={{
              color: "white",
              backgroundColor: "red",
              border: "2px solid black",
              borderRadius: "20px",
              fontSize: "1.4em"
            }}
            type="danger"
            size="large"
          >
            delete
          </Button>
        )}
        <span className="error-message-section">{this.props.sectionError}</span>
      </div>
    );
  }
}

export default Sidebar;
