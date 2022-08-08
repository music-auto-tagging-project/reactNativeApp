import {
    StyleSheet,
    View,
    Text,
  } from 'react-native';
  
  import * as React from 'react';
  import { useState, useEffect, useRef, Component } from 'react';
  import { TextInput, Image, ScrollView, TouchableOpacity, Modal } from 'react-native';
  import rStyles from '../styles/styles'
  import axios from 'axios';
  import YoutubePlayer from 'react-native-youtube-iframe';
​
const StreamingPage = () => {
  return (
    <Modal
        animationType="slide"
        transparent={true}
        visible={playmodalVisible}
        onRequestClose={() => {
          setPlayModalVisible(!playmodalVisible);
        }}
      >
        <View style={rStyles.centeredView}>
          <View style={{ flex: 1 }}>
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ fontSize: 20, color: 'rgba(0.1, 0.1, 0.1, 0.5)', marginTop: 20 }}>{musicInfo.musicTitle}</Text>
              <Text style={{ fontSize: 20, color: 'rgba(0.1, 0.1, 0.1, 0.5)', marginTop: 20 }}>{musicInfo.artist}</Text>
            </View>
            <View style={{ flex: 7, alignItems: 'center', justifyContent: 'center' }}>
              <View style={{ flexDirection: 'row', marginBottom: 30 }}>
                <View style={{ flex: 1 }}></View>
                <Text style={{ borderBottomColor: 'rgba(0.1,0.1,0.1,0.25)', borderBottomWidth: 1, flex: 15 }}></Text>
                <View style={{ flex: 1 }}></View>
              </View>
              <View style={{ marginTop: 100 }}>
                <YoutubePlayer
                  width={400}
                  height={300}
                  play={true}
                  videoId={musicInfo.youtubeId}
                />
              </View>

            </View>
            <View style={{ flex: 5 }}>
              <View style={{ flexDirection: 'row' }}>
                <View style={{ flex: 1 }}></View>
                <Text style={{ borderBottomColor: 'rgba(0.1,0.1,0.1,0.25)', borderBottomWidth: 1, flex: 15 }}></Text>
                <View style={{ flex: 1 }}></View>
              </View>
              <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ fontSize: 18, color: 'rgba(0.1, 0.1, 0.1, 0.5)', marginTop: 17 }}>{musicInfo.musicLyric}</Text>
              </View>
            </View>
          </View>
        </View>

      </Modal>
  );
};
​
export default StreamingPage;
