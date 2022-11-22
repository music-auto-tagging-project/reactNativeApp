import {
  StyleSheet,
  View,
  Text,
  ImageBackground,
  Alert,
} from 'react-native';

import * as React from 'react';
import { useState, useEffect, useRef, Component, useContext } from 'react';
import { Dimensions, RefreshControl, TextInput, Image, ScrollView, TouchableOpacity, Modal, Button, Pressable } from 'react-native';
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
      .get(`http://ec2-3-35-154-3.ap-northeast-2.compute.amazonaws.com:8080/main/${result.id}`)
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
  const [rMusicList, setRMusicList] = useState([]);
  const [pMusicList, setPMusicList] = useState([]);
  const [musicInfo, setMusicInfo] = useState<any>(['null'])
  const [checkList, setCheckList] = useState([])
  const [checkTrue, setCheckTrue] = useState([false, false, false, false, false, false, false, false, false])
  const [selectNumber, setSelectNumber] = useState(0)
  const [selectTrue, setSelectTrue] = useState(false)
  const [allMusicInfo, setAllMusicInfo] = useState([])
  const [clickedSong, setClickedSong] = useState(new Set())

  const { route } = props;
  const { params } = route;
  const result = useContext(CoreContext);
  const [backValue, SetbackValue] = useState(result.value);
  const navigation = useNavigation();
  const [main, setMain] = useState(true)
  const colorList = ['#F1BFBF', '#F1D4BF', '#F1E6BF', '#CCF1BF', '#BFF1DF', '#BFD0F1', '#CFBFF1']

  // 음악 선택 시 
  function onClickMusic(music_id: number) {
    axios
      .get(`http://ec2-3-35-154-3.ap-northeast-2.compute.amazonaws.com:8080/music/stream/${result.id}/${music_id}`).
      then((response) => {
        setMusicInfo(response.data);
      }).catch(error => {
        console.log(error.config)
      });
    setPlayModalVisible(true)
  }

  function checkBox(num) {
    if (num in checkList) {
      let checkCopy = checkTrue
      checkCopy[num] = !checkCopy[num]
      setCheckTrue(checkCopy)

      let listCopy = checkList.filter(x => x != num)
      setCheckList(listCopy)
    } else if (!(num in checkList)) {
      let checkCopy = checkTrue
      checkCopy[num] = !checkCopy[num]
      setCheckTrue(checkCopy)

      let listCopy = [...checkList, num]
      setCheckList(listCopy)
    }
    setSelectNumber(checkTrue.filter(x => x != false).length)
  }

  const selectComplete = async () => {

    const resArray = [];
    for await (const music_id of clickedSong) {
      const res = await axios
        .get(`http://ec2-3-35-154-3.ap-northeast-2.compute.amazonaws.com:8080/music/stream/${result.id}/${music_id}`)
      resArray.push(res.data);
    }
    setSelectTrue(!selectTrue)
  }

  const clickFavorMusic = (id: string) => {
    let copy = new Set([...clickedSong])
    if (clickedSong.has(id)) {
      copy.delete(id)
    } else if (!clickedSong.has(id)) {
      copy.add(id)
    }
    setClickedSong(copy)
    console.log(copy)
  }

  useEffect(() => {
    setTimeout(() => {
      axios
        .get(`http://ec2-3-35-154-3.ap-northeast-2.compute.amazonaws.com:8080/main/${result.id}`)
        .then((response) => {
          SetbackValue(response.data['tagList']);
          setUserName(response.data['userName']);
          setUserImage(response.data['userImage']);
          setRMusicList(response.data["recommendMusicList"]);
          setPMusicList(response.data["playedMusicList"]);
        }).catch(error => {
          console.log(error.config)
        })
    }, 300)
  }, [selectTrue, result])

  useEffect(() => {

    axios
      .get(`http://ec2-3-35-154-3.ap-northeast-2.compute.amazonaws.com:8080/main/${result.id}`)
      .then((response) => {
        SetbackValue(response.data['tagList']);
        setUserName(response.data['userName']);
        setUserImage(response.data['userImage']);
        setRMusicList(response.data["recommendMusicList"]);
        setPMusicList(response.data["playedMusicList"]);
      }).catch(error => {
        console.log(error.config)
      })
  }, [])

  useEffect(() => {
    axios
      .get(`http://ec2-3-35-154-3.ap-northeast-2.compute.amazonaws.com:8080/search`)
      .then((response) => {
        let allMusicList = response.data['musicNameList']
        allMusicList.sort(() => Math.random() - 0.5)
        setAllMusicInfo(allMusicList);
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
      {({ value, name, image, id, loggein, SetValue }) => (
        <View>
          <></>
          {/* 선호 음악 선택 */}
          <Modal
            animationType="none"
            transparent={false}
            visible={!selectTrue && !result.loggein}
          >
            <View style={{ flex: 11 }}>
              <ScrollView>
                <View style={{ marginLeft: 20, marginTop: 30 }}>
                  <Text style={{ fontWeight: 'bold', fontSize: 25 }}>선호 음악 선택</Text>
                </View>
                <View style={{ paddingRight: 7 }}>
                  {Array.from({ length: 14 }, (_, index) => index + 1).map((n, index) => (
                    <View key={n} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', margin: 2 }}>
                      {allMusicInfo.slice(n * 2, (n + 1) * 2).map((music, index2) => (
                        <View key={index2} >
                          <TouchableOpacity onPress={() => { clickFavorMusic(music.musicId) }} style={{
                            backgroundColor: colorList[(n + 1) % 7], width: '92%',
                            height: 250, borderRadius: 15, margin: 12, justifyContent: 'center', alignItems: 'center'
                          }}>
                            <View>
                              <Image source={{ uri: `https://music-auto-tag.s3.ap-northeast-2.amazonaws.com/music_images/music_default.png` }}
                                style={{ width: 165, height: 165, marginRight: 0, opacity: 0.2 }} borderRadius={12} />
                              <Image source={{ uri: `https://music-auto-tag.s3.ap-northeast-2.amazonaws.com/music_images/music_id_${music.musicId}.jpg` }}
                                style={{ width: 165, height: 165, borderColor: 'white', borderWidth: 3, borderRadius: 12, position: 'absolute' }} />
                            </View>
                            <View style={{ marginTop: 7, flexDirection: 'row', marginLeft: 10 }}>
                              <View style={{ flex: 1 }}>
                                <Text style={{ fontSize: 17, color: 'black' }} numberOfLines={1} ellipsizeMode="tail">
                                  {music.musicTitle}
                                </Text>
                                <Text style={{ fontSize: 15, color: '#454545' }} numberOfLines={1} ellipsizeMode="tail">
                                  {'아티스트'}
                                </Text>
                              </View>
                            </View>
                            <Image style={[{ width: '100%', height: '100%', position: 'absolute' }, { opacity: clickedSong.has(music.musicId) ? 0.25 : 0 }]} source={{ uri: `https://music-auto-tag.s3.ap-northeast-2.amazonaws.com/music_images/checkbox.jpg` }} />
                          </TouchableOpacity>
                        </View>
                      ))}
                    </View>))}
                </View>
              </ScrollView>
            </View>
            <View style={{
              flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center',
              paddingHorizontal: 20, flex: 1, borderBottomColor: 'rgba(200,200,200,0.4)',
              borderTopColor: 'rgba(200,200,200,0.8)', borderWidth: 1,
            }}>
              <View style={{ position: 'absolute', width: '100%' }}>
                <Text style={{ fontSize: 17 }}>{clickedSong.size}개 선택</Text>
              </View>
              <TouchableOpacity onPress={() => selectComplete()} style={{ backgroundColor: colorList[0], borderRadius: 10, paddingVertical: 5, paddingHorizontal: 20 }}><Text style={{ fontSize: 17, fontWeight: 'bold' }}>완료</Text></TouchableOpacity>
            </View>
          </Modal>
          {/* 스트리밍 창 */}
          <Modal
            animationType="slide"
            transparent={false}
            visible={playmodalVisible}
            onRequestClose={() => {
              setPlayModalVisible(!playmodalVisible);
            }}
          >
            <ScrollView>
              <View style={{ paddingTop: 20 }}>
                <View style={{ paddingHorizontal: 30, alignItems: 'flex-start' }}>
                  <Text style={{ fontSize: 27, color: 'black', marginTop: 8, fontWeight: 'bold' }} numberOfLines={1} ellipsizeMode="tail">{musicInfo.musicTitle}</Text>
                  <Text style={{ fontSize: 18, color: 'black', marginTop: 8 }} numberOfLines={1} ellipsizeMode="tail">{musicInfo.artist}</Text>
                </View>
                <View>
                  <View style={{ marginTop: 35 }}>
                    <YoutubePlayer
                      width={435}
                      height={260}
                      play={false}
                      videoId={musicInfo.youtubeId}
                    />
                  </View>
                  <View style={{ width: '100%', justifyContent: 'center', alignItems: 'center' }}>
                    <ScrollView showsHorizontalScrollIndicator={false} horizontal={true} style={{ flexDirection: 'row', width: '85%' }}>
                      {musicInfo.tagList && musicInfo.tagList.map((tag: any, index: any) => (
                        <View key={index}>
                          <Text style={{ color: 'black', fontSize: 18, margin: 5 }}>#{tag}</Text>
                        </View>
                      ))}
                    </ScrollView>
                  </View>
                </View>
                <View style={{ justifyContent: 'center', alignItems: 'center', width: '100%', height: 4, marginVertical: 15 }}>
                  <View style={{ backgroundColor: 'gray', width: '88%', height: 3 }}></View>
                </View>
                <View style={{ paddingHorizontal: 20, alignItems: 'flex-start' }}>
                  <Text style={{ fontSize: 27, color: 'black', marginTop: 5, fontWeight: 'bold' }}>다음 곡</Text>
                  <ScrollView style={{ paddingHorizontal: 0, paddingVertical: 15 }} horizontal={true} showsHorizontalScrollIndicator={false}>
                    {Array.from(Array(Math.ceil(rMusicList.length / 5)).keys()).map((n, index) => (
                      <View key={index} style={{ alignItems: 'center', width: windowWidth * 0.9 }}>
                        {rMusicList.slice(n * 5, (n + 1) * 5).map((music, index) => {
                          return (
                            <TouchableOpacity key={index} style={{ height: 75, padding: 4, marginVertical: 5, marginRight: 15, backgroundColor: colorList[index], alignItems: 'center', flexDirection: 'row', borderRadius: 15 }} onPress={() => onClickMusic(music.musicId)}>
                              <ImageBackground source={{ uri: `https://music-auto-tag.s3.ap-northeast-2.amazonaws.com/music_images/music_default.png` }}
                                style={{ height: '100%', aspectRatio: 1, marginRight: 5 }} borderRadius={12} imageStyle={{ opacity: 0.25 }}>
                                <Image source={{ uri: `https://music-auto-tag.s3.ap-northeast-2.amazonaws.com/music_images/music_id_${music.musicId}.jpg` }}
                                  style={{ width: '100%', height: '100%', borderColor: 'white', borderWidth: 3, borderRadius: 12 }} />
                              </ImageBackground>
                              <View style={{ width: '60%' }}>
                                <Text style={{ color: 'black', marginLeft: 10, fontSize: 17, fontWeight: '500' }} numberOfLines={1} ellipsizeMode="tail">{music.musicTitle}</Text>
                                <Text style={{ color: '#454545', marginLeft: 10, marginTop: 2, fontSize: 14 }} numberOfLines={1} ellipsizeMode="tail">{music.musicArtist}</Text>
                              </View>
                              <View style={{ marginRight: 5, flex: 1, marginLeft: 5 }}><Icon name="play" color='#626262' size={40} /></View>
                            </TouchableOpacity>
                          )
                        })}
                      </View>))}
                  </ScrollView>
                </View>
                <View>

                </View>
              </View>
            </ScrollView>
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
            <View style={{ flexDirection: 'row', paddingLeft: 25, paddingTop: 40 }}>
              <View style={{ justifyContent: 'center', width: '78%', height: 80 }}>
                <Text style={{ fontSize: 25, fontWeight: 'bold' }}>{name}님</Text>
                <ScrollView showsHorizontalScrollIndicator={false} horizontal={true} style={{ backgroundColor: 'white', flex: 1, width: '85%', height: 30 }}>
                  <View style={{ flexDirection: 'row' }}>
                    {backValue && backValue.map((tag, index) => (
                      <TouchableOpacity key={index}>
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
                    <Image source={{ uri: image }}
                      style={{ width: 60, height: 60 }} borderRadius={12} />
                  </ImageBackground>
                </View>
              </TouchableOpacity>
            </View>
            <View style={{ flex: 3, alignItems: 'flex-start', justifyContent: 'center' }}>
              <View style={{ paddingLeft: 20 }}>
                <Text style={{ color: 'black', fontWeight: 'bold', marginBottom: 25, fontSize: 20 }}>오늘의 노래</Text>
                <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={{ flexDirection: 'row' }}>
                  {Array.from(Array(rMusicList.length).keys()).map((n, index) => (
                    <View key={index}>
                      {
                        rMusicList.slice(n * 1, (n + 1) * 1).map((music: any, index) => (

                          <View style={[rStyles.MusicBox, { backgroundColor: colorList[n % 7], borderRadius: 12 }]} key={index}>
                            <TouchableOpacity onPress={() => onClickMusic(music.musicId)} style={{ flex: 20, borderRadius: 12, alignItems: 'center', justifyContent: 'center' }}>
                              <View>
                                <ImageBackground source={{ uri: `https://music-auto-tag.s3.ap-northeast-2.amazonaws.com/music_images/music_default.png` }}
                                  style={{ width: 174, height: 174, marginRight: 0 }} borderRadius={12} imageStyle={{ opacity: 0.2 }}>
                                  <Image source={{ uri: `https://music-auto-tag.s3.ap-northeast-2.amazonaws.com/music_images/music_id_${music.musicId}.jpg` }}
                                    style={{ width: 174, height: 174, borderColor: 'white', borderWidth: 3, borderRadius: 12 }} />
                                </ImageBackground>
                                <View style={{ marginTop: 7, flexDirection: 'row' }}>
                                  <View style={{ flex: 1 }}>
                                    <Text style={{ fontSize: 16, color: 'black' }} numberOfLines={1} ellipsizeMode="tail">
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
                <Text style={{ color: 'black', marginLeft: 20, fontWeight: 'bold', fontSize: 20 }}>
                  다시 듣기
                </Text>
              </TouchableOpacity>
              <ScrollView style={{ marginLeft: 25, paddingVertical: 15, flexDirection: 'row', height: 500 }} horizontal={true} showsHorizontalScrollIndicator={false}>
                {Array.from(Array(Math.ceil(20)).keys()).map((n, index) => (
                  <View key={index} style={{ alignItems: 'center', width: windowWidth * 0.9 }}>
                    {pMusicList.slice(n * 5, (n + 1) * 5).map((music, index) => {
                      return (
                        <TouchableOpacity key={index} style={{ height: 75, padding: 4, marginVertical: 5, marginRight: 15, backgroundColor: colorList[index], alignItems: 'center', flexDirection: 'row', borderRadius: 15 }} onPress={() => onClickMusic(music.musicId)}>
                          <ImageBackground source={{ uri: `https://music-auto-tag.s3.ap-northeast-2.amazonaws.com/music_images/music_default.png` }}
                            style={{ height: '100%', aspectRatio: 1, marginRight: 5 }} borderRadius={12} imageStyle={{ opacity: 0.25 }}>
                            <Image source={{ uri: `https://music-auto-tag.s3.ap-northeast-2.amazonaws.com/music_images/music_id_${music.musicId}.jpg` }}
                              style={{ width: '100%', height: '100%', borderColor: 'white', borderWidth: 3, borderRadius: 12 }} />
                          </ImageBackground>
                          <View style={{ width: '60%' }}>
                            <Text style={{ color: 'black', marginLeft: 10, fontSize: 17, fontWeight: '500' }} numberOfLines={1} ellipsizeMode="tail">{music.musicTitle}</Text>
                            <Text style={{ color: '#454545', marginLeft: 10, marginTop: 2, fontSize: 14 }} numberOfLines={1} ellipsizeMode="tail">{music.musicArtist}</Text>
                          </View>
                          <View style={{ marginRight: 5, flex: 1, marginLeft: 5 }}><Icon name="play" color='#626262' size={40} /></View>
                        </TouchableOpacity>
                      )
                    })}
                  </View>))}
              </ScrollView>
            </View>
          </ScrollView >
        </View >
      )
      }
    </CoreConsumer >
  );
};

export default ReorderableList;
