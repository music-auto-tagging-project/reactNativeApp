import React from 'react';
import { TextInput, Image, BackHandler, StyleSheet, Pressable, SafeAreaView, ScrollView, StatusBar, Text, TouchableHighlight, TouchableOpacity, View, PanResponder } from 'react-native';
import { useCallback } from 'react';
import rStyles from '../styles/styles'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const recent_search = ['멜로망스', '트와이스', '비도 오고 그래서']

function Search() {
  const color = 'black'
  return (
    <View style={{ backgroundColor: 'white', height: '100%' }}>
      <ScrollView showsVerticalScrollIndicator={false} style={rStyles.scrollView} persistentScrollbar={true}>
        <View style={{ flexDirection: 'row', paddingLeft: 30, paddingTop: 40 }}>
          <View style={{ width: 320, height: 25 }}>
            <Text style={{ fontSize: 25, fontWeight: 'bold' }}>검색</Text>
          </View>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', height: 50, marginTop: 20, flex: 1 }}>
          <TextInput placeholder='음악 또는 아티스트 검색' placeholderTextColor='gray' style={{ flex: 1, backgroundColor: '#ECECEC', height: 45, width: '85%', marginHorizontal: 12, color: 'black', fontSize: 17, paddingHorizontal: 15, paddingVertical: 0, borderRadius: 15 }} />
          <View><Icon name="printer-search" color='black' size={20} style={{ marginRight: 15 }} /></View>
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
  );
}

export default Search;
