import React, { Component, createContext } from 'react';

const CC = createContext({
  loggein: false,
  value: ["태그"],
  name: 'user',
  image: 'https://music-auto-tag.s3.ap-northeast-2.amazonaws.com/user_images/userimage_sample.png',
  id: '',
  SetValue: () => { },
  SetName: () => { },
  SetImage: () => { },
  SetId: () => { },
  SetLoggein: () => {},
});

export const CoreContext = CC;

export const CoreConsumer = CC.Consumer;

export class CoreProvider extends Component {
  SetValue = (value) => {
    this.state.value = value;
  };

  SetName = (name) => {
    this.state.name = name;
  };

  SetImage = (image) => {
    this.state.image = image;
  };

  SetId = (id) => {
    this.state.id = id;
  };

  SetLoggein = (loggein) => {
    this.state.loggein = loggein;
  };

  state = {
    loggein: false,
    value: ["태그"],
    name: 'user',
    image: 'https://music-auto-tag.s3.ap-northeast-2.amazonaws.com/user_images/userimage_sample.png',
    id: '',
    SetValue: this.SetValue,
    SetName: this.SetName,
    SetImage: this.SetImage,
    SetId: this.SetId,
    SetLoggein: this.SetLoggein,
  };

  render() {
    return <CC.Provider loggein={this.loggein} id={this.id} image={this.image} name={this.name} value={this.state}>{this.props.children}</CC.Provider>;
  }
}