import React from 'react';
import Collapsible from 'react-collapsible';
import Datepicker from './Datepicker';
import CustomCheckbox from './CustomCheckbox';
import '../scss/components/_sidebar.scss';

const Sidebar = () => (
  <div class="sidebar">
    <Collapsible transitionTime={300} trigger="post date">
      <Datepicker />
    </Collapsible>
    <Collapsible transitionTime={300} trigger="section">
      <CustomCheckbox title="section" />
    </Collapsible>
    <Collapsible transitionTime={300} trigger="post time">
      <p>I am a slider.. eventually</p>
    </Collapsible>
    <Collapsible transitionTime={300} trigger="status">
      <CustomCheckbox title="status" />
    </Collapsible>
  </div>
);

export default Sidebar;
