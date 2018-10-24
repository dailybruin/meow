import React from 'react';
import Checkbox from 'rc-checkbox';

export default class CustomCheckbox extends React.Component {
  constructor(props) {
    super(props);
    this.renderSection = this.renderSection.bind(this);
    this.renderStatus = this.renderStatus.bind(this);
  }

  renderSection() {
    return (
      <form>
        <label>
          <Checkbox name="Daily Bruin" />
          Daily Bruin
        </label>
        <label>
          <Checkbox name="Sports" />
          Sports
        </label>
      </form>
    );
  }

  renderStatus() {
    return (
      <form>
        <label>
          <Checkbox name="ready" />
          ready
        </label>
        <label>
          <Checkbox name="draft" />
          draft
        </label>
        <label>
          <Checkbox name="sent" />
          sent
        </label>
      </form>
    );
  }

  render() {
    return this.props.title === 'section' ? this.renderSection() : this.renderStatus();
  }
}
