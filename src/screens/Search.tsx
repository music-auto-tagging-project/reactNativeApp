import React from 'react';
import { Modal, TextInput, Image, BackHandler, StyleSheet, Pressable, SafeAreaView, ScrollView, StatusBar, Text, TouchableHighlight, TouchableOpacity, View, PanResponder } from 'react-native';
import { useCallback, useState } from 'react';
import rStyles from '../styles/styles'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import axios from 'axios';
import YoutubePlayer from 'react-native-youtube-iframe';

const recent_search = ['멜로망스', '트와이스', '비도 오고 그래서']

function Search() {
  const color = 'black'
  const [textSearch, setTextSearch] = useState(1442)
  const [playmodalVisible, setPlayModalVisible] = useState(false);
  const [mainTagModalVisible, setMainTagModalVisible] = useState(false);
  const [musicInfo, setMusicInfo] = useState<any>(['null'])
  const userId = 3

  function onClickMusic(music_id: number) {
    axios
      .get(`http://ec2-3-35-154-3.ap-northeast-2.compute.amazonaws.com:8080/music/stream/${userId}/${music_id}`).
      then((response) => {
        setMusicInfo(response.data);
        console.log('abs')
      }).catch(error => {
        console.log(error.config)
      });
    setPlayModalVisible(true)
  }


  return (
    <>
      {/* 스트리밍 창 */}

      <Modal
        animationType="slide"
        transparent={false}
        visible={playmodalVisible}
        onRequestClose={() => {
          setPlayModalVisible(!playmodalVisible);
        }}
      >
        <View>
          <View style={{ paddingTop: 20 }}>
            <View style={{ paddingHorizontal: 30, alignItems: 'flex-start' }}>
              <Text style={{ fontSize: 25, color: 'black', marginTop: 8, fontWeight: 'bold' }} numberOfLines={1} ellipsizeMode="tail">{musicInfo.musicTitle}</Text>
              <Text style={{ fontSize: 18, color: 'black', marginTop: 8 }} numberOfLines={1} ellipsizeMode="tail">{musicInfo.artist}</Text>
            </View>
            <View>
              <View style={{ marginTop: 35 }}>
                <YoutubePlayer
                  width={435}
                  height={260}
                  play={true}
                  videoId={musicInfo.youtubeId}
                />
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'flex-end', paddingRight: 30 }}>
                {musicInfo.tagList && musicInfo.tagList.map((tag: any, index: any) => (
                  <View key={index}>
                    <Text style={{ color: 'black', fontSize: 18, margin: 5 }}>#{tag}</Text>
                  </View>
                ))}
              </View>
            </View>
            <View style={{ justifyContent: 'center', alignItems: 'center', width: '100%', height: 4, marginVertical: 15 }}>
              <View style={{ backgroundColor: 'gray', width: '85%', height: 3 }}></View>
            </View>
            <View>
              <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                {musicInfo.musicLyric && musicInfo.musicLyric.split('\n').slice(0, 7).map((lyric: any, index) => (
                  <View key={index}>
                    <Text style={{ fontSize: 18, color: 'gray', marginTop: 10 }}>{lyric}</Text>
                  </View>
                ))}
              </View>
            </View>
            <View>

            </View>
          </View>
        </View>
      </Modal>

      {/* Search page */}

      <View style={{ backgroundColor: 'white', height: '100%' }}>
        <ScrollView showsVerticalScrollIndicator={false} style={rStyles.scrollView} persistentScrollbar={true}>
          <View style={{ flexDirection: 'row', paddingLeft: 30, paddingTop: 40 }}>
            <View style={{ width: 320, height: 25 }}>
              <Text style={{ fontSize: 25, fontWeight: 'bold' }}>검색</Text>
            </View>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', height: 50, marginTop: 20, flex: 1 }}>
            <TextInput onChangeText={(nm) => { setTextSearch(nm) }} placeholder='음악 또는 아티스트 검색' placeholderTextColor='gray' style={{ flex: 1, backgroundColor: '#ECECEC', height: 45, width: '85%', marginHorizontal: 12, color: 'black', fontSize: 17, paddingHorizontal: 15, paddingVertical: 0, borderRadius: 15 }} />
            <TouchableOpacity onPress={() => onClickMusic(textSearch)}><Icon name="printer-search" color='black' size={20} style={{ marginRight: 15 }} /></TouchableOpacity>
          </View>
          <View style={{ marginTop: 15 }}>
            <View>
              {recent_search.map((log) => (
                <View key={log} style={[{ flexDirection: 'row', marginVertical: 5, marginLeft: 40, alignItems: 'center' }]}>
                  <Text style={{ fontSize: 20, width: '75%', color: 'black' }}>
                    {log}
                  </Text>
                  <Text>- - - -    </Text>
                  <Icon name="close" color={'#FF6666'} size={15} style={{ marginRight: 15 }} />
                </View>
              ))}
            </View>
          </View>
        </ScrollView>
      </View>
    </>
  );
}

export default Search;
