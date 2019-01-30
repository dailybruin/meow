import React from "react";
import { List, Row, Col } from "antd";

import "./Sections.css";

const listData = [
  {
    title: "daily bruin",
    facebook: "https://www.facebook.com/dailybruin/",
    twitter: "https://twitter.com/dailybruin"
  },
  {
    title: "sports",
    facebook: "https://www.facebook.com/dailybruin/",
    twitter: "https://twitter.com/dailybruin"
  }
];

class Sections extends React.Component {
  render() {
    return (
      <List
        id="meow-sections"
        itemLayout="vertical"
        size="large"
        pagination={false}
        dataSource={listData}
        renderItem={item => {
          const itembg =
            item.title === "daily bruin"
              ? { backgroundColor: "#333333" }
              : { backgroundColor: "#1A9AE0" };

          return (
            <List.Item style={itembg} key={item.title}>
              <List.Item.Meta title={item.title} />
              <Row>
                <Col span={12}>
                  facebook
                  <div>{item.facebook}</div>
                </Col>
                <Col span={12}>
                  twitter
                  <div>{item.twitter}</div>
                </Col>
              </Row>
            </List.Item>
          );
        }}
      />
    );
  }
}

export default Sections;
