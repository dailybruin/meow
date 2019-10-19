import React from "react";
import { connect } from "react-redux";
import { List, Row, Col } from "antd";

import "./Sections.css";
import { loadSections } from "../../actions/section";
import SectionModal from "./SectionModal";

class Sections extends React.Component {
  state = {
    showModal: false
  };

  componentDidMount() {
    this.props.loadSections();
  }

  dismissModal = () => {
    this.setState({
      showModal: false
    });
  };

  showModal = section => {
    this.setState({
      showModal: true,
      name: section.name,
      id: section.id,
      facebook_account_handle: section.facebook_account_handle,
      twitter_account_handle: section.twitter_account_handle,
      slack_channel: section.slack_channel
    });
  };

  render() {
    return (
      <React.Fragment>
        {this.state.showModal ? <SectionModal {...this.state} dismiss={this.dismissModal} /> : null}
        <List
          id="meow-sections"
          itemLayout="vertical"
          size="large"
          pagination={false}
          dataSource={this.props.sections}
          renderItem={item => {
            const itembg =
              item.name === "Daily Bruin"
                ? { backgroundColor: "#333333" }
                : { backgroundColor: "#1A9AE0" };

            return (
              <List.Item onClick={() => this.showModal(item)} style={itembg} key={item.name}>
                <List.Item.Meta title={item.name} />
                <Row>
                  <Col span={12}>
                    facebook
                    <div>{item.facebook_account_handle}</div>
                  </Col>
                  <Col span={12}>
                    twitter
                    <div>{item.twitter_account_handle}</div>
                  </Col>
                </Row>
              </List.Item>
            );
          }}
        />
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => ({
  sections: state.default.section.sections
});

const mapDispatchToProps = {
  loadSections
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Sections);
