import React from "react";
import moment from "moment";
import { Calendar, TimePicker, Button } from "antd";
import "./Sidebar.css";

class Sidebar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      intialTimeCheck: true,
      previousSection: null // the previous section that the user selected
    };
  }

  componentDidUpdate() {
    if (
      (this.state.intialTimeCheck &&
        this.props.pub_time !== null &&
        this.props.pub_date !== null &&
        this.props.section !== null) ||
      // we include this comparison because otherwise the request is invoked during every update
      (this.state.previousSection !== null && this.state.previousSection !== this.props.section)
    ) {
      this.setState({ previousSection: this.props.section });
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
