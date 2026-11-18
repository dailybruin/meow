import React from "react";

const timeOptions = { month: "long", day: "2-digit", hour: "2-digit", minute: "2-digit" };

class TodayClock extends React.Component {
  state = {
    time: new Date().toLocaleString("en-US", timeOptions)
  };

  componentDidMount() {
    this.scheduleNextUpdate();
  }

  scheduleNextUpdate = () => {
    const now = new Date();
    // Recalculate each time so a delayed callback does not shift future updates.
    const delay = 60000 - (now.getSeconds() * 1000 + now.getMilliseconds());

    this.timer = setTimeout(() => {
      this.setState({
        time: new Date().toLocaleString("en-US", timeOptions)
      });
      this.scheduleNextUpdate();
    }, delay);
  };

  componentWillUnmount() {
    clearTimeout(this.timer);
  }

  render() {
    return (
      <h3 style={{ alignSelf: "center", color: this.props.color }}>today: {this.state.time}</h3>
    );
  }
}

export default TodayClock;
