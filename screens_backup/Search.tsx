import React from 'react';
import { TextInput, Image, BackHandler, StyleSheet, Pressable, SafeAreaView, ScrollView, StatusBar, Text, TouchableHighlight, TouchableOpacity, View, PanResponder } from 'react-native';
import { useCallback } from 'react';
import rStyles from '../styles/styles'

const recent_search = ['저 별', '아이유', '밤 편지', '노래']

function Search() {
  return (
    <View style={[{ flex: 1, backgroundColor: 'rgb(220,220,220)' }, rStyles.back_black]}>
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
        <View style={{ flex: 1, flexDirection: 'row', justifyContent:'center',alignItems :'center', height:50}}>
          <Image source={require('../images/arrow.png')} style={{width:22, height:22 }}></Image>
          <TextInput style={{ backgroundColor: 'rgb(205,205,205)', height: 33, width: '75%',marginHorizontal:12, color: 'gray' , fontSize:16, paddingHorizontal:15,paddingVertical:0, borderRadius:15}}>노래,앨범,아티스트 검색</TextInput>
          <Image source={require('../images/music.png')} style={{width:25, height:25}}></Image>
        </View>
        <View style={{ flex: 10 , marginTop:15}}>
          <View>
            {recent_search.map((log) => (
              <View key={log} style={[rStyles.container,{flexDirection:'row', marginVertical:1, marginLeft:20,backgroundColor: 'rgba(0,0,0,0)'}]}>
                <Image source={require('../images/time-left.png')} style={{width:25, height:25, marginRight:30}}></Image>
                <Text style={{ fontSize: 17, width:'75%' , color:'white'}}>
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
