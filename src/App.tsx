import 'react-native-gesture-handler';
import React, { useState, useEffect, useRef, Component, useContext, useCallback } from 'react';
import { Button, TextInput, Image, ScrollView, Modal, Animated, ImageBackground, StatusBar, View, Text, Pressable, TouchableOpacity, Dimensions, Alert } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import axios from 'axios';

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

	const windowWidth = Dimensions.get('window').width;
	const windowHeight = Dimensions.get('window').height;
	const result = useContext(CoreContext);

	const [userInfo, setUserInfo] = useState({})
	const [userName, setUserName] = useState('Guest')
	const [userImage, setUserImage] = useState('https://music-auto-tag.s3.ap-northeast-2.amazonaws.com/user_images/userimage_sample.png')
	const [userId, setUserId] = useState('')
	const [haveId, setHaveId] = useState(false)
	const [loggedin, setLoggedIn] = useState(false);
	const [loginModalOn, setLoginModalOn] = useState(false)
	const [loginID, setLoginID] = useState('')
	const [loginPW, setLoginPW] = useState('')
	const [loginWithEmail, setLoginWithEmail] = useState(false)

	const checkLoginDate = () => {
		if (loginID == 'test@email.com' && loginPW == '221121') {
			setLoginWithEmail(true)
		} else {
			Alert.alert('유효하지 않은 아이디 또는 비밀번호 입니다.')
		}
	}

	const onGoogleButtonPress = async () => {
		try {
			const { idToken } = await GoogleSignin.signIn();
			const googleCredential = auth.GoogleAuthProvider.credential(idToken);
			return auth().signInWithCredential(googleCredential);
		} catch (error) {
			console.log(error)
		}
	}

	const sendUserInfo = (name: string, email: string) => {
		console.log("Send" + name + email)
		axios.post("http://ec2-3-35-154-3.ap-northeast-2.compute.amazonaws.com:8080/user/login", {
			"name": name,
			"email": email
		}).then((response) => {
			setUserId(response.data.userId)
			setHaveId(response.data.login)
			console.log(response.data)
		}).catch(error => {
			console.log("error in send")
		})
	}

	const [authFlag, setAuthFlag] = useState(true)
	auth().onAuthStateChanged((user) => {
		if (authFlag) {
			setAuthFlag(false)
			if (user) {
				setLoggedIn(true)
				const user = auth().currentUser;
				setUserInfo(user)
				setUserName(user.displayName)
				setUserImage(user.photoURL)
				sendUserInfo(user.displayName, user.email)
				console.log(user)
			}
			else {
				setLoggedIn(false)
				console.log("loggedOut")
			}
		}
	})




	return (
		<CoreConsumer>
			{({ value, name, SetName, SetValue, SetImage, SetLoggein, SetId }) => (
				<>
					{(loggedin || loginWithEmail) ?
						<>
							<>
								{SetName(userName)}</>
							<>{SetImage(userImage)}</>
							<>{SetLoggein(haveId)}</>
							<>{SetId(userId)}
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
						<>
							<Modal
								animationType="none"
								transparent={false}
								visible={loginModalOn}
								onRequestClose={() => {
									setLoginModalOn(false)
								}}
							>
								<View style={{ height: '100%', width: '100%', backgroundColor: 'white', justifyContent: 'center', alignItems: 'center' }}>
									<Image
										source={require('./images/logo.png')}
										style={{ width: windowWidth * 0.56, height: windowWidth * 0.28, backgroundColor: 'black', marginBottom: 100 }} />
									<TextInput
										onChangeText={(id) => setLoginID(id)}
										placeholder='이메일 입력'
										style={{
											flexDirection: 'row', width: '77%', borderColor: '#E8E9EA',
											paddingLeft: 20, marginBottom: 20, borderWidth: 2, height: 55, borderRadius: 8,
											alignItems: 'center', justifyContent: 'center'
										}}
									/>
									<TextInput
										onChangeText={(password) => setLoginPW(password)}
										placeholder='비밀번호'
										secureTextEntry={true}
										style={{
											flexDirection: 'row', width: '77%', borderColor: '#E8E9EA',
											paddingLeft: 20, marginBottom: 60, borderWidth: 2, height: 55, borderRadius: 8,
											alignItems: 'center', justifyContent: 'center'
										}}
									/>

									<TouchableOpacity
										onPress={() => { checkLoginDate() }}
										style={{
											flexDirection: 'row', width: '50%', borderColor: '#E8E9EA',
											backgroundColor: '#F1BFBF',
											marginBottom: 20, borderWidth: 2, height: 55, borderRadius: 8,
											alignItems: 'center', justifyContent: 'center'
										}}>
										<Text style={{ fontSize: 17, color: 'white', fontWeight: 'bold' }}>로그인</Text>
									</TouchableOpacity>
								</View>
							</Modal>
							<View style={[{ height: '100%', justifyContent: "center", backgroundColor: 'white' }]}>
								<View style={{ justifyContent: 'center', alignItems: 'center' }}>
									<View style={{ justifyContent: 'center', alignItems: 'center', width: '100%' }}>
										<Image
											source={require('./images/logo.png')}
											style={{ width: windowWidth * 0.56, height: windowWidth * 0.28, backgroundColor: 'black' }} />
										<Image
											source={require('./images/logoText.png')}
											style={{ width: windowWidth * 0.8, height: windowWidth * 0.08, marginTop: 30 }}></Image>
										<View style={{ width: '100%', alignItems: 'center' }}>
											<View style={{ height: '35%' }}></View>
											<TouchableOpacity
												onPress={() => { setLoginModalOn(true) }}
												style={{
													flexDirection: 'row', width: '77%', borderColor: '#E8E9EA',
													marginBottom: 20, borderWidth: 2, height: 55, borderRadius: 8,
													alignItems: 'center', justifyContent: 'center'
												}}>
												<Text style={{ fontSize: 18, color: 'black', fontWeight: 'bold' }}>이메일로 로그인</Text>
											</TouchableOpacity>
											<TouchableOpacity
												onPress={() => { onGoogleButtonPress() }}
												style={{
													flexDirection: 'row', width: '77%', borderColor: '#E8E9EA',
													borderWidth: 2, height: 55, borderRadius: 8, alignItems: 'center', justifyContent: 'center'
												}}>
												<Image
													source={require('./images/google-logo-thumbnail.png')}
													style={{ height: 35, width: 35, marginRight: 5 }}></Image>
												<Text style={{ fontSize: 18, color: 'black', fontWeight: 'bold' }}>구글 계정으로 로그인</Text>
											</TouchableOpacity>
										</View>
									</View>
								</View>
							</View>
						</>
					}
				</>
			)}

		</CoreConsumer>
	);
};

export default App;
