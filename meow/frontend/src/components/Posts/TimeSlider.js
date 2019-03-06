import React from "react";
import moment from "moment";
import { Slider } from "antd";

export default class TimeSlider extends React.Component {
  state = {
    time: 24
  };

  getTime = value => {
    let time = Math.floor(value / 2);
    time = time % 24;

    if (time == 0) {
      time = "12";
    } else {
      time = "" + time;
    }
    if (value % 2 == 0) {
      time += "00";
    } else {
      time += "30";
    }

    return moment(time, "hmm").format("HH:mm");
  };

  formatTime = () => {
    const value = this.state.time;

    let time = Math.floor(value / 2);
    time = time % 12;

    if (time == 0) {
      time = "12";
    } else {
      time = "" + time;
    }

    if (value % 2 == 0) {
      time += ":00";
    } else {
      time += ":30";
    }

    if (value > 24) {
      time = time + " PM";
    } else {
      time = time + " AM";
    }
    return time;
  };

  onChange = value => {
    this.setState({
      time: value
    });
    this.props.onSlideEnd(this.getTime(value));
  };

  render() {
    return (
      <div style={{ textAlign: "center" }}>
        <h3>{this.formatTime()}</h3>
        <Slider
          min={0}
          max={47}
          defaultValue={this.state.time}
          onChange={this.onChange}
          tooltipVisible={false}
        />
      </div>
    );
  }
}
