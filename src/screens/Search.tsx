import React from 'react';
import { TextInput, Image, BackHandler, StyleSheet, Pressable, SafeAreaView, ScrollView, StatusBar, Text, TouchableHighlight, TouchableOpacity, View, PanResponder } from 'react-native';
import { useCallback } from 'react';
import rStyles from '../styles/styles'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const recent_search = ['저 별 - 헤이즈', '아이유', '밤 편지', '노래','Madeleine love', '이승철 서쪽 하늘','이선희','사랑한다는 흔한 말']

function Search() {
  const color = 'white'
  return (
    <View style={{ flex: 1, backgroundColor: 'black' }}>
      <ScrollView>
        <View style={{ flex: 1 }}>
          <View style={{ height: 60, justifyContent: 'center' }}>
            <View style={{ paddingRight: 255, flexDirection: 'row' }}>
              <TouchableOpacity>
                <View style={{}}><Image source={require('../images/magician.jpg')} style={rStyles.Logo} /></View>
              </TouchableOpacity>
              <View style={{ marginTop: 5 }}><Text style={{ fontSize: 20, fontWeight: 'bold', color:'white' }}>Music App</Text></View>
            </View>
          </View>
        </View>
        <View style={{ flex: 1, flexDirection: 'row', justifyContent:'center',alignItems :'center', height:50, marginTop:20}}>
        <Icon name="arrow-left" color={color} size={40} />
          <TextInput style={{ backgroundColor: 'rgba(255,255,255,0.25)', height: 45, width: '70%',marginHorizontal:12, color: 'white' , fontSize:20, paddingHorizontal:15,paddingVertical:0, borderRadius:20}}>노래,앨범,아티스트 검색</TextInput>
          <Icon name="microphone" color={color} size={35} />
        </View>
        <View style={{ flex: 10 , marginTop:15}}>
          <View>
            {recent_search.map((log) => (
              <View key={log} style={[rStyles.container,{flexDirection:'row', marginVertical:1, marginLeft:20,backgroundColor: 'rgba(0,0,0,0)', alignItems:'center'}]}>
                <Icon name="update" color={'gray'} size={30} style={{marginRight:15}}/>
                <Text style={{ fontSize: 20, width:'75%' , color:'white'}}>
                  {log}
                </Text>
                <Image source={require('../images/diagonal-arrow.png')} style={{width:22, height:22, marginRight:12}}></Image>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

export default Search;
