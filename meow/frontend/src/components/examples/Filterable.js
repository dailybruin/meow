import React from "react";
import axios from "axios";
import Collapsible from 'react-collapsible';
import Checkers from "./Checkbox";

const triggers = [{title: 'posts from', type: 'datepicker'}, {title: 'section', type: 'checkbox'},
                  {title: 'post time', type: 'slider'}, {title: 'status', type: 'checkbox'}];

export default class Filterable extends React.Component{

  createDropDown = (title, type) =>{
    switch(type){
      case 'datepicker':
        return <div><p>This is a datepicker</p></div>
      case 'slider':
        return <div><p>This is a slider</p></div>
      case 'checkbox':
        return (
          <div>
            <Checkers title={title}/>
          </div>
        );
      default:
        return <div><p>Uh oh this should never be called</p></div>
    }
  }

  createTriggers = () =>{
    return(
      <div>
      {triggers.map((trigger) =>
        <div>
          <Collapsible trigger={trigger.title}>
            {this.createDropDown(trigger.title, trigger.type)}
          </Collapsible>
        </div>
      )}
      </div>
    );
  }

  render() {
    return(
      <div>
        {this.createTriggers()}
      </div>
    );
  }
}

