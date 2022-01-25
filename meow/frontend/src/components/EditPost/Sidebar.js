import React from "react";
import { Calendar, TimePicker, Button } from "antd";
import { checkPostTime } from "../../services/api";
import moment from "moment";
import "./Sidebar.css";

class Sidebar extends React.Component {
  state = {
    date: new Intl.DateTimeFormat("en-GB", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit"
    })
      .format(new Date())
      .split("/")
      .reverse()
      .join("-"),
    intialTimeCheck: true
  };

  componentDidUpdate() {
    if (this.state.intialTimeCheck && this.props.pub_time !== null) {
      checkPostTime(this.props.pub_time, this.state.date);
      this.setState({ intialTimeCheck: false });
    }
  }

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
            checkPostTime(moment(timestring, "LT").format("HH:mm:ss"), this.state.date);

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
      </div>
    );
  }
}

export default Sidebar;
