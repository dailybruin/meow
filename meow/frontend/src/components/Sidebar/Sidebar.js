import React from 'react';
import Collapsible from 'react-collapsible';
import Datepicker from './Datepicker';

const Sidebar = () => (
  <Collapsible transitionTime={300} trigger="post date">
    <Datepicker />
  </Collapsible>
);

export default Sidebar;
