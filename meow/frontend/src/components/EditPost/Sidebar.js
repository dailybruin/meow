import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { setDate } from "../../actions/post";

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
            defaultValue={
              this.props.pub_date
                ? moment(this.props.pub_date, "YYYY-MM-DD")
                : moment(this.props.date, "YYYY-MM-DD")
            }
            onChange={x => {
              this.props.changeDay(x.format("YYYY-MM-DD"));
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
          onChange={x => {
            this.props.editPost({
              pub_time: x.format("HH:mm").concat(":00")
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

const mapStateToProps = state => ({
  pub_date: state.default.post.selected_date
});
const mapDispatchToProps = {
  changeDay: date => setDate(date)
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Sidebar)
);
