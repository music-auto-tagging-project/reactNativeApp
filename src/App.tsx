import 'react-native-gesture-handler';
import React, { useState, useEffect, useRef, Component, useContext, useCallback } from 'react';
import { TextInput, Image, ScrollView, Modal, Animated, ImageBackground, StatusBar, View, Text, Pressable, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';


import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import UserPage from './screens/UserPage';
import MainPage from './screens/MainPage';
import Search from './screens/Search';

import { CoreConsumer, CoreContext } from './context/CoreManagement';
import { GoogleSignin, GoogleSigninButton } from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth'

const { Navigator, Screen } = createBottomTabNavigator();
const MyTheme: any = {
	dark: true,
	colors: {
		primary: 'black',
		card: 'rgb(255,255,255)',
		text: 'black',
		border: 'rgb(199, 199, 204)',
		notification: 'black',
	},
};

const App = () => {
	const result = useContext(CoreContext);

	const [userInfo, setUserInfo] = useState({})
	const [userName, setUserName] = useState('user1')
	const [userImage, setUserImage] = useState('https://music-auto-tag.s3.ap-northeast-2.amazonaws.com/user_images/userimage_sample.png')
	const [userId, setUserId] = useState('')
	const [userTag, setUserTag] = useState([''])

	const onGoogleButtonPress = async () => {
		try {
		const { idToken } = await GoogleSignin.signIn();
		const googleCredential = auth.GoogleAuthProvider.credential(idToken);
		return auth().signInWithCredential(googleCredential); } catch (error) {
			console.log(error)
		}
	}

	const [loggedin, setLoggedIn] = useState(false);
	auth().onAuthStateChanged((user) => {
		if (user) {
			setLoggedIn(true)
			const user = auth().currentUser;
			setUserInfo(user)
			setUserName(user.displayName)
			setUserImage(user.photoURL)
			console.log("loggedIn")
		} else {
			setLoggedIn(false)
			console.log("loggedOut")
		}
	})
	console.log(result);

	return (
		<CoreConsumer>
			{({ value, name, SetName, SetValue, SetImage, SetLoggein }) => (
				<>
					{loggedin ?
						<>
							<>
								{SetName(userName)}
							</>
							<>
								{SetImage(userImage)}
							</>
							<StatusBar barStyle="light-content" />
							<NavigationContainer theme={MyTheme}>
								<Navigator>
									<Screen
										name="Home"
										component={MainPage}
										options={{
											tabBarLabel: 'Home',
											tabBarIcon: ({ color, size }) => (
												<Icon name="home" color={color} size={size} />
											),
										}}
									/>
									<Screen
										name="Search"
										component={Search}
										options={{
											tabBarLabel: 'Search',
											tabBarIcon: ({ color, size }) => (
												<Icon name="magnify" color={color} size={size} />
											),
										}}
									/>
									<Screen
										name="My Page"
										component={UserPage}
										options={{
											tabBarLabel: 'My Page',
											tabBarIcon: ({ color, size }) => (
												<Icon name="account-circle" color={color} size={size} />
											),
										}}
									/>
								</Navigator>
							</NavigationContainer>
						</>
						:
						<View style={[{ height: '100%', justifyContent: "flex-start", }]}>
							<View style={{ justifyContent: 'center', alignItems: 'center' }}>
								<View style={{ height: 150 }}></View>
								<View style={{ justifyContent: 'center', alignItems: 'center', width: '100%' }}>
									<TextInput style={{ marginBottom: 25, paddingLeft: 15, width: '77%', backgroundColor: '#F7F8F9', height: 55, borderColor: '#E0E1E2', borderWidth: 1, borderRadius: 10, fontSize: 18 }} placeholder='아이디' placeholderTextColor='#CECED1'></TextInput>
									<TextInput secureTextEntry={true} style={{ paddingLeft: 15, width: '77%', backgroundColor: '#F7F8F9', height: 55, borderColor: '#E0E1E2', borderWidth: 1, borderRadius: 10, fontSize: 18 }} placeholder='비밀번호' placeholderTextColor='#CECED1'></TextInput>
									<View style={{ alignItems: 'flex-end', width: '100%', marginTop: 70, marginBottom: 40, paddingRight: 50 }}><Text style={{ color: '#6B8BDE' }}>비밀번호 재설정</Text></View>
								</View>
								<View style={{ width: '100%', alignItems: 'center' }}>
									<TouchableOpacity style={{ width: '77%', backgroundColor: '#F1BFBF', height: 55, borderRadius: 10, marginBottom: 8, alignItems: 'center', justifyContent: 'center' }}><Text style={{ fontSize: 18, color: 'white', fontWeight: 'bold' }}>로그인</Text></TouchableOpacity>
									<TouchableOpacity onPress={() => { onGoogleButtonPress() }} style={{ flexDirection: 'row', width: '77%', borderColor: '#E8E9EA', borderWidth: 2, height: 55, borderRadius: 8, alignItems: 'center', justifyContent: 'center' }}>
										<Image source={require('./images/google-logo-thumbnail.png')} style={{ height: 35, width: 35, marginRight: 5 }}></Image>
										<Text style={{ fontSize: 18, color: 'black', fontWeight: 'bold' }}>구글 계정으로 로그인</Text>
									</TouchableOpacity>
									<View style={{ flexDirection: 'row', marginTop: 35 }}>
										<Text>아직 계정이 없으신가요?</Text>
										<TouchableOpacity style={{ marginLeft: 10 }}><Text style={{ fontWeight: 'bold' }}>회원가입</Text></TouchableOpacity>
									</View>
								</View>
							</View>
						</View>
					}
				</>
			)}

		</CoreConsumer>
	);
};

export default App;
