import React from "react";
import { connect } from "react-redux";
import { Calendar, TimePicker, Button } from "antd";
import moment from "moment";
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
          <Calendar
            defaultValue={moment(this.props.pub_date)}
            onChange={x => {
              console.log("Got in here");
              this.props.changeDay(x.format("YYYY-MM-DD"));
              this.handleFormChange({
                pub_date: x.format("YYYY-MM-DD")
              });
            }}
            fullscreen={false}
          />
        </div>
        <TimePicker
          {...(this.props.pub_time
            ? { value: moment(this.props.pub_time, "HH:mm:ss") }
            : { value: null })}
          onChange={x => {
            this.handleFormChange({
              pub_time: x.format("HH:mm")
            });
          }}
          use12Hours
          format="h:mm a"
        />
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

const mapStateToProps = state => ({
  pub_date: state.default.post.pub_date,
  pub_time: state.default.post.pub_time
});

const mapDispatchToProps = {
  editPost: data => editPost(data),
  changeDay: data => setDate(date)
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LeftSidebarAdd);
