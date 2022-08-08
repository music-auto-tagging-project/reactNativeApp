import {
  StyleSheet,
  View,
  Text,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DraxProvider, DraxList, DraxViewDragStatus } from 'react-native-drax';

import * as React from 'react';
import { useState, useEffect, useRef, Component } from 'react';
import { TextInput, Image, ScrollView, TouchableOpacity, Modal } from 'react-native';
import { useCallback } from 'react';
import rStyles from '../styles/styles'
import axios from 'axios';
import { DraxView } from 'react-native-drax';
import YoutubePlayer from 'react-native-youtube-iframe';

const ReorderableList = () => {

  const [modalVisible, setModalVisible] = useState(false);
  const [playmodalVisible, setPlayModalVisible] = useState(false);
  const [mainTagModalVisible, setMainTagModalVisible] = useState(false);
  const [modifyTagVisible, setModifyTagVisible] = useState(false)
  const [recTag, setRecTag] = useState('');
  const [userTag1, setUserTag1] = useState(['사랑', '이별', '슬픔', '뭉게구름', '서정적'])
  const [userTag2, setUserTag2] = useState(['야속', '슬픔', '감동'])
  const [userName, setUserName] = useState('null')
  const [userId, setUserId] = useState('1')
  const [UserImage, setUserImage] = useState('null')
  const [rMusicList, setRMusicList] = useState(['null', 'null', 'null', 'null', 'null', 'null', 'null', 'null']);
  const [musicInfo, setMusicInfo] = useState('music info')
  const [musicId, setMusicId] = useState('1')
  const [any_text, setAny_Text] = useState('nan')
  const [any_text2, setAny_Text2] = useState(0)
  const [dragFlag, setDragFlag] = useState(true)

  const playlist = ['나만의 플레이리스트', '신나는 음악', '드라이브 할때 좋은 POP!', '추천 플레이리스트!']



  const array = [
    {
      id: 0,
      src: require(`../images/replay1.png`),
      title: '비도 오고 그래서'
    },
    {
      id: 1,
      src: require("../images/replay2.png"),
      title: "Can't Go"
    },
    {
      id: 2,
      src: require("../images/replay3.png"),
      title: '용천동굴'
    },
    {
      id: 3,
      src: require("../images/replay4.png"),
      title: '비구름'
    },
  ];

  const onClickSendTag = () => {
    axios
      .post("http://3.35.154.3:5000/user/tag", {
        "userId": userId,
        "tagList": userTag1
      })
  }
  const onClickMusic = () => {
    axios
      .get(`http://3.35.154.3:5000/music/stream/1`).
      then((response) => {
        setMusicInfo(response.data);
      })
    setPlayModalVisible(true)
    // setMusicId(music.musicId)
  }
  const onClickModifyTag = () => {
    setModifyTagVisible(true)
  }


  useEffect(() => {
    axios
      .get(`http://3.35.154.3:5000/main/${userId}`)
      .then((response) => {
        setUserTag1(response.data['tagList']);
        setUserName(response.data['userName']);
        setUserImage(response.data['userImage']);
        setRMusicList(response.data["recommendMusicList"]);
      });
  }, []
  )

  return (
    <>
      {/* 스트리밍 창 */}

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
      <Modal
        animationType="slide"
        transparent={true}
        visible={mainTagModalVisible}
        onRequestClose={() => {
          setMainTagModalVisible(!mainTagModalVisible);
        }}
      >
        <View style={[rStyles.centeredView, {}]}>
          <View style={{ flex: 1, height: 60, justifyContent: 'center' }}>
            <View style={{ paddingRight: 270, flexDirection: 'row' }}>
              <TouchableOpacity onPress={() => setMainTagModalVisible(!mainTagModalVisible)}>
                <View style={{}}><Image source={require('../images/magician.jpg')} style={rStyles.Logo} /></View>
              </TouchableOpacity>
              <View style={{ marginTop: 5 }}><Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold' }}>Music App</Text></View>
            </View>
          </View>
          <View style={{ flex: 11, alignItems: 'flex-start' }}>
            <View style={rStyles.MusicContainer}>
              <Text style={{ fontWeight: 'bold', marginBottom: 5, marginTop: 40, fontSize: 25 }}>Keyword - {recTag}</Text>

              {rMusicList.slice(0, 4).map((music: any) => (
                <View style={[rStyles.MusicBox, { flexDirection: 'row' }]} key={music.musicTitle}>
                  <TouchableOpacity onPress={onClickMusic}>
                    <Image source={{ uri: `data:image/jpeg;base64,${music.musicImage}` }} style={[rStyles.MusicStyle, { marginRight: 20 }]} />
                  </TouchableOpacity>
                  <View style={{ flex: 7 }}>
                    <Text style={{ fontSize: 16 }}>
                      {music.musicTitle}
                    </Text>
                    <Text style={{ fontSize: 16 }}>
                      {music.musicId}
                    </Text>
                  </View>
                  <View style={{ flex: 0.4 }}>
                    <Image source={require('../images/more.png')} style={{ opacity: 0.5, marginTop: 5, width: 15, height: 15 }} />
                  </View>
                </View>
              ))}
            </View>
          </View>
        </View>

      </Modal>
      <Modal
        animationType="slide"
        transparent={true}
        visible={mainTagModalVisible}
        onRequestClose={() => {
          setMainTagModalVisible(!mainTagModalVisible);
        }}
      >
        <View style={[rStyles.centeredView, {}]}>
          <View style={{ flex: 1, height: 60, justifyContent: 'center' }}>
            <View style={{ paddingRight: 270, flexDirection: 'row' }}>
              <TouchableOpacity onPress={() => setMainTagModalVisible(!mainTagModalVisible)}>
                <View style={{}}><Image source={require('../images/magician.jpg')} style={rStyles.Logo} /></View>
              </TouchableOpacity>
              <View style={{ marginTop: 5 }}><Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold' }}>Music App</Text></View>
            </View>
          </View>
          <View style={{ flex: 11, alignItems: 'flex-start' }}>
            <View style={rStyles.MusicContainer}>
              <Text style={{ fontWeight: 'bold', marginBottom: 5, marginTop: 40, fontSize: 25 }}>Keyword - {recTag}</Text>

              {rMusicList.slice(0, 4).map((music: any) => (
                <View style={[rStyles.MusicBox, { flexDirection: 'row' }]} key={music.musicTitle}>
                  <TouchableOpacity onPress={onClickMusic}>
                    <Image source={{ uri: `data:image/jpeg;base64,${music.musicImage}` }} style={[rStyles.MusicStyle, { marginRight: 20 }]} />
                  </TouchableOpacity>
                  <View style={{ flex: 7 }}>
                    <Text style={{ fontSize: 16 }}>
                      {music.musicTitle}
                    </Text>
                    <Text style={{ fontSize: 16 }}>
                      {music.musicId}
                    </Text>
                  </View>
                  <View style={{ flex: 0.4 }}>
                    <Image source={require('../images/more.png')} style={{ opacity: 0.5, marginTop: 5, width: 15, height: 15 }} />
                  </View>
                </View>
              ))}
            </View>
          </View>
        </View>

      </Modal>
      <ScrollView showsVerticalScrollIndicator={false} style={[rStyles.scrollView,, rStyles.back_black]} stickyHeaderIndices={[1]} persistentScrollbar={true}>
        <View style={{ height: 60, justifyContent: 'center' }}>
          <View style={{ flexDirection: 'row' }}>
            <View><Image source={require('../images/magician.jpg')} style={rStyles.Logo} /></View>
            <View style={{ flex: 5, marginTop: 5 }}><Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold' }}>Music App</Text></View>
            <TouchableOpacity onPress={() => setModalVisible(true)}>
              <View style={{ flex: 2 }}><Image source={{ uri: `data:image/jpeg;base64,${UserImage}` }} style={[rStyles.Logo, { marginRight: 20 }]} /></View>
            </TouchableOpacity>
          </View>
        </View>
        <ScrollView showsHorizontalScrollIndicator={false} horizontal={true} style={[{ flex: 1, marginLeft: 20, justifyContent: 'center', paddingVertical: 15, backgroundColor: 'rgb(220,220,220)' }, rStyles.back_black]}>
          <View style={{ flexDirection: 'row' }}>
            {userTag1.map((userTag1) => (
              <TouchableOpacity key={userTag1} onPress={() => {
                setMainTagModalVisible(!mainTagModalVisible)
                setRecTag(userTag1)
              }
              }>
                <View style={rStyles.container}>
                  <Text key={userTag1} style={{ fontSize: 17, color:"white" }}>
                    {userTag1}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>

        </ScrollView>
        <View style={{ flex: 7, alignItems: 'flex-start', justifyContent: 'center' }}>
          <View style={rStyles.MusicContainer}>
            <Text style={{ color: 'white', fontWeight: 'bold', marginBottom: 5, marginTop: 40, fontSize: 25 }}>Today's Music!</Text>
            <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={{ flexDirection: 'row' }}>
              {Array.from(Array(4).keys()).map((n, index) => (
                <View key={n}>
                  {
                    rMusicList.slice(n * 4, (n + 1) * 4).map((music: any) => (
                      <View style={[rStyles.MusicBox, { flexDirection: 'row' }]} key={music.musicTitle}>
                        <TouchableOpacity onPress={onClickMusic}>
                          <Image source={{ uri: `data:image/jpeg;base64,${music.musicImage}` }} style={[rStyles.MusicStyle, { marginRight: 20 }]} />
                        </TouchableOpacity>
                        <View style={{ flex: 7 }}>
                          <Text style={{ fontSize: 16 , color:'white'}}>
                            {music.musicTitle}
                          </Text>
                          <Text style={{ fontSize: 16, color:'white' }}>
                            {music.musicId}
                          </Text>
                        </View>
                        <View style={{ flex: 0.4 }}>
                          <Image source={require('../images/more.png')} style={{ opacity: 0.5, marginTop: 5, width: 15, height: 15 }} />
                        </View>
                      </View>
                    ))
                  }
                </View>
              ))
              }
            </ScrollView>
          </View>
        </View >
        <View style={{ marginTop: 20, justifyContent: 'center' }}>
          <TouchableOpacity>
            <Text style={{ color: 'white', marginLeft: 25, fontWeight: 'bold', fontSize: 25 }}>
              Music Replay
            </Text>
          </TouchableOpacity>
          <ScrollView showsHorizontalScrollIndicator={false} horizontal={true} style={{ paddingHorizontal: 25, paddingVertical: 15 }}>
            {Array.from(Array(4).keys()).map((n, index) => {
              return (
                <View key={n}>
                  <Image source={array[n].src} style={{ borderWidth: 0.2, borderColor: 'gray', borderRadius: 7, width: 100, height: 100, margin: 10 }} />
                  <Text>{array[n].title}</Text>
                </View>
              )
            })}
          </ScrollView>
        </View>
        <View style={{ marginTop: 20, justifyContent: 'center' }}>
          <Text style={{ marginLeft: 25, color: 'white', fontWeight: 'bold', fontSize: 25 }}>Music Mix</Text>
          <ScrollView showsHorizontalScrollIndicator={false} horizontal={true} style={{ paddingHorizontal: 25, paddingVertical: 15 }}>
            {[...Array(10)].map((n, index) => {
              return (
                <View key={n} style={{ borderWidth: 0.2, borderColor: 'gray', borderRadius: 7, width: 125, height: 125, backgroundColor: 'rgba(0.1, 0.1, 0.1, 0.2)', margin: 10 }}>
                </View>
              )
            })}
          </ScrollView>
        </View>
        <View style={{ marginTop: 20, justifyContent: 'center' }}>
          <Text style={{ marginLeft: 25, fontWeight: 'bold', fontSize: 25, color: 'white', }}>Music Rec Playlist</Text>
          <ScrollView showsHorizontalScrollIndicator={false} horizontal={true} style={{ paddingHorizontal: 25, paddingVertical: 15 }}>
            {[...Array(10)].map((n, index) => {
              return (
                <View key={n} style={{ borderWidth: 0.2, borderColor: 'gray', borderRadius: 7, width: 100, height: 100, backgroundColor: 'rgba(0.1, 0.1, 0.1, 0.2)', margin: 10 }}>
                </View>
              )
            })}
          </ScrollView>
        </View>
      </ScrollView >
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 16,
    fontStyle: 'italic',
  },
  alphaItem: {
    backgroundColor: '#aaaaff',
    borderRadius: 8,
    margin: 4,
    padding: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  alphaText: {
    fontSize: 28,
  },
  hover: {
    borderColor: 'blue',
    borderWidth: 2,
  },
});

export default ReorderableList;
