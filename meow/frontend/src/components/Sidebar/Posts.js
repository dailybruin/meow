import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { Collapse, Calendar, Checkbox } from "antd";
import moment from "moment";

import { logout } from "../../actions/user";
import {
  changeTime,
  addSection,
  addStatus,
  removeSection,
  removeStatus
} from "../../actions/query";

import "./Posts.css";
import TimeSlider from "./TimeSlider";
import section from "../../reducers/section";

const { Panel } = Collapse;

class LeftSidebarPosts extends React.Component {
  logout = () => {
    this.props.logout().then(() => {
      this.props.history.push("/");
    });
  };

  getCurrentDate = () => {
    const { search } = this.props.location;
    if (search) return moment(search);
    return moment(); // now
  };

  setStatus = statusName => {
    return e => {
      if (e.target.checked) this.props.addStatus(statusName);
      else this.props.removeStatus(statusName);
    };
  };

  setSection = sectionName => {
    return e => {
      if (e.target.checked) this.props.addSection(sectionName);
      else this.props.removeSection(sectionName);
    };
  };

  /**
   * @param hour has range [0:24)
   */
  changeTime = hour => {
    this.props.changeTime(hour);
  };

  render() {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          flexDirection: "column",
          minHeight: "100%"
        }}
      >
        <Collapse className="meow-collapse" defaultActiveKey={["1"]}>
          <Panel className="full-width-panel" header="posts from" key="1">
            <div style={{ width: "100%", backgroundColor: "white" }}>
              <Calendar
                onSelect={x =>
                  this.props.history.push({
                    pathname: "/",
                    search: `date=${x.format("MM/DD/YYYY")}`
                  })
                }
                fullscreen={false}
                defaultValue={this.getCurrentDate()}
              />
            </div>
          </Panel>
          <Panel header="section" key="2">
            {this.props.sections.map(s => (
              <Checkbox value={s.id} onChange={this.setSection(s.id)}>
                {s.name}
              </Checkbox>
            ))}
          </Panel>
          <Panel header="post time" key="3">
            <TimeSlider onSlideEnd={this.changeTime} />
          </Panel>
          <Panel header="status" key="4">
            <Checkbox onChange={this.setStatus("READ_TO_POST")}>ready to post</Checkbox>
            <Checkbox onChange={this.setStatus("DRAFT")}>draft</Checkbox>
            <Checkbox onChange={this.setStatus("SENT")}>sent</Checkbox>
          </Panel>
        </Collapse>
        <div
          onClick={this.logout}
          style={{
            width: "100%",
            height: "8vh",
            backgroundColor: "#2a73b2",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            borderTop: "1px solid #d9d9d9",
            cursor: "pointer"
          }}
        >
          <h1
            style={{
              marginBottom: 0,
              color: "white"
            }}
          >
            Sign Out
          </h1>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  sections: state.default.section.sections
});

const mapDispatchToProps = {
  logout,
  changeTime,
  addSection,
  addStatus,
  removeSection,
  removeStatus
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(LeftSidebarPosts)
);
