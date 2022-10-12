import React, { useEffect } from 'react';
import { Modal, TextInput, Image, BackHandler, StyleSheet, Pressable, SafeAreaView, ScrollView, StatusBar, Text, TouchableHighlight, TouchableOpacity, View, PanResponder } from 'react-native';
import { useCallback, useState } from 'react';
import rStyles from '../styles/styles'
import musicData from '../etc/added_music_data.json'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import axios from 'axios';
import YoutubePlayer from 'react-native-youtube-iframe';
import * as Hangul from 'hangul-js';

const recent_search = ['멜로망스', '트와이스', '비도 오고 그래서']

function Search() {
  const color = 'black'
  const [textSearch, setTextSearch] = useState(1442)
  const [playmodalVisible, setPlayModalVisible] = useState(false);
  const [mainTagModalVisible, setMainTagModalVisible] = useState(false);
  const [musicInfo, setMusicInfo] = useState<any>(['null'])
  const userId = 3
  const musicTitle = Object.values(musicData['title'])
  const [searchText, setSearchText] = useState<string[]>([])
  const [textInput, setTextInput] = useState('')
  const [musicSearchOn, setMusicSearchOn] = useState(false)
  const colorList = ['#F1BFBF', '#F1D4BF', '#F1E6BF', '#CCF1BF', '#BFF1DF', '#BFD0F1', '#D6A7D7', '#F1BFBF', '#F1D4BF', '#F1E6BF', '#CCF1BF', '#BFF1DF', '#BFD0F1', '#D6A7D7', '#F1BFBF', '#F1D4BF', '#F1E6BF', '#CCF1BF', '#BFF1DF', '#BFD0F1', '#D6A7D7', '#F1BFBF', '#F1D4BF', '#F1E6BF', '#CCF1BF', '#BFF1DF', '#BFD0F1', '#D6A7D7', '#F1BFBF', '#F1D4BF', '#F1E6BF', '#CCF1BF', '#BFF1DF', '#BFD0F1', '#D6A7D7', '#F1BFBF', '#F1D4BF', '#F1E6BF', '#CCF1BF', '#BFF1DF', '#BFD0F1', '#D6A7D7', '#F1BFBF', '#F1D4BF', '#F1E6BF', '#CCF1BF', '#BFF1DF', '#BFD0F1', '#D6A7D7']

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

  function find_nm(nm: any) {

    const temp_list: string[] = []
    let flag = false;
    if (nm != "") {
      musicTitle.map((x) => {
        flag = true;
        Hangul.disassemble(nm).map((y, index) => {
          if (y !== Hangul.disassemble(x)[index]) {
            flag = false;
          }
        }
        )
        flag && temp_list.push(x)
      })
    }
    setSearchText(temp_list)
    console.log(searchText)
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

      <View style={{ backgroundColor: 'white', height: '100%', paddingHorizontal: 20 }}>
        <ScrollView showsVerticalScrollIndicator={false} style={rStyles.scrollView} persistentScrollbar={true}>
          <View style={{ flexDirection: 'row', paddingLeft: 20, paddingTop: 40 }}>
            <View style={{ width: 320, height: 25 }}>
              <Text style={{ fontSize: 27, fontWeight: 'bold' }}>검색</Text>
            </View>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', height: 50, marginTop: 20 }}>
            <TextInput value={textInput} onTouchStart={() => { setMusicSearchOn(false); find_nm(textInput) }} onChangeText={(nm) => { find_nm(nm); setTextInput(nm) }} placeholder='음악 또는 아티스트 검색' placeholderTextColor='gray' style={{ flex: 1, backgroundColor: '#ECECEC', height: 45, width: '88%', marginHorizontal: 12, color: 'black', fontSize: 17, paddingHorizontal: 15, paddingVertical: 0, borderRadius: 12 }} />
            <TouchableOpacity onPress={() => onClickMusic(textSearch)}><Icon name="printer-search" color='black' size={10} style={{ marginRight: 5 }} /></TouchableOpacity>
          </View>
          <View style={{ marginTop: 20 }}>
            {musicSearchOn ?
              <ScrollView style={{ paddingHorizontal: 15 }}>
                <Text style={{ fontSize: 27, fontWeight: 'bold' }}>음악</Text>
                <View style={{ width: '100%', height: 150, backgroundColor: colorList[0], marginTop: 15, borderRadius: 12, alignItems: 'center', flexDirection: 'row', padding: 10 }}>
                  <View>
                    <Image source={{ uri: `https://music-auto-tag.s3.ap-northeast-2.amazonaws.com/music_images/music_default.png` }}
                      style={{ width: 135, height: 135, marginRight: 0, opacity: 0.2 }} borderRadius={12} />
                    <Image source={{ uri: `https://music-auto-tag.s3.ap-northeast-2.amazonaws.com/music_images/music_id_${5}.jpg` }}
                      style={{ width: 135, height: 135, borderColor: 'white', borderWidth: 3, borderRadius: 12, position: 'absolute' }} />
                  </View>
                  <View style={{ justifyContent: 'flex-start', height: '100%', paddingTop: 5, paddingLeft: 15 , width:'55%'}}>
                    <Text numberOfLines={1} ellipsizeMode="tail" style={{ fontSize: 22, fontWeight: 'bold' }}>{textInput}</Text>
                    <Text style={{ fontSize: 15 }}>아티스트</Text>
                    <View style={{ marginTop: 3 }}>
                      <Text style={{ fontSize: 18 }}>#새벽  #발라드</Text>
                      <Text style={{ fontSize: 18 }}>#감성  #잔잔한</Text>
                    </View>
                  </View>
                </View>
                <Text style={{ fontSize: 27, fontWeight: 'bold', marginTop: 20 }}>아티스트</Text>
                <View style={{ width: '100%', height: 130, backgroundColor: colorList[1], marginTop: 15, borderRadius: 12, alignItems: 'center', flexDirection: 'row', padding: 10 }}>
                  <View>
                    <Image source={{ uri: `https://music-auto-tag.s3.ap-northeast-2.amazonaws.com/music_images/music_default.png` }}
                      style={{ width: 110, height: 110, marginRight: 0, opacity: 0.2 }} borderRadius={12} />
                    <Image source={{ uri: `https://music-auto-tag.s3.ap-northeast-2.amazonaws.com/music_images/music_id_${0}.jpg` }}
                      style={{ width: 110, height: 110, borderColor: 'white', borderWidth: 3, borderRadius: 12, position: 'absolute' }} />
                  </View>
                  <View style={{ justifyContent: 'flex-start', height: '100%', paddingTop: 5, paddingLeft: 15 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
                      <Text style={{ fontSize: 24, fontWeight: 'bold' }}>{'아티스트'}</Text>
                      <Text style={{ fontSize: 17, color: '#454545', marginBottom: 3 }}>  솔로 - 발라드, 랩</Text>
                    </View>
                    <View style={{ marginTop: 3 }}>
                      <Text style={{ fontSize: 18 }}>#새벽  #발라드</Text>
                      <Text style={{ fontSize: 18 }}>#감성  #잔잔한</Text>
                    </View>
                  </View>
                </View>
                <Text style={{ fontSize: 27, fontWeight: 'bold', marginTop: 20, marginBottom: 10 }}>관련 음악</Text>
                <View>
                  {Array.from(Array(5).keys()).map((n, index) => (
                    <TouchableOpacity key={index} style={{ width: 370, height: 80, padding: 4, marginVertical: 5, marginRight: 30, backgroundColor: colorList[n + 2], alignItems: 'center', flexDirection: 'row', borderRadius: 15 }}>
                      <Image source={{ uri: `https://music-auto-tag.s3.ap-northeast-2.amazonaws.com/music_images/music_default.png` }}
                        style={{ width: 65, height: 65, marginRight: 0, opacity: 0.2 }} borderRadius={12} />
                      <Image source={{ uri: `https://music-auto-tag.s3.ap-northeast-2.amazonaws.com/music_images/music_id_${0}.jpg` }}
                        style={{ width: 65, height: 65, borderColor: 'white', borderWidth: 3, borderRadius: 12, position: 'absolute' }} />
                      <View style={{ width: 230 }}>
                        <Text style={{ color: '#454545', marginLeft: 10, fontSize: 17, fontWeight: 'bold' }} numberOfLines={1} ellipsizeMode="tail">너에게로 떠나는 여행</Text>
                        <Text style={{ color: '#454545', marginLeft: 10, marginTop: 2, fontSize: 15 }} numberOfLines={1} ellipsizeMode="tail">버즈</Text>
                      </View>
                      <View style={{ marginRight: 5, flex: 1, marginLeft: 5 }}><Icon name="play" color='#626262' size={40} /></View>
                    </TouchableOpacity>
                  ))}
                </View>

              </ScrollView>
              :
              (textInput == '' ?
                <View>
                  {recent_search.map((log) => (
                    <View key={log} style={[{ flexDirection: 'row', height: 55, marginLeft: 20, alignItems: 'center' }]}>
                      <Text style={{ fontSize: 20, width: '75%', color: 'black' }}>
                        {log}
                      </Text>
                      <Text>- - - -    </Text>
                      <Icon name="close" color={'#FF6666'} size={15} style={{ marginRight: 15 }} />
                    </View>
                  ))}
                </View>
                :
                <View style={{ paddingHorizontal: 20 }}>
                  {searchText.slice(0, 10).map((title, index) => (
                    <TouchableOpacity key={title} onPress={() => { setTextInput(title); setMusicSearchOn(true) }} style={{ height: 55, borderBottomColor: 'rgba(230,230,230,1)', borderBottomWidth: 1.5, justifyContent: 'center' }}>
                      <Text numberOfLines={1} style={{ fontSize: 20 }}>{title}</Text>
                    </TouchableOpacity>
                  )
                  )}
                </View>
              )
            }
          </View>
        </ScrollView>
      </View>
    </>
  );
}

export default Search;
