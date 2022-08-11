import React, {Component, createContext, useState} from 'react';
import axios from 'axios';



const CC = createContext({
  value: ["태그"],
  tag: '',
  SetValue: () => {},
});

export const CoreContext = CC;

export const CoreConsumer = CC.Consumer;

export class CoreProvider extends Component {
  SetValue = (value) => {
    this.state.value = value;
  };

  state = {
    value: ["태그"],
    tag: '>>>>>>>>>>>>>>>>>>>>>>>>>>>>',
    SetValue: this.SetValue
  };

  render() {
    return <CC.Provider value={this.state}>{this.props.children}</CC.Provider>;
  }
}