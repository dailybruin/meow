import React from "react";
import moment from "moment";

/**
 * AutoUpdateTimer is a React Component that returns a "since-then"
 * time string for a different time. E.g. (2 days ago).
 * This compoenent auto renders itself every 10 second.
 * Props:
 * @param {string} this.props.time should be a be a time string
 * that satisfies ISO 8601.
 */
class AutoUpdateTimer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      updateTrigger: true
    };
    this.timer = this.timer.bind(this);
  }

  componentDidMount() {
    this.intervalID = setInterval(this.timer, 1000 * 10);
  }

  componentWillUnmount() {
    clearInterval(this.intervalID);
  }

  timer() {
    const { updateTrigger } = this.state;
    this.setState({ updateTrigger: !updateTrigger });
  }

  render() {
    const { time } = this.props;
    const sinceTime = moment(time).fromNow();
    return <p>{sinceTime}</p>;
  }
}

export default AutoUpdateTimer;
