import React from "react";
import { Row, Col, Slider, InputNumber } from "antd";
import { strict } from "assert";

export default class Time extends React.Component {
  state = {
    inputValue: 24,
    time: "12:00 PM"
  };

  getTime = value => {
    let time = Math.floor(value / 2);
    time = time % 12;
    if (time == 0) {
      time = "12";
    } else {
      time = "" + time;
    }
    if (value % 2 == 0) {
      time = time + ":00";
    } else {
      time = time + ":30";
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
      inputValue: value,
      time: this.getTime(value)
    });
  };

  render() {
    return (
      <Col>
        <Row>
          <h3>{this.state.time}</h3>
        </Row>
        <Row>
          <Slider
            min={0}
            max={47}
            defaultValue={24}
            onChange={this.onChange}
            tooltipVisible={false}
          />
        </Row>
      </Col>
    );
  }
}
