import {
  StyleSheet,
  View,
  Text,
} from 'react-native';

import * as React from 'react';
import { useState, useEffect, useRef, Component, useContext } from 'react';
import { TextInput, Image, ScrollView, TouchableOpacity, Modal, Button } from 'react-native';
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


  const [playmodalVisible, setPlayModalVisible] = useState(false);
  const [mainTagModalVisible, setMainTagModalVisible] = useState(false);
  const [recTag, setRecTag] = useState('');
  const [UserTag2, setUserTag2] = useState(['null'])
  const [userName, setUserName] = useState('User Name')
  const [userId, setUserId] = useState('1')
  const [UserImage, setUserImage] = useState('null')
  const [rMusicList, setRMusicList] = useState(['null']);
  const [musicInfo, setMusicInfo] = useState<any>(['null'])

  const { route } = props;
  const { params } = route;
  const result = useContext(CoreContext);
  const [backValue, SetbackValue] = useState(result.value);
  const navigation = useNavigation();



  const onClickMusic = () => {
    axios
      .get(`http://ec2-3-35-154-3.ap-northeast-2.compute.amazonaws.com:8080/music/stream/${1444}`).
      then((response) => {
        setMusicInfo(response.data);
      }).catch(error => {
        console.log(error.config)
      });
    setPlayModalVisible(true)
    // setMusicId(music.musicId)
  }

  useEffect(() => {
    axios
      .get(`http://3.35.154.3:5000/music/stream/1`).
      then((response) => {
        {setMusicInfo(response.data);}
        console.log(123123)
      }).catch(error => {
        console.log(error.config)
      })

    axios
      .get(`http://ec2-3-35-154-3.ap-northeast-2.compute.amazonaws.com:8080/main/${3}`)
      .then((response) => {
        SetbackValue(response.data['tagList']);
        setUserName(response.data['userName']);
        setUserImage(response.data['userImage']);
        setRMusicList(response.data["recommendMusicList"]);
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
                  <Text style={{ fontSize: 25, color: 'white' }}>{musicInfo.musicTitle}</Text>
                  <Text style={{ fontSize: 20, color: 'gray', marginTop: 5 }}>({musicInfo.artist})</Text>
                </View>
                <View style={{flexDirection:'row', marginTop:20, alignItems:'center',justifyContent:'center'}}>
                  {musicInfo.tagList && musicInfo.tagList.map((tag:any,index)=>(
                    <View key={index}>
                    <Text style={{color:'gray', fontSize:17,marginHorizontal:5}}>#{tag}</Text>
                    </View>
                  ))}
                </View>
                <View style={{ flex: 7 }}>
                  <View style={{ flexDirection: 'row', marginBottom: 30 }}>
                  </View>
                  <View style={{ marginTop:35}}>
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
                    {musicInfo.musicLyric && musicInfo.musicLyric.split('\n').slice(0,7).map((lyric : any,index)=>(
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

          {/* 태그 기반 추천 음악 Page */ }

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
              <TouchableOpacity onPress={onClickMusic}>
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
  {/* 메인 페이지 */ }
  <ScrollView showsVerticalScrollIndicator={false} style={rStyles.scrollView} stickyHeaderIndices={[1]} persistentScrollbar={true}>
    {SetValue(backValue)}
    <View style={{ height: 60, justifyContent: 'center' }}>
      <View style={{ flexDirection: 'row' }}>
        <View><Image source={require('../images/magician.jpg')} style={rStyles.Logo} /></View>
        <View style={{ flex: 5, marginTop: 5 }}><Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold' }}>Music App</Text></View>
        <TouchableOpacity>
          <View style={{ flex: 2 }}><Image source={{ uri: `data:image/jpeg;base64,${UserImage}` }} style={[rStyles.Logo, { marginRight: 20 }]} /></View>
        </TouchableOpacity>
      </View>
    </View>
    <ScrollView showsHorizontalScrollIndicator={false} horizontal={true} style={{ backgroundColor: 'black', flex: 1, justifyContent: 'center', paddingVertical: 15, }}>
      <View style={{ flexDirection: 'row' }}>
        <View style={{ width: 15 }}></View>
        {backValue && backValue.map((tag,index) => (
          <TouchableOpacity key={index} onPress={() => {
            setMainTagModalVisible(!mainTagModalVisible)
            setRecTag(tag)
          }
          }>
            <View style={rStyles.container}>
              <Text style={{ fontSize: 19, color: "white" }}>
                {tag}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

    </ScrollView>
    <View style={{ flex: 7, alignItems: 'flex-start', justifyContent: 'center' }}>
      <View style={rStyles.MusicContainer}>
        <Text style={{ color: 'white', fontWeight: 'bold', marginBottom: 15, marginTop: 30, fontSize: 30 }}>추천 음악!</Text>
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={{ flexDirection: 'row' }}>
          {[0, 1, 2, 3].map((n, index) => (
            <View key={index}>
              {
                rMusicList.slice(n * 4, (n + 1) * 4).map((music: any, index) => (
                  <View style={[rStyles.MusicBox, { flexDirection: 'row' }]} key={index}>
                    <TouchableOpacity onPress={onClickMusic}>
                      <Image source={{ uri: `data:image/jpeg;base64,${music.musicImage}` }} style={[rStyles.MusicStyle, { marginRight: 20 }]} />
                    </TouchableOpacity>
                    <View style={{ flex: 7 }}>
                      <Text style={{ fontSize: 17, color: 'white' }}>
                        {music.musicTitle}
                      </Text>
                      <Text style={{ fontSize: 17, color: 'gray' }}>
                        {music.musicArtist}
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
    <View style={{ marginTop: 40, justifyContent: 'center' }}>
      <TouchableOpacity>
        <Text style={{ color: 'white', marginLeft: 25, fontWeight: 'bold', fontSize: 30 }}>
          다시 듣기
        </Text>
      </TouchableOpacity>
      <ScrollView showsHorizontalScrollIndicator={false} horizontal={true} style={{ paddingHorizontal: 25, paddingVertical: 15 }}>
        {Array.from(Array(4).keys()).map((n, index) => {
          return (
            <View key={index}>
              <Image source={{ uri: `https://music-auto-tag.s3.ap-northeast-2.amazonaws.com/music_images/music_id_118${n + 1}.jpg` }} style={{ borderWidth: 0.2, borderColor: 'gray', borderRadius: 7, width: 100, height: 100, margin: 10 }} />
              <Text style={{ color: 'white' }}>{Sample_Replay[n].title}</Text>
            </View>
          )
        })}
      </ScrollView>
    </View>
    <View style={{ marginTop: 40, justifyContent: 'center' }}>
      <Text style={{ marginLeft: 25, color: 'white', fontWeight: 'bold', fontSize: 30 }}>Music Mix</Text>
      <ScrollView showsHorizontalScrollIndicator={false} horizontal={true} style={{ paddingHorizontal: 25, paddingVertical: 15 }}>
        {[...Array(10)].map((n, index) => {
          return (
            <TouchableOpacity key={index}>
              <Image source={require('../images/music_default.png')} key={n} style={{ borderColor: 'gray', borderRadius: 10, width: 100, height: 100, margin: 10, opacity: 0.7 }}>
              </Image>
            </TouchableOpacity>
          )
        })}
      </ScrollView>
    </View>
    <View style={{ marginTop: 40, justifyContent: 'center' }}>
      <Text style={{ marginLeft: 25, fontWeight: 'bold', fontSize: 30, color: 'white', }}>Music Rec Playlist</Text>
      <ScrollView showsHorizontalScrollIndicator={false} horizontal={true} style={{ paddingHorizontal: 25, paddingVertical: 15 }}>
        {[...Array(10)].map((n, index) => {
          return (
            <TouchableOpacity key={index}>
              <Image source={require('../images/music_default.png')} key={n} style={{ borderColor: 'gray', borderRadius: 10, width: 100, height: 100, margin: 10, opacity: 0.7 }}>
              </Image>
            </TouchableOpacity>
          )
        })}
      </ScrollView>
    </View>
  </ScrollView >
        </View >
      )}
    </CoreConsumer >
  );
};

export default ReorderableList;
