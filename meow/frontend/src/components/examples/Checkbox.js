import React from "react";
import Checkbox from "rc-checkbox";

const checkbox_choices = [{tag: 'ready to post', title: 'status'}, {tag: 'draft', title: 'status'},
                        {tag:'sent', title: 'status'}, {tag: 'sports', title: 'section'},
                        {tag: 'politics', title: 'section'}, {tag: 'weather', title: 'section'},
                        {tag: 'food', title: 'section'}];

function onChange(e) {
  console.log('Checkbox checked:', (e.target.checked));
}

export default class Checkers extends React.Component{
  constructor(props){
    super(props)
    this.state = {
        disabled: false,
    };
    this.handleToggle = this.handleToggle.bind(this);
  }

  handleToggle () {
    this.setState((state) => ({
      disabled: !state.disabled,
    }));
  }

  createCheckBoxes = (title) =>{
    return(
      checkbox_choices.map((checkbox_choice)=>{
        if(checkbox_choice.title == title){
          return(
            <div>
              <p>
                <label>
                  {checkbox_choice.tag}
                  <Checkbox
                    onChange={onChange}
                    disabled={this.state.disabled}
                  />
                </label>
              </p>
            </div>
          )
        }
      })
    )
  }

  render(){
    return (
      <div>
        {this.createCheckBoxes(this.props.title)}
      </div>
    );
  }

};


