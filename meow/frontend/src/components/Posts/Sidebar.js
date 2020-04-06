import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { Collapse, Calendar, Checkbox } from "antd";
import moment from "moment";

import { logout } from "../../actions/user";

import "./Sidebar.css";
import TimeSlider from "./TimeSlider";
import { CaretRightOutlined } from "@ant-design/icons";

const { Panel } = Collapse;

class Sidebar extends React.Component {
  constructor(props) {
    super(props);
    this.editParent = this.props.editParent.bind(this);
  }

  logout = () => {
    this.props.logout().then(() => {
      this.props.history.push("/");
    });
  };

  addStatus = status => {
    const newStatus = [...new Set([...this.props.query.status, status])];
    this.editParent({
      status: newStatus
    });
  };

  removeStatus = status => {
    const newStatus = this.props.query.status.filter(x => x != status);
    this.editParent({
      status: newStatus
    });
  };

  changeStatus = status => {
    return e => {
      if (e.target.checked) {
        this.addStatus(status);
      } else {
        this.removeStatus(status);
      }
    };
  };

  addSection = sectionId => {
    const newSection = [...this.props.query.section, sectionId];
    this.editParent({
      section: newSection
    });
  };

  removeSection = sectionId => {
    const newSection = this.props.query.section.filter(x => x != sectionId);
    this.editParent({
      section: newSection
    });
  };

  changeSection = sectionId => {
    return e => {
      if (e.target.checked) {
        this.addSection(sectionId);
      } else {
        this.removeSection(sectionId);
      }
    };
  };

  /**
   * @param hour has range [0:24)
   */
  changeTime = hour => {
    this.editParent({
      time: hour
    });
  };

  render() {
    let primaryBackgroundAndFont = {
      backgroundColor: `${this.props.theme.primary}`,
      color: `${this.props.theme.secondary_font_color}`
    };
    let secondaryBackgroundAndFont = {
      backgroundColor: `${this.props.theme.secondary}`,
      color: `${this.props.theme.secondary_font_color}`
    };
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          flexDirection: "column",
          minHeight: "100%"
        }}
      >
        <Collapse
          className="meow-collapse"
          style={primaryBackgroundAndFont}
          defaultActiveKey={["1"]}
          bordered={false}
          expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
          expandIconPosition="right"
        >
          <Panel
            className="full-width-panel"
            style={secondaryBackgroundAndFont}
            header={
              <span style={{ color: `${this.props.theme.secondary_font_color}` }}>posts from</span>
            }
            key="1"
          >
            <div style={{ width: "100%", backgroundColor: "white" }}>
              <Calendar
                onSelect={x =>
                  this.props.history.push({
                    pathname: "/",
                    search: `date=${x.format("YYYY-MM-DD")}`
                  })
                }
                fullscreen={false}
                defaultValue={
                  this.props.date ? moment(this.props.date, "YYYY-MM-DD") : moment.now()
                }
              />
            </div>
          </Panel>
          <Panel
            header={
              <span style={{ color: `${this.props.theme.secondary_font_color}` }}>section</span>
            }
            key="2"
          >
            {this.props.sections.map(s => (
              <Checkbox
                style={{ color: `${this.props.theme.secondary_font_color}` }}
                value={s.id}
                onChange={this.changeSection(s.id)}
              >
                {s.name}
              </Checkbox>
            ))}
          </Panel>
          <Panel
            header={
              <span style={{ color: `${this.props.theme.secondary_font_color}` }}>post time</span>
            }
            style={secondaryBackgroundAndFont}
            key="3"
          >
            <TimeSlider
              fontColor={`${this.props.theme.secondary_font_color}`}
              onSlideEnd={this.changeTime}
            />
          </Panel>
          <Panel
            header={
              <span style={{ color: `${this.props.theme.secondary_font_color}` }}>status</span>
            }
            key="4"
          >
            <Checkbox
              style={{ color: `${this.props.theme.secondary_font_color}` }}
              onChange={this.changeStatus("READY")}
            >
              ready to post
            </Checkbox>
            <Checkbox
              style={{ color: `${this.props.theme.secondary_font_color}` }}
              onChange={this.changeStatus("DRAFT")}
            >
              draft
            </Checkbox>
            <Checkbox
              style={{ color: `${this.props.theme.secondary_font_color}` }}
              onChange={this.changeStatus("SENT")}
            >
              sent
            </Checkbox>
          </Panel>
        </Collapse>
        <div
          onClick={this.logout}
          style={{
            width: "100%",
            height: "8vh",
            backgroundColor: `${this.props.theme.primary}`,
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
              color: `${this.props.theme.primary_font_color}`
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
  sections: state.default.section.sections,
  theme: state.default.user.theme
});

const mapDispatchToProps = {
  logout
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Sidebar)
);
