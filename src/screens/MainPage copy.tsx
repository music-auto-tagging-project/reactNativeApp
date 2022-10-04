import {
  StyleSheet,
  View,
  Text,
  ImageBackground,
  Alert,
} from 'react-native';

import * as React from 'react';
import { useState, useEffect, useRef, Component, useContext } from 'react';
import { Dimensions, RefreshControl, TextInput, Image, ScrollView, TouchableOpacity, Modal, Button } from 'react-native';
import rStyles from '../styles/styles'
import axios from 'axios';
import YoutubePlayer from 'react-native-youtube-iframe';
import StreamingPage from '../modal/StreamingPage';
import Sample_Replay from '../etc/sample_playlist.json'
import { color } from 'react-native-reanimated';
import { CoreContext, CoreConsumer } from '../context/CoreManagement';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';



const ReorderableList = (props) => {

  const wait = (timeout) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
  }
  const [refreshing, setRefreshing] = React.useState(false);
  const onRefresh = React.useCallback(() => {
    axios
      .get(`http://ec2-3-35-154-3.ap-northeast-2.compute.amazonaws.com:8080/main/${userId}`)
      .then((response) => {
        SetbackValue(response.data['tagList']);
        setUserName(response.data['userName']);
        setUserImage(response.data['userImage']);
        setRMusicList(response.data["recommendMusicList"]);
        setPMusicList(response.data["playedMusicList"]);
      }).catch(error => {
        console.log(error.config)
      })
    setRefreshing(true);
    wait(300).then(() => setRefreshing(false));
  }, []);

  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;
  const [playmodalVisible, setPlayModalVisible] = useState(false);
  const [mainTagModalVisible, setMainTagModalVisible] = useState(false);
  const [recTag, setRecTag] = useState('');
  const [UserTag2, setUserTag2] = useState(['null'])
  const [userName, setUserName] = useState('User Name')
  const [userId, setUserId] = useState('3')
  const [UserImage, setUserImage] = useState('null')
  const [rMusicList, setRMusicList] = useState(['null']);
  const [pMusicList, setPMusicList] = useState(['null']);
  const [musicInfo, setMusicInfo] = useState<any>(['null'])

  const { route } = props;
  const { params } = route;
  const result = useContext(CoreContext);
  const [backValue, SetbackValue] = useState(result.value);
  const navigation = useNavigation();
  const [main, setMain] = useState(true)
  const colorList = ['#F1BFBF', '#F1D4BF', '#F1E6BF', '#CCF1BF', '#BFF1DF', '#BFD0F1', '#D6A7D7', '#F1BFBF', '#F1D4BF', '#F1E6BF', '#CCF1BF', '#BFF1DF', '#BFD0F1', '#D6A7D7', '#F1BFBF', '#F1D4BF', '#F1E6BF', '#CCF1BF', '#BFF1DF', '#BFD0F1', '#D6A7D7', '#F1BFBF', '#F1D4BF', '#F1E6BF', '#CCF1BF', '#BFF1DF', '#BFD0F1', '#D6A7D7', '#F1BFBF', '#F1D4BF', '#F1E6BF', '#CCF1BF', '#BFF1DF', '#BFD0F1', '#D6A7D7', '#F1BFBF', '#F1D4BF', '#F1E6BF', '#CCF1BF', '#BFF1DF', '#BFD0F1', '#D6A7D7', '#F1BFBF', '#F1D4BF', '#F1E6BF', '#CCF1BF', '#BFF1DF', '#BFD0F1', '#D6A7D7']

  // 음악 선택 시 
  function onClickMusic(music_id: number) {
    axios
      .get(`http://ec2-3-35-154-3.ap-northeast-2.compute.amazonaws.com:8080/music/stream/${userId}/${music_id}`).
      then((response) => {
        setMusicInfo(response.data);
        console.log('abs')
      }).catch(error => {
        console.log(error.config)
        console.log('abbs')
      });
    setPlayModalVisible(true)
  }

  useEffect(() => {

    axios
      .get(`http://ec2-3-35-154-3.ap-northeast-2.compute.amazonaws.com:8080/main/${userId}`)
      .then((response) => {
        SetbackValue(response.data['tagList']);
        setUserName(response.data['userName']);
        setUserImage(response.data['userImage']);
        setRMusicList(response.data["recommendMusicList"]);
        setPMusicList(response.data["playedMusicList"]);
      }).catch(error => {
        console.log(error.config)
      })

  }, []
  )



  useEffect(() => {

    const focus = props.navigation.addListener('focus', async () => {
      SetbackValue(result.value);
    });
    return focus;
  }, [props, props.navigation]
  )

  return (
    <CoreConsumer>
      {({ value, SetValue }) => (
        <View>
          {/* 스트리밍 창 */}

          <Modal
            animationType="slide"
            transparent={true}
            visible={playmodalVisible}
            onRequestClose={() => {
              setPlayModalVisible(!playmodalVisible);
            }}
          >
            <View style={[rStyles.centeredView, { backgroundColor: 'black' }]}>
              <View style={{ flex: 1 }}>
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', marginTop: 40 }}>
                  {musicInfo.musicTitle && ((musicInfo.musicTitle.length > 24) ? (
                    <Text style={{ fontSize: 25, color: 'white' }}>{musicInfo.musicTitle.slice(0, 22) + '...'}</Text>
                  ) : <Text style={{ fontSize: 25, color: 'white' }}>{musicInfo.musicTitle}</Text>)}
                  <Text style={{ fontSize: 20, color: 'gray', marginTop: 8 }}>{musicInfo.artist}</Text>
                </View>
                <View style={{ flexDirection: 'row', marginTop: 20, alignItems: 'center', justifyContent: 'center' }}>
                  {musicInfo.tagList && musicInfo.tagList.map((tag: any, index: any) => (
                    <View key={index}>
                      <Text style={{ color: 'gray', fontSize: 17, marginHorizontal: 5 }}>#{tag}</Text>
                    </View>
                  ))}
                </View>
                <View style={{ flex: 7 }}>
                  <View style={{ flexDirection: 'row', marginBottom: 30 }}>
                  </View>
                  <View style={{ marginTop: 35 }}>
                    <YoutubePlayer
                      width={435}
                      height={300}
                      play={true}
                      videoId={musicInfo.youtubeId}
                    />
                  </View>

                </View>
                <View style={{ flex: 1, flexDirection: 'row', paddingHorizontal: 20, alignItems: 'center' }}>
                  <Icon name="cards-heart" color={'white'} size={30} />
                  <Text style={{ fontSize: 18, color: 'white' }}>  10,816</Text>
                </View>
                <View style={{ flex: 7 }}>
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

          {/* 태그 기반 추천 음악 Page */}

          <Modal
            animationType="slide"
            transparent={true}
            visible={mainTagModalVisible}
            onRequestClose={() => {
              setMainTagModalVisible(!mainTagModalVisible);
            }}
          >
            <View style={[rStyles.centeredView, { backgroundColor: 'black' }]}>
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
                  <Text style={{ fontWeight: 'bold', marginBottom: 40, marginTop: 40, fontSize: 25, color: 'white' }}>{recTag} - 연관 추천 음악!</Text>

                  {rMusicList.slice(0, 8).map((music: any, index) => (
                    <View style={[rStyles.MusicBox, { flexDirection: 'row' }]} key={index}>
                      <TouchableOpacity>
                        <Image source={{ uri: `data:image/jpeg;base64,${music.musicImage}` }} style={[rStyles.MusicStyle, { marginRight: 20 }]} />
                      </TouchableOpacity>
                      <View style={{ flex: 7 }}>
                        <Text style={{ fontSize: 17, color: 'white' }}>
                          {music.musicTitle}
                        </Text>
                        <Text style={{ fontSize: 17, color: 'gray' }}>
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
          {/* 메인 페이지 */}
          <ScrollView showsVerticalScrollIndicator={false} style={rStyles.scrollView} persistentScrollbar={true}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
              />
            }>
            {SetValue(backValue)}
            <View style={{ flexDirection: 'row', paddingLeft: 30, paddingTop: 40 }}>
              <View style={{ justifyContent: 'center', width: 320, height: 80 }}>
                <Text style={{ fontSize: 25, fontWeight: 'bold' }}>{userName}님</Text>
                <ScrollView showsHorizontalScrollIndicator={false} horizontal={true} style={{ backgroundColor: 'white', flex: 1, width: 250, height: 30 }}>
                  <View style={{ flexDirection: 'row' }}>
                    {backValue && backValue.map((tag, index) => (
                      <TouchableOpacity key={index} onPress={() => {
                        setMainTagModalVisible(!mainTagModalVisible)
                        setRecTag(tag)
                      }
                      }>
                        <View style={{ marginRight: 10 }}>
                          <Text style={{ fontSize: 17, color: "black" }}>
                            #{tag}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    ))}
                  </View>
                </ScrollView>
              </View>
              <TouchableOpacity>
                <View style={{ flexDirection: 'row' }}>
                  <ImageBackground source={{ uri: `https://music-auto-tag.s3.ap-northeast-2.amazonaws.com/user_images/userimage_sample.png` }}
                    style={{ width: 60, height: 60, marginRight: 20 }} borderRadius={10} imageStyle={{ opacity: 1 }}>
                    <Image source={{ uri: `https://music-auto-tag.s3.ap-northeast-2.amazonaws.com/user_images/userimage_sample.png` }}
                      style={{ width: 60, height: 60 }} borderRadius={12} />
                  </ImageBackground>
                </View>
              </TouchableOpacity>
            </View>
            <View style={{ flex: 3, alignItems: 'flex-start', justifyContent: 'center' }}>
              <View style={rStyles.MusicContainer}>
                <Text style={{ color: 'black', fontWeight: 'bold', marginBottom: 40, fontSize: 20 }}>오늘의 노래</Text>
                <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={{ flexDirection: 'row' }}>
                  {Array.from(Array(rMusicList.length).keys()).map((n, index) => (
                    <View key={index}>
                      {
                        rMusicList.slice(n * 1, (n + 1) * 1).map((music: any, index) => (

                          <View style={[rStyles.MusicBox, { backgroundColor: colorList[n], borderRadius: 12 }]} key={index}>
                            <TouchableOpacity onPress={() => onClickMusic(music.musicId)} style={{ flex: 20, borderRadius: 12, alignItems:'center',justifyContent:'center' }}>
                              <View>
                                <ImageBackground source={{ uri: `https://music-auto-tag.s3.ap-northeast-2.amazonaws.com/music_images/music_default.png` }}
                                  style={{ width: 174, height: 174, marginRight: 0 }} borderRadius={12} imageStyle={{ opacity: 0.2 }}>
                                  <Image source={{ uri: `https://music-auto-tag.s3.ap-northeast-2.amazonaws.com/music_images/music_id_${music.musicId}.jpg` }}
                                    style={{width: 174, height: 174, borderColor: 'white', borderWidth: 3, borderRadius: 12 }} />
                                </ImageBackground>
                                <View style={{ marginTop: 7, flexDirection: 'row' }}>
                                  <View style={{ flex: 1 }}>
                                    <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#454545' }} numberOfLines={1} ellipsizeMode="tail">
                                      {music.musicTitle}
                                    </Text>
                                    <Text style={{ fontSize: 14, color: '#454545' }} numberOfLines={1} ellipsizeMode="tail">
                                      {music.musicArtist}
                                    </Text>
                                  </View>
                                  <View><Icon name="play" color='#626262' size={40} /></View>
                                </View>
                              </View>
                            </TouchableOpacity>
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
                <Text style={{ color: 'black', marginLeft: 25, fontWeight: 'bold', fontSize: 20 }}>
                  다시 듣기
                </Text>
              </TouchableOpacity>
              <ScrollView style={{ paddingHorizontal: 25, paddingVertical: 15 }}>
                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                  {Array.from(Array(pMusicList.length).keys()).map((n, index) => {
                    return (
                      <TouchableOpacity key={index} style={{ width: '95%', height: 80, padding: 4, margin: 5, backgroundColor: colorList[n], alignItems: 'center', flexDirection: 'row', borderRadius: 15 }} onPress={() => onClickMusic(pMusicList[n].musicId)}>
                        <ImageBackground source={{ uri: `https://music-auto-tag.s3.ap-northeast-2.amazonaws.com/music_images/music_default.png` }}
                          style={{ height: '100%', aspectRatio: 1, marginRight: 5 }} borderRadius={12} imageStyle={{ opacity: 0.5 }}>
                          <Image source={{ uri: `https://music-auto-tag.s3.ap-northeast-2.amazonaws.com/music_images/music_id_${pMusicList[n].musicId}.jpg` }}
                            style={{ width: '100%', height: '100%', borderColor: 'white', borderWidth: 3, borderRadius: 12 }} />
                        </ImageBackground>
                        <View style={{ flex: 5 }}>
                          <Text style={{ color: '#454545', marginLeft: 10, fontSize: 17, fontWeight: 'bold' }} numberOfLines={1} ellipsizeMode="tail">{pMusicList[n].musicTitle}</Text>
                          <Text style={{ color: '#454545', marginLeft: 10, marginTop: 2, fontSize: 15 }} numberOfLines={1} ellipsizeMode="tail">{pMusicList[n].musicArtist}</Text>
                        </View>
                        <View style={{ marginRight: 5, flex: 1, marginLeft: 5 }}><Icon name="play" color='#626262' size={40} /></View>
                      </TouchableOpacity>
                    )
                  })}
                </View>
              </ScrollView>
            </View>


          </ScrollView >
        </View >
      )}
    </CoreConsumer >
  );
};

export default ReorderableList;
