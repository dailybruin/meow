import React from "react";
import { Calendar, TimePicker, Button } from "antd";
import { checkPostTime } from "../../services/api";
import moment from "moment";
import "./Sidebar.css";

class Sidebar extends React.Component {
  state = {
    intialTimeCheck: true,
    selectedSection: null
  };

  componentDidUpdate() {
    if (
      (this.state.intialTimeCheck &&
        this.props.pub_time !== null &&
        this.props.pub_date !== null &&
        this.props.section !== null) ||
      (this.state.selectedSection !== null && this.state.selectedSection !== this.props.section)
    ) {
      this.setState({ selectedSection: this.props.section });
      checkPostTime(this.props.pub_time, this.props.pub_date, this.props.section)
        .then(response => {
          if (response.data && response.data.message) {
            if (response.data.hasConflict) {
              this.props.setHasMeowWithin15Mins(true);
            } else {
              this.props.setHasMeowWithin15Mins(false);
            }
          }
        })
        .catch(error => {
          console.log(error);
        });

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

            checkPostTime(
              moment(timestring, "LT").format("HH:mm:ss"),
              this.props.pub_date,
              this.props.section
            )
              .then(response => {
                if (response.data && response.data.message) {
                  if (response.data.message !== "Success") {
                    this.props.setHasMeowWithin15Mins(true);
                  } else {
                    this.props.setHasMeowWithin15Mins(false);
                  }
                }
              })
              .catch(error => {
                console.log(error);
              });

            this.props.editPost({
              pub_time: moment(timestring, "LT").format("HH:mm:ss")
            });
          }}
        />
        {this.props && this.props.hasMeowWithin15Mins ? (
          <div
            style={{
              color: "white"
            }}
          >
            Warning: The selected time is within 15 minutes of another scheduled meow.
          </div>
        ) : null}
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
