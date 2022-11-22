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
  const [searchedInfo, setSearchedInfo] = useState({ "musicNameList": [], "artistNameList": [], "tagList": [] })
  const [clickArtist, setClickArtist] = useState(false)
  const [artistsMusic, setArtistsMusic] = useState([])
  const [artistModalTitle, setArtistModalTitle] = useState('Artist')
  const [rMusicList, setRMusicList] = useState(['null'])

  useEffect(() => {

    axios
      .get(`http://ec2-3-35-154-3.ap-northeast-2.compute.amazonaws.com:8080/main/${userId}`)
      .then((response) => {
        setRMusicList(response.data["recommendMusicList"]);
      }).catch(error => {
        console.log(error.config)
      })
  }, []
  )

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

  const searchMusic = (title: string) => {
    axios
      .get(`http://ec2-3-35-154-3.ap-northeast-2.compute.amazonaws.com:8080/search/${title}`).
      then((response) => {
        console.log(response.data);
        setSearchedInfo(response.data)
      }).catch(error => {
        console.log(error.config);
      });
    setTextInput(title);
    setMusicSearchOn(true);
  }

  const clickArtistSearched = (id: string) => {
    axios
      .get(`http://ec2-3-35-154-3.ap-northeast-2.compute.amazonaws.com:8080/artist/info/${id}`).
      then((response) => {
        console.log(response.data.musicList);
        setArtistsMusic(response.data.musicList)
        setArtistModalTitle(response.data.name)
      }).catch(error => {
        console.log(error.config);
      });
    setClickArtist(true);

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
      {/* 아티스트 선택 시 */}
      <Modal
        animationType="slide"
        transparent={false}
        visible={clickArtist}
        onRequestClose={() => {
          setClickArtist(!clickArtist)
        }}
      >
        <View style={{ paddingHorizontal: 35, paddingVertical: 40, }}>
          <Text style={{ fontSize: 27, fontWeight: 'bold', marginTop: 0, marginBottom: 10 }}>{artistModalTitle + '의 곡'}</Text>
          <ScrollView>
            {artistsMusic.map((music, index) => (
              <TouchableOpacity onPress={() => { onClickMusic(music.musicId) }} key={index} style={{ width: '88%', height: 80, padding: 4, marginVertical: 5, marginRight: 30, backgroundColor: colorList[index], alignItems: 'center', flexDirection: 'row', borderRadius: 15 }}>
                <Image source={{ uri: `https://music-auto-tag.s3.ap-northeast-2.amazonaws.com/music_images/music_default.png` }}
                  style={{ width: 65, height: 65, marginRight: 0, opacity: 0.2 }} borderRadius={12} />
                <Image source={{ uri: `https://music-auto-tag.s3.ap-northeast-2.amazonaws.com/music_images/music_id_${music.musicId}.jpg` }}
                  style={{ width: 65, height: 65, borderColor: 'white', borderWidth: 3, borderRadius: 12, marginLeft: 4, position: 'absolute' }} />
                <View style={{ width: 230 }}>
                  <Text style={{ color: '#454545', marginLeft: 10, fontSize: 17, fontWeight: 'bold' }} numberOfLines={1} ellipsizeMode="tail">{music.musicTitle}</Text>
                  <Text style={{ color: '#454545', marginLeft: 10, marginTop: 2, fontSize: 15 }} numberOfLines={1} ellipsizeMode="tail">{artistModalTitle}</Text>
                </View>
                <View style={{ marginRight: 5, flex: 1, marginLeft: 5 }}><Icon name="play" color='#626262' size={40} /></View>
              </TouchableOpacity>
            ))}
          </ScrollView>
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
              <Text style={{ fontSize: 25, color: 'black', marginTop: 8, fontWeight: 'bold' }} numberOfLines={1} ellipsizeMode="tail">{musicInfo.musicTitle}</Text>
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
              <View style={{ backgroundColor: 'gray', width: '85%', height: 3 }}></View>
            </View>
            <View style={{ paddingHorizontal: 30, alignItems: 'flex-start' }}>
              <Text style={{ fontSize: 27, color: 'black', marginTop: 5, fontWeight: 'bold' }}>다음 곡</Text>
              <ScrollView style={{ paddingHorizontal: 0, paddingVertical: 15 }} horizontal={true} showsHorizontalScrollIndicator={false}>
                {Array.from(Array(Math.ceil(rMusicList.length * 2 / 5)).keys()).map((n, index) => (
                  <ScrollView key={index} style={{}}>
                    {[...rMusicList].slice(n * 5, (n + 1) * 5).map((music, index) => {
                      return (
                        <TouchableOpacity key={index} style={{ width: 370, height: 80, padding: 4, marginVertical: 5, marginRight: 30, backgroundColor: colorList[index], alignItems: 'center', flexDirection: 'row', borderRadius: 15 }} onPress={() => onClickMusic(music.musicId)}>
                          <Image source={{ uri: `https://music-auto-tag.s3.ap-northeast-2.amazonaws.com/music_images/music_default.png` }}
                            style={{ width: 65, height: 65, marginRight: 0, opacity: 0.2 }} borderRadius={12} />
                          <Image source={{ uri: `https://music-auto-tag.s3.ap-northeast-2.amazonaws.com/music_images/music_id_${music.musicId}.jpg` }}
                            style={{ width: 65, height: 65, borderColor: 'white', borderWidth: 3, borderRadius: 12, marginLeft: 4, position: 'absolute' }} />
                          <View style={{ width: 230 }}>
                            <Text style={{ color: '#454545', marginLeft: 10, fontSize: 17, fontWeight: 'bold' }} numberOfLines={1} ellipsizeMode="tail">{music.musicTitle}</Text>
                            <Text style={{ color: '#454545', marginLeft: 10, marginTop: 2, fontSize: 15 }} numberOfLines={1} ellipsizeMode="tail">{music.musicArtist}</Text>
                          </View>
                          <View style={{ marginRight: 5, flex: 1, marginLeft: 5 }}><Icon name="play" color='#626262' size={40} /></View>
                        </TouchableOpacity>
                      )
                    })}
                  </ScrollView>))}
              </ScrollView>
            </View>
            <View>

            </View>
          </View>
        </ScrollView>
      </Modal>

      {/* Search page */}

      <View style={{ backgroundColor: 'white', height: '100%' }}>
        <ScrollView showsVerticalScrollIndicator={false} style={rStyles.scrollView} persistentScrollbar={true}>
          <View style={{ flexDirection: 'row', paddingLeft: 20, paddingTop: 35 }}>
            <View style={{ width: 320, height: 25 }}>
              <Text style={{ fontSize: 27, fontWeight: 'bold' }}>검색</Text>
            </View>
          </View>
          <View style={{alignItems:'center', width:'100%'}}>
            <View style={{
              flexDirection: 'row',  alignItems: 'center', height: 50, marginTop: 30,
              flex: 1, backgroundColor: '#ECECEC', width: '90%',
              paddingHorizontal: 15, paddingVertical: 0, borderRadius: 12
            }}>
              <TextInput value={textInput} onTouchStart={() => { setMusicSearchOn(false); find_nm(textInput) }} onChangeText={(nm) => { find_nm(nm); setTextInput(nm) }} placeholder='음악 또는 아티스트 검색' placeholderTextColor='gray' style={{width:'93%'}} />
              <TouchableOpacity onPress={() => searchMusic(textInput)}><Icon name="magnify" color='black' size={20} /></TouchableOpacity>
            </View>
          </View>
          <View style={{ marginTop: 20 }}>
            {musicSearchOn ?
              <ScrollView style={{ paddingHorizontal: 15 }}>
                {searchedInfo.musicNameList.length != 0 ?
                  <>
                    <Text style={{ fontSize: 27, fontWeight: 'bold', marginTop: 0, marginBottom: 10 }}>검색 음악</Text>
                    <View style={{alignItems:'center', justifyContent:'center',width:'100%'}}>
                      {searchedInfo.musicNameList.slice(0, 7).map((music, index) => (
                        <TouchableOpacity onPress={() => { onClickMusic(music.musicId) }} key={index} style={{ width: '96%', height: 80, padding: 4, marginVertical: 5, backgroundColor: colorList[index], alignItems: 'center', flexDirection: 'row', borderRadius: 15 }}>
                          <Image source={{ uri: `https://music-auto-tag.s3.ap-northeast-2.amazonaws.com/music_images/music_default.png` }}
                            style={{ width: 65, height: 65, marginRight: 0, opacity: 0.2 }} borderRadius={12} />
                          <Image source={{ uri: `https://music-auto-tag.s3.ap-northeast-2.amazonaws.com/music_images/music_id_${music.musicId}.jpg` }}
                            style={{ width: 65, height: 65, borderColor: 'white', borderWidth: 3, borderRadius: 12, marginLeft: 4, position: 'absolute' }} />
                          <View style={{ width: '65%' }}>
                            <Text style={{ color: 'black', marginLeft: 10, fontSize: 17 }} numberOfLines={1} ellipsizeMode="tail">{music.musicTitle}</Text>
                            <Text style={{ color: '#454545', marginLeft: 10, marginTop: 2, fontSize: 14 }} numberOfLines={1} ellipsizeMode="tail">{'Artist'}</Text>
                          </View>
                          <View style={{ marginRight: 5, flex: 1, marginLeft: 5 }}><Icon name="play" color='#626262' size={40} /></View>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </>
                  : <View></View>
                }
                {searchedInfo.artistNameList.length != 0 ?
                  <>
                    <Text style={{ fontSize: 27, fontWeight: 'bold', marginTop: 20, marginBottom: 10 }}>아티스트</Text>
                    <View style={{alignItems:'center', justifyContent:'center',width:'100%'}}>
                      {searchedInfo.artistNameList.slice(0, 7).map((artist, index) => (
                        <TouchableOpacity onPress={() => { clickArtistSearched(artist.id) }} key={index} style={{ width: '96%', height: 80, padding: 4, marginVertical: 5, backgroundColor: colorList[index], alignItems: 'center', flexDirection: 'row', borderRadius: 15 }}>
                          <Image source={{ uri: `https://music-auto-tag.s3.ap-northeast-2.amazonaws.com/music_images/music_default.png` }}
                            style={{ width: 65, height: 65, marginRight: 0, opacity: 0.2 }} borderRadius={12} />
                          <Image source={{ uri: `https://music-auto-tag.s3.ap-northeast-2.amazonaws.com/music_images/music_id_${999999}.jpg` }}
                            style={{ width: 65, height: 65, borderColor: 'white', borderWidth: 3, marginLeft: 4, borderRadius: 12, position: 'absolute' }} />
                          <View style={{ width: '65%' }}>
                            <Text style={{ color: '#454545', marginLeft: 10, fontSize: 17}} numberOfLines={1} ellipsizeMode="tail">{artist.name}</Text>
                          </View>
                          <View style={{ marginRight: 5, flex: 1, marginLeft: 5 }}><Icon name="dots-vertical" color='#626262' size={40} /></View>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </>
                  : <View></View>}
                {searchedInfo.tagList.length != 0 ?
                  <>
                    <Text style={{ fontSize: 27, fontWeight: 'bold', marginTop: 20, marginBottom: 10 }}>관련 태그</Text>
                    <View style={{alignItems:'center', justifyContent:'center',width:'100%'}}>
                      {searchedInfo.tagList.map((tag, index) => (
                        <TouchableOpacity key={index} style={{ width: '96%', height: 80, padding: 4, marginVertical: 5, backgroundColor: colorList[index], alignItems: 'center', flexDirection: 'row', borderRadius: 15 }}>
                          <Image source={{ uri: `https://music-auto-tag.s3.ap-northeast-2.amazonaws.com/music_images/music_default.png` }}
                            style={{ width: 65, height: 65, marginRight: 0, opacity: 0.2 }} borderRadius={12} />
                          <Image source={{ uri: `https://music-auto-tag.s3.ap-northeast-2.amazonaws.com/music_images/music_id_${0}.jpg` }}
                            style={{ width: 65, height: 65, borderColor: 'white', borderWidth: 3, borderRadius: 12, position: 'absolute' }} />
                          <View style={{ width: '65%' }}>
                            <Text style={{ color: '#454545', marginLeft: 10, fontSize: 17}} numberOfLines={1} ellipsizeMode="tail">{tag}</Text>
                          </View>
                          <View style={{ marginRight: 5, flex: 1, marginLeft: 5 }}><Icon name="dots-vertical" color='#626262' size={40} /></View>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </>
                  : <View></View>
                }
              </ScrollView>
              :
              (textInput == '' ?
                <View>
                  {/* {recent_search.map((log) => (
                    <View key={log} style={[{ flexDirection: 'row', height: 55, marginLeft: 20, alignItems: 'center' }]}>
                      <Text style={{ fontSize: 20, width: '75%', color: 'black' }}>
                        {log}
                      </Text>
                      <Text>- - - -    </Text>
                      <Icon name="close" color={'#FF6666'} size={15} style={{ marginRight: 15 }} />
                    </View>
                  ))} */}
                </View>
                :
                <View style={{ paddingHorizontal: 20 }}>
                  {searchText.slice(0, 10).map((title, index) => (
                    <TouchableOpacity key={title} onPress={() => { searchMusic(title) }} style={{ height: 55, borderBottomColor: 'rgba(230,230,230,1)', borderBottomWidth: 1.5, justifyContent: 'center' }}>
                      <Text numberOfLines={1} style={{ fontSize: 17 }}>{title}</Text>
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
