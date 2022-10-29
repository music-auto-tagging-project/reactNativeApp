import { View, Text, TouchableOpacity, TouchableHighlight } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import * as React from 'react';
import { useState, useEffect, useRef, Component, useContext, useCallback } from 'react';
import { TextInput, Image, ScrollView, Modal, Animated, ImageBackground, Pressable } from 'react-native';
import rStyles from '../styles/styles'
import axios from 'axios';
import * as Hangul from 'hangul-js';
import { CoreContext, CoreConsumer } from '../context/CoreManagement';


import { GoogleSignin, GoogleSigninButton } from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth'

// Oauth
const colorList = ['#F1BFBF', '#F1D4BF', '#F1E6BF', '#CCF1BF', '#BFF1DF', '#BFD0F1', '#CFBFF1']


const ColorDragDrop = (props: any) => {



	// const 모음
	const [userInfo, setUserInfo] = useState({})

	const renderTime = 10
	const [modalVisible, setModalVisible] = useState(false);
	const [userName, setUserName] = useState('User_1')
	const [userId, setUserId] = useState('3')
	const [UserImage, setUserImage] = useState('null')
	const [fixedTag, setFixedTag] = useState<string[]>([]);
	const [autoTag, setAutoTag] = useState<string[]>(['평화로운', '봄바람']);
	const [startText, setStartText] = useState<string[]>([]);
	const [text_array, setText_Array] = useState(["사랑", "이별", "서정적", "슬픔", "뭉게구름", "따뜻한", "새벽", "감성"])
	const [inputText, setInputText] = useState('')
	const [deletedTag, setDeletedTag] = useState<string[]>([])
	const [tagSearchOn, setTagSearchOn] = useState(true)
	const [tagStateModal, setTagStateModal] = useState(false)
	const [autoTagStateModal, setAutoTagStateModal] = useState(false)
	const [tagStateModalTag, setTagStateModalTag] = useState(['Tag'])
	const [showPlaylist, setShowPlaylist] = useState(false)
	const [playlistSetting, setPlaylistSetting] = useState(false)
	const [pMusicList, setPMusicList] = useState([{ "musicArtist": ["버스커 버스커"], "musicId": 4, "musicImage": null, "musicTitle": "벚꽃 엔딩" }, { "musicArtist": ["폴킴"], "musicId": 7, "musicImage": null, "musicTitle": "너를 만나" }, { "musicArtist": ["에일리(Ailee)"], "musicId": 3, "musicImage": null, "musicTitle": "첫눈처럼 너에게 가겠다" }, { "musicArtist": ["버스커 버스커"], "musicId": 4, "musicImage": null, "musicTitle": "벚꽃 엔딩" }, { "musicArtist": ["폴킴"], "musicId": 7, "musicImage": null, "musicTitle": "너를 만나" }, { "musicArtist": ["에일리(Ailee)"], "musicId": 3, "musicImage": null, "musicTitle": "첫눈처럼 너에게 가겠다" }, { "musicArtist": ["버스커 버스커"], "musicId": 4, "musicImage": null, "musicTitle": "벚꽃 엔딩" }, { "musicArtist": ["폴킴"], "musicId": 7, "musicImage": null, "musicTitle": "너를 만나" }, { "musicArtist": ["에일리(Ailee)"], "musicId": 3, "musicImage": null, "musicTitle": "첫눈처럼 너에게 가겠다" }, { "musicArtist": ["버스커 버스커"], "musicId": 4, "musicImage": null, "musicTitle": "벚꽃 엔딩" }, { "musicArtist": ["폴킴"], "musicId": 7, "musicImage": null, "musicTitle": "너를 만나" }, { "musicArtist": ["에일리(Ailee)"], "musicId": 3, "musicImage": null, "musicTitle": "첫눈처럼 너에게 가겠다" }])
	const [selectMusic, setSelectMusic] = useState([false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false])
	const [selectNumber, setSelectNumber] = useState(0)
	const [deleteModal, setDeleteModal] = useState(true)
	const [deleteInPlaylist, setDeleteInPlaylist] = useState(false)
	const [playingPlaylist, setPlayingPlaylist] = useState(false)
	const [selectAll, SetSelectAll] = useState(false)
	const [newPlaylistModal, setNewPlaylistModal] = useState(false)
	const [addMusicModal, setAddMusicModal] = useState(false)
	const [musicInfoModal, setMusicInfoModal] = useState(false)
	const [newPlaylistName, setNewPlaylistName] = useState('새로운 플레이리스트')
	const [newPlaylistIds, setNewPlaylistIds] = useState([])
	const [addNewMusic, setAddNewMusic] = useState([{ "musicArtist": ["버스커 버스커"], "musicId": 4, "musicImage": null, "musicTitle": "벚꽃 엔딩" }, { "musicArtist": ["폴킴"], "musicId": 7, "musicImage": null, "musicTitle": "너를 만나" }])

	const playlist = ['나만의 플레이리스트', '신나는 음악', '드라이브', '드라이브 ']

	const { route } = props;
	const result = useContext(CoreContext);

	const addMusicInTempList = () => {
		let temp = []
		selectMusic.map((music, index) => {
			if (music == true) {
				temp.push(index)
			}
		})
		console.log(temp)
		let tempList = []
		let addIdList = []
		pMusicList.map((music, index) => {
			let flag = true
			console.log(temp)
			temp.map((num) => {
				console.log('d', index, num)
				if (parseInt(index) == parseInt(num)) {
					flag = false
				}
			})
			if (!flag) {
				tempList.push(music)
				addIdList.push(music.musicId)
				console.log(index)
			}
		}
		)
		setAddNewMusic(tempList)
		console.log('temp', tempList)
		console.log('add', addNewMusic)
		setSelectNumber(0)
		let copy = selectMusic;
		copy.map((flag, index) => {
			copy[index] = false
		})
		setSelectMusic(copy);
		console.log(addIdList)
	}

	const deleteMusic = () => {
		let temp = []
		selectMusic.map((music, index) => {
			if (music == true) {
				temp.push(index)
			}
		})
		console.log(temp)
		let tempList = []
		pMusicList.map((music, index) => {
			let flag = true
			console.log(temp)
			temp.map((num) => {
				console.log('d', index, num)
				if (parseInt(index) == parseInt(num)) {
					flag = false
				}
			})
			if (flag) {
				tempList.push(music)
				console.log(index)
			}
		}
		)
		setPMusicList(tempList)
		setSelectMusic([false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false]);
		setSelectNumber(0)
		setDeleteInPlaylist(!deleteInPlaylist)
	}

	useEffect(() => {

		axios
			.get(`http://ec2-3-35-154-3.ap-northeast-2.compute.amazonaws.com:8080/main/${userId}`)
			.then((response) => {
				setUserName(response.data['userName']);
				setUserImage(response.data['userImage']);
				setPMusicList(response.data["playedMusicList"]);
			}).catch(error => {
				console.log(error.config)
			})

	}, []
	)

	const changeTagState = (tag, e) => {
		setTagStateModal(!tagStateModal);
		setTagStateModalTag(tag)
	}
	const changeAutoTagState = (tag, e) => {
		setAutoTagStateModal(!autoTagStateModal);
		setTagStateModalTag(tag)
	}

	function reRendering() {
		var autoCopy = [...autoTag]
		setAutoTag([])
		setTimeout(() => { setAutoTag(autoCopy); }, renderTime)
		var fixedCopy = [...fixedTag]
		setFixedTag([])
		setTimeout(() => { setFixedTag(fixedCopy) }, renderTime)
	}


	interface addList {
		push(arg0: { tagName: string; isFixed: string; }): any;
	}


	// 사용자 태그 저장 후 전송 시 통신 코드 
	function onClickSendTag() {
		let add_list: addList = []
		fixedTag.map((tag: string, index) => (add_list.push({ "tagName": tag, "isFixed": 'FIXED' })))
		autoTag.map((tag, index) => (add_list.push({ "tagName": tag, "isFixed": 'UNFIXED' })))
		deletedTag.map((tag, index) => (add_list.push({ "tagName": tag, "isFixed": 'DELETED' })))

		axios.post("http://ec2-3-35-154-3.ap-northeast-2.compute.amazonaws.com:8080/user/tag", {
			"userId": userId,
			"userTagList": add_list
		})
		console.log('fixed : ' + fixedTag)
		console.log('auto : ' + autoTag)
		console.log('delete : ' + deletedTag)
	}

	function makePlaylist() {

		axios.post("http://ec2-3-35-154-3.ap-northeast-2.compute.amazonaws.com:8080/playlist/add", {
			"userId": 3,
			"playlistName": newPlaylistName,
			"musicIdList": [100]
		})
	}

	function delPlaylist() {

		axios.delete("http://ec2-3-35-154-3.ap-northeast-2.compute.amazonaws.com:8080/playlist/delete", {
			data: {
				"userId": 3,
				"playlistId": 25
			},
			withCredentials: true
		}
		)
	}

	function find_nm(nm: any) {

		const temp_list: string[] = []
		let flag = false;
		if (nm != "") {
			text_array.map((x) => {
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
		setStartText(temp_list)
	}

	useEffect(() => {

		axios
			.get(`http://ec2-3-35-154-3.ap-northeast-2.compute.amazonaws.com:8080/tag`)
			.then((response) => {
				setText_Array(response.data['tagList'])
				console.log('Get Tag Sucess')
			}).catch(error => {
				console.log('Get tag error')
			});

		axios
			.get(`http://ec2-3-35-154-3.ap-northeast-2.compute.amazonaws.com:8080/user/info/${userId}`)
			.then((response) => {
				setAutoTag(response.data['unfixedTagList']);
				setFixedTag(response.data['fixedTagList']);
				setUserName(response.data['userName']);
				setUserImage(response.data['userImage']);
			}).catch(error => {
				console.log(error.config)
			});

		setText_Array(["사랑", "벚꽃", "눈물", "행운", "마음", "연인"])

	}, []
	)

	const fadeAnim = useRef(new Animated.Value(0)).current
	useEffect(() => {
		Animated.timing(
			fadeAnim,
			{
				toValue: 1,
				useNativeDriver: true,
				duration: 500,
			}
		).start();
	}, [fadeAnim, fixedTag, autoTag])


	return (
		<CoreConsumer>
			{({ value, image,name, SetValue, SetName }) => (
				<View>
					{/* 음악 정보 모달창 */}
					<Modal
						animationType='none'
						transparent={true}
						visible={musicInfoModal}
						onRequestClose={() => {
							setMusicInfoModal(!musicInfoModal);
						}}>
						<View style={{ height: '100%', width: '100%', backgroundColor: 'rgba(50,50,50,0.3)', justifyContent: 'flex-end', alignItems: 'center' }}>
							<View style={{ width: '100%', height: 200, position: 'absolute', backgroundColor: 'white', borderRadius: 15 }}>
								<View style={{ paddingRight: 10, marginTop: 30, flex: 1 }}>
									<View style={{ width: '100%', justifyContent: 'center', alignItems: 'center' }}><Text style={{ fontSize: 20, fontWeight: 'bold' }}>벚꽃 엔딩</Text></View>
								</View>
								<View style={{ alignItems: 'center', flex: 5, justifyContent: 'center' }}>
									<Text style={{ fontSize: 17, marginVertical: 3 }}>곡 정보</Text>
									<Text style={{ fontSize: 17, marginVertical: 3 }}>삭제 하시겠습니까?</Text>
								</View>
								<View style={{ flexDirection: 'row', width: '100%', flex: 3, justifyContent: 'center', alignItems: 'center', borderTopWidth: 1, borderColor: '#d8d8d8' }}>
									<TouchableOpacity onPress={() => { setMusicInfoModal(false) }} style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}><Text style={{ fontSize: 17 }}>닫기</Text></TouchableOpacity>
								</View>
							</View>
						</View>
					</Modal>
					{/* 곡 추가 검색창 */}
					<Modal
						animationType='none'
						transparent={true}
						visible={addMusicModal}
						onRequestClose={() => {
							setAddMusicModal(!addMusicModal);
						}}>
						<View style={{ backgroundColor: 'white', width: '100%', height: '100%', padding: 30 }}>
							<View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
								<TouchableOpacity onPress={() => { setAddMusicModal(false) }} style={{ flex: 1 }}><Text style={{ fontSize: 17 }}>취소</Text></TouchableOpacity>
								<View style={{ flex: 7, alignItems: 'center' }}><Text style={{ fontSize: 20, fontWeight: 'bold' }}>곡 추가</Text></View>
								<TouchableOpacity onPress={() => { setAddMusicModal(false); addMusicInTempList() }} style={{ flex: 1 }}><Text style={{ fontSize: 17 }}>완료</Text></TouchableOpacity>
							</View>
							<TextInput placeholder='검색' style={{ fontSize: 20, borderBottomWidth: 2, padding: 5, marginVertical: 15 }}></TextInput>
							<View style={{ flexDirection: 'row', marginVertical: 15, alignItems: 'flex-start' }}>
								<Pressable style={{ flex: 1, alignItems: 'flex-start' }}><Text style={{ fontSize: 17 }}>최근 들은</Text></Pressable>
							</View>
							<ScrollView style={{}}>
								{pMusicList.map((music, index) => {
									return (
										<View key={index} style={{ height: 90, marginVertical: 1 }}>
											<Pressable style={{ width: 375, height: 80, padding: 4, marginVertical: 5, marginRight: 30, backgroundColor: colorList[index % 7], alignItems: 'center', flexDirection: 'row', borderRadius: 15 }} onPress={() => {
												let copy = selectMusic; copy[index] = !selectMusic[index]; setSelectMusic(copy);
												setSelectNumber(selectMusic.filter(x => x != false).length);
												setDeleteModal(false);
											}} >
												<Image source={{ uri: `https://music-auto-tag.s3.ap-northeast-2.amazonaws.com/music_images/music_default.png` }}
													style={{ height: 70, width: 70, marginRight: 0, opacity: 0.3 }} borderRadius={12} />
												<Image source={{ uri: `https://music-auto-tag.s3.ap-northeast-2.amazonaws.com/music_images/music_id_${music.musicId}.jpg` }}
													style={{ height: 70, width: 70, borderColor: 'white', marginLeft: 4, borderWidth: 1, borderRadius: 12, position: 'absolute' }} />
												<View style={{ width: 230 }}>
													<Text style={{ color: '#454545', marginLeft: 10, fontSize: 17, fontWeight: 'bold' }} numberOfLines={1} ellipsizeMode="tail">{music.musicTitle}</Text>
													<Text style={{ color: '#454545', marginLeft: 10, marginTop: 2, fontSize: 15 }} numberOfLines={1} ellipsizeMode="tail">{music.musicArtist}</Text>
												</View>
												<View style={{ marginRight: 5, flex: 1, marginLeft: 5 }}><Icon name="plus" color='#626262' size={40} /></View>
												<View style={{ width: '102%', height: 90, position: 'absolute' }}>
													{!selectMusic[index] ?
														<View style={{ position: 'absolute', width: '100%', height: '100%' }
														} /> :
														<View style={{ backgroundColor: 'rgba(50,50,50,0.25)', position: 'absolute', width: '100%', height: '100%', borderRadius: 12 }
														} />
													}
												</View>
											</Pressable>
										</View>
									)
								})}
							</ScrollView>
						</View>
					</Modal>
					{/* 새로운 플레이리스트 만들기 */}
					<Modal
						animationType='none'
						transparent={true}
						visible={newPlaylistModal}
						onRequestClose={() => {
							setNewPlaylistModal(!newPlaylistModal);
						}}
					>
						<View style={{ backgroundColor: 'white', width: '100%', height: '100%', padding: 30 }}>
							<View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
								<TouchableOpacity onPress={() => { setNewPlaylistModal(false) }}><Icon name='chevron-left' size={35} style={{ flex: 1 }} /></TouchableOpacity>
								<View style={{ flex: 8, justifyContent: 'center', alignItems: 'center' }}><Text style={{ fontSize: 20, fontWeight: 'bold' }}>플레이리스트 만들기</Text></View>
								<TouchableOpacity onPress={() => { setNewPlaylistModal(false); delPlaylist() }} style={{ flex: 1 }}><Text style={{ color: 'green', fontSize: 17 }} >완료</Text></TouchableOpacity>
							</View>
							<View style={{ marginVertical: 15 }}>
								<TextInput onChangeText={(nm) => { setNewPlaylistName(nm); }}
									placeholder='플레이리스트 제목' style={{ borderBottomColor: '#d8d8d8', borderBottomWidth: 1, fontSize: 20 }}></TextInput>
							</View>
							<TouchableOpacity onPress={() => { setAddMusicModal(true) }} style={{ marginTop: 15, flexDirection: 'row', alignItems: 'center' }}>
								<Icon name='plus-circle-outline' size={20}></Icon>
								<Text style={{ fontSize: 17 }}>   새로운 곡 추가하기</Text>
							</TouchableOpacity>
							{!selectAll ?
								<TouchableOpacity onPress={() => {
									let copy = selectMusic;
									copy.map((flag, index) => {
										copy[index] = true
									})
									setSelectMusic(copy);
									setSelectNumber(pMusicList.length);
									setDeleteModal(false);
									SetSelectAll(true)
								}} style={{ marginVertical: 15, flexDirection: 'row', alignItems: 'center' }}>
									<Icon name='check' size={20} color={'black'}></Icon>
									<Text style={{ fontSize: 17, color: 'black' }}> 전체 선택</Text>
								</TouchableOpacity>
								:
								<TouchableOpacity onPress={() => {
									let copy = selectMusic;
									copy.map((flag, index) => {
										copy[index] = false
									})
									setSelectMusic(copy);
									setSelectNumber(0);
									setDeleteModal(true);
									SetSelectAll(false)
								}} style={{ marginVertical: 15, flexDirection: 'row', alignItems: 'center' }}>
									<Icon name='check' size={20} color={'green'}></Icon>
									<Text style={{ fontSize: 17, color: 'green' }}> 선택 해제</Text>
								</TouchableOpacity>
							}
							<ScrollView style={{}}>
								{addNewMusic.map((music, index) => {
									return (
										<View key={index} style={{ height: 90, marginVertical: 1 }}>
											<Pressable style={{ width: 375, height: 80, padding: 4, marginVertical: 5, marginRight: 30, backgroundColor: colorList[index % 7], alignItems: 'center', flexDirection: 'row', borderRadius: 15 }} onPress={() => {
												let copy = selectMusic; copy[index] = !selectMusic[index]; setSelectMusic(copy);
												setSelectNumber(selectMusic.filter(x => x != false).length);
												setDeleteModal(false);
											}} >
												<Image source={{ uri: `https://music-auto-tag.s3.ap-northeast-2.amazonaws.com/music_images/music_default.png` }}
													style={{ height: 70, width: 70, marginRight: 0, opacity: 0.3 }} borderRadius={12} />
												<Image source={{ uri: `https://music-auto-tag.s3.ap-northeast-2.amazonaws.com/music_images/music_id_${music.musicId}.jpg` }}
													style={{ height: 70, width: 70, borderColor: 'white', marginLeft: 4, borderWidth: 1, borderRadius: 12, position: 'absolute' }} />
												<View style={{ width: 230 }}>
													<Text style={{ color: '#454545', marginLeft: 10, fontSize: 17, fontWeight: 'bold' }} numberOfLines={1} ellipsizeMode="tail">{music.musicTitle}</Text>
													<Text style={{ color: '#454545', marginLeft: 10, marginTop: 2, fontSize: 15 }} numberOfLines={1} ellipsizeMode="tail">{music.musicArtist}</Text>
												</View>
												<View style={{ marginRight: 5, flex: 1, marginLeft: 5 }}><Icon name="plus" color='#626262' size={40} /></View>
												<View style={{ width: '102%', height: 90, position: 'absolute' }}>
													{!selectMusic[index] ?
														<View style={{ position: 'absolute', width: '100%', height: '100%' }
														} /> :
														<View style={{ backgroundColor: 'rgba(50,50,50,0.25)', position: 'absolute', width: '100%', height: '100%', borderRadius: 12 }
														} />
													}
												</View>
											</Pressable>
										</View>
									)
								})}
							</ScrollView>
						</View>
					</Modal>
					{/* 플레이리스트 안의 음악 */}
					<Modal
						animationType='none'
						transparent={true}
						visible={playingPlaylist}
						onRequestClose={() => {
							setPlayingPlaylist(!playingPlaylist);
							setDeleteModal(true)
						}}
					>
						<View style={{ flex: 9 }}>
							<ScrollView style={{ backgroundColor: 'white', width: '100%', padding: 30 }}>
								<View style={{ flexDirection: 'row', alignItems: 'center' }}>
									<Text style={{ fontSize: 25, fontWeight: 'bold' }}>플레이리스트</Text>
									<View style={{ width: '100%', alignItems: 'flex-end', position: 'absolute', padding: 15 }}>
										<TouchableOpacity onPress={() => { setPlaylistSetting(!playlistSetting) }}>
											<Icon name='chevron-left' size={0} />
										</TouchableOpacity>
									</View>
								</View>
								{!selectAll ?
									<TouchableOpacity onPress={() => {
										let copy = selectMusic;
										copy.map((flag, index) => {
											copy[index] = true
										})
										setSelectMusic(copy);
										setSelectNumber(pMusicList.length);
										setDeleteModal(false);
										SetSelectAll(true)
									}} style={{ marginVertical: 15, flexDirection: 'row', alignItems: 'center' }}>
										<Icon name='check' size={20} color={'black'}></Icon>
										<Text style={{ fontSize: 17, color: 'black' }}> 전체 선택</Text>
									</TouchableOpacity>
									:
									<TouchableOpacity onPress={() => {
										let copy = selectMusic;
										copy.map((flag, index) => {
											copy[index] = false
										})
										setSelectMusic(copy);
										setSelectNumber(0);
										setDeleteModal(true);
										SetSelectAll(false)
									}} style={{ marginVertical: 15, flexDirection: 'row', alignItems: 'center' }}>
										<Icon name='check' size={20} color={'green'}></Icon>
										<Text style={{ fontSize: 17, color: 'green' }}> 선택 해제</Text>
									</TouchableOpacity>
								}
								<View style={{}}>
									{pMusicList.map((music, index) => {
										return (
											<View key={index} style={{ height: 90, marginVertical: 1 }}>
												<Pressable onLongPress={() => { setMusicInfoModal(true) }} style={{ width: 375, height: 80, padding: 4, marginVertical: 5, marginRight: 30, backgroundColor: colorList[index % 7], alignItems: 'center', flexDirection: 'row', borderRadius: 15 }} onPress={() => {
													let copy = selectMusic; copy[index] = !selectMusic[index]; setSelectMusic(copy);
													setSelectNumber(selectMusic.filter(x => x != false).length);
													setDeleteModal(false);
												}} >
													<Image source={{ uri: `https://music-auto-tag.s3.ap-northeast-2.amazonaws.com/music_images/music_default.png` }}
														style={{ height: 70, width: 70, marginRight: 0, opacity: 0.3 }} borderRadius={12} />
													<Image source={{ uri: `https://music-auto-tag.s3.ap-northeast-2.amazonaws.com/music_images/music_id_${music.musicId}.jpg` }}
														style={{ height: 70, width: 70, borderColor: 'white', marginLeft: 4, borderWidth: 1, borderRadius: 12, position: 'absolute' }} />
													<View style={{ width: 230 }}>
														<Text style={{ color: '#454545', marginLeft: 10, fontSize: 17, fontWeight: 'bold' }} numberOfLines={1} ellipsizeMode="tail">{music.musicTitle}</Text>
														<Text style={{ color: '#454545', marginLeft: 10, marginTop: 2, fontSize: 15 }} numberOfLines={1} ellipsizeMode="tail">{music.musicArtist}</Text>
													</View>
													<View style={{ marginRight: 5, flex: 1, marginLeft: 5 }}><Icon name="play" color='#626262' size={40} /></View>
													<View style={{ width: '102%', height: 90, position: 'absolute' }}>
														{!selectMusic[index] ?
															<View style={{ position: 'absolute', width: '100%', height: '100%' }
															} /> :
															<View style={{ backgroundColor: 'rgba(50,50,50,0.25)', position: 'absolute', width: '100%', height: '100%', borderRadius: 12 }
															} />
														}
													</View>
												</Pressable>
											</View>
										)
									})}
								</View>
							</ScrollView>
						</View>
						{deleteModal ? <View style={{ backgroundColor: 'white' }}></View> :
							<View style={{ flex: 1, borderColor: 'gray', borderWidth: 1, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center' }}>
								<View style={{ width: '100%', height: '100%', position: 'absolute' }}>
									<View style={{ margin: 10, width: 20, height: 20, backgroundColor: colorList[selectNumber % 7], position: 'absolute', borderRadius: 100, alignItems: 'center', justifyContent: 'center' }}>
										<Text style={{ color: 'white', fontWeight: 'bold' }}>{selectNumber}</Text>
									</View>
								</View>
								<View style={{ flexDirection: 'row', alignItems: 'center' }}>
									<TouchableOpacity style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
										<Icon name='play' size={30} color={'gray'} />
										<Text>재생</Text>
									</TouchableOpacity>
									<TouchableOpacity style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
										<Icon name='plus' size={30} color={'gray'} />
										<Text>담기</Text>
									</TouchableOpacity>
									<TouchableOpacity style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
										<Icon name='trash-can' size={27} color={'gray'} />
										<Text>삭제</Text>
									</TouchableOpacity>
								</View>
							</View>
						}
					</Modal>
					{/* 삭제 안내 모달 */}
					<Modal
						animationType='none'
						transparent={true}
						visible={deleteInPlaylist}
						onRequestClose={() => {
							setDeleteInPlaylist(!deleteInPlaylist);
						}}
					>
						<View style={{ height: '100%', width: '100%', backgroundColor: 'rgba(50,50,50,0.3)', justifyContent: 'center', alignItems: 'center' }}>
							<View style={{ width: 300, height: 200, position: 'absolute', backgroundColor: 'white', borderRadius: 15 }}>
								<View style={{ paddingRight: 10, marginTop: 30, flex: 1 }}>
									<View style={{ width: '100%', justifyContent: 'center', alignItems: 'center' }}><Text style={{ fontSize: 20, fontWeight: 'bold' }}>안내</Text></View>
								</View>
								<View style={{ alignItems: 'center', flex: 5, justifyContent: 'center' }}>
									<Text style={{ fontSize: 17, marginVertical: 3 }}>{selectNumber}곡을 플레이리스트에서</Text>
									<Text style={{ fontSize: 17, marginVertical: 3 }}>삭제 하시겠습니까?</Text>
								</View>
								<View style={{ flexDirection: 'row', width: '100%', flex: 3, justifyContent: 'center', alignItems: 'center', borderTopWidth: 1, borderColor: '#d8d8d8' }}>
									<TouchableOpacity onPress={() => { setDeleteInPlaylist(false) }} style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}><Text style={{ fontSize: 17 }}>취소</Text></TouchableOpacity>
									<TouchableOpacity onPress={() => { deleteMusic() }} style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}><Text style={{ fontSize: 17, color: 'green' }}>확인</Text></TouchableOpacity>
								</View>
							</View>
						</View>
					</Modal>
					{/* 플레이리스트 안의 편집 추가 삭제 */}
					<Modal
						animationType='none'
						transparent={true}
						visible={playlistSetting}
						onRequestClose={() => {
							setPlaylistSetting(!playlistSetting);
							setDeleteModal(true)
							let copy = selectMusic;
							copy.map((flag, index) => {
								copy[index] = false
							})
							setSelectMusic(copy);
							setSelectNumber(pMusicList.length);
							SetSelectAll(false)
						}}
					>
						<View style={{ flex: 9 }}>
							<ScrollView style={{ backgroundColor: 'white', width: '100%', padding: 30 }}>
								<View style={{ flexDirection: 'row', alignItems: 'center' }}>
									<Text style={{ fontSize: 25, fontWeight: 'bold' }}>플레이스트</Text>
									<View style={{ width: '100%', alignItems: 'flex-end', position: 'absolute', padding: 15 }}>
										<TouchableOpacity onPress={() => { setPlaylistSetting(!playlistSetting) }}>
											<Icon name='chevron-left' size={25} />
										</TouchableOpacity>
									</View>
								</View>
								<TouchableOpacity onPress={() => { setAddMusicModal(true) }} style={{ marginTop: 15, flexDirection: 'row', alignItems: 'center' }}>
									<Icon name='plus-circle-outline' size={20}></Icon>
									<Text style={{ fontSize: 17 }}>   새로운 곡 추가하기</Text>
								</TouchableOpacity>
								{!selectAll ?
									<TouchableOpacity onPress={() => {
										let copy = selectMusic;
										copy.map((flag, index) => {
											copy[index] = true
										})
										setSelectMusic(copy);
										setSelectNumber(pMusicList.length);
										setDeleteModal(false);
										SetSelectAll(true)
									}} style={{ marginVertical: 15, flexDirection: 'row', alignItems: 'center' }}>
										<Icon name='check' size={20} color={'black'}></Icon>
										<Text style={{ fontSize: 17, color: 'black' }}> 전체 선택</Text>
									</TouchableOpacity>
									:
									<TouchableOpacity onPress={() => {
										let copy = selectMusic;
										copy.map((flag, index) => {
											copy[index] = false
										})
										setSelectMusic(copy);
										setSelectNumber(0);
										setDeleteModal(true);
										SetSelectAll(false)
									}} style={{ marginVertical: 15, flexDirection: 'row', alignItems: 'center' }}>
										<Icon name='check' size={20} color={'green'}></Icon>
										<Text style={{ fontSize: 17, color: 'green' }}> 선택 해제</Text>
									</TouchableOpacity>
								}
								<View style={{}}>
									{pMusicList.map((music, index) => {
										return (
											<View key={index} style={{ height: 90, marginVertical: 1 }}>
												<Pressable style={{ width: 375, height: 80, padding: 4, marginVertical: 5, marginRight: 30, backgroundColor: colorList[index % 7], alignItems: 'center', flexDirection: 'row', borderRadius: 15 }} onPress={() => {
													let copy = selectMusic; copy[index] = !selectMusic[index]; setSelectMusic(copy);
													setSelectNumber(selectMusic.filter(x => x != false).length);
													setDeleteModal(false);
												}} >
													<Image source={{ uri: `https://music-auto-tag.s3.ap-northeast-2.amazonaws.com/music_images/music_default.png` }}
														style={{ height: 70, width: 70, marginRight: 0, opacity: 0.3 }} borderRadius={12} />
													<Image source={{ uri: `https://music-auto-tag.s3.ap-northeast-2.amazonaws.com/music_images/music_id_${music.musicId}.jpg` }}
														style={{ height: 70, width: 70, borderColor: 'white', marginLeft: 4, borderWidth: 1, borderRadius: 12, position: 'absolute' }} />
													<View style={{ width: 230 }}>
														<Text style={{ color: '#454545', marginLeft: 10, fontSize: 17, fontWeight: 'bold' }} numberOfLines={1} ellipsizeMode="tail">{music.musicTitle}</Text>
														<Text style={{ color: '#454545', marginLeft: 10, marginTop: 2, fontSize: 15 }} numberOfLines={1} ellipsizeMode="tail">{music.musicArtist}</Text>
													</View>
													<View style={{ marginRight: 5, flex: 1, marginLeft: 5 }}><Icon name="dots-vertical" color='#626262' size={40} /></View>
													<View style={{ width: '102%', height: 90, position: 'absolute' }}>
														{!selectMusic[index] ?
															<View style={{ position: 'absolute', width: '100%', height: '100%' }
															} /> :
															<View style={{ backgroundColor: 'rgba(50,50,50,0.25)', position: 'absolute', width: '100%', height: '100%', borderRadius: 12 }
															} />
														}
													</View>
												</Pressable>
											</View>
										)
									})}
								</View>
							</ScrollView>
						</View>
						{deleteModal ? <View></View> :
							<TouchableOpacity onPress={() => { setDeleteInPlaylist(true); SetSelectAll(false) }} style={{ flex: 1, borderColor: 'gray', borderWidth: 1, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center' }}>
								<View style={{ flexDirection: 'row', alignItems: 'center' }}>
									<View style={{ backgroundColor: colorList[selectNumber % 7], alignItems: 'center', justifyContent: 'center', width: 25, aspectRatio: 1, borderWidth: 2, borderRadius: 100, borderColor: colorList[selectNumber] }}><Text style={{ color: 'white', fontSize: 17, fontWeight: 'bold' }}>{selectNumber}</Text></View>
									<Text style={{ fontSize: 17 }}>  삭제    </Text>
								</View>
							</TouchableOpacity>
						}
					</Modal>
					{/* 플레이리스트 편집 */}
					<Modal
						animationType='none'
						transparent={true}
						visible={showPlaylist}
						onRequestClose={() => {
							setShowPlaylist(!showPlaylist);
						}}
					>
						<ScrollView style={{ height: '100%', width: '100%', backgroundColor: 'white', padding: 30 }}>
							<View style={{ flexDirection: 'row', alignItems: 'center' }}>
								<Text style={{ fontSize: 25, fontWeight: 'bold' }}>플레이스트 편집</Text>
								<TouchableOpacity style={{ marginLeft: '42%' }}>
									<Text style={{ fontSize: 17, color: 'white' }}>편집</Text>
								</TouchableOpacity>
							</View>
							<TouchableOpacity onPress={() => { setNewPlaylistModal(true!) }} style={{ marginVertical: 15, flexDirection: 'row', alignItems: 'center' }}>
								<Icon name='plus-circle-outline' size={20}></Icon>
								<Text style={{ fontSize: 17 }}>   새로운 플레이리스트 추가하기</Text>
							</TouchableOpacity>
							<View style={{ alignItems: 'center', justifyContent: 'center' }}>
								{playlist.map((list, index) => (
									<TouchableOpacity onPress={() => { setPlaylistSetting(!playlistSetting) }}
										style={{ padding: 9, flexDirection: 'row', height: 125, backgroundColor: colorList[index % 7], borderRadius: 12, width: '100%', marginVertical: 10, }} key={list}>
										<View>
											<Image source={require('../images/playlisticon.jpg')} style={{ height: '100%', aspectRatio: 1, borderRadius: 20 }} />
										</View>
										<View style={{ padding: 10, width: '100%' }}>
											<View style={{ marginLeft: 5 }}>
												<Text style={{ fontSize: 20, color: '#454545', fontWeight: 'bold' }}>{list}</Text>
												<Text style={{ fontSize: 15, color: '#454545', fontWeight: 'bold' }}>2022. 08. 17</Text>
											</View>
											<View style={{ alignItems: 'flex-end', width: '70%' }}><Icon name="dots-vertical" color='#626262' size={40} /></View>
										</View>
									</TouchableOpacity>
								))}
							</View>
						</ScrollView>
					</Modal>

					{/* 태그 설정 화면 fixed */}
					<Modal
						animationType='none'
						transparent={true}
						visible={tagStateModal}
						onRequestClose={() => {
							setTagStateModal(!tagStateModal);
						}}
					>
						<View style={{ height: '100%', width: '100%', backgroundColor: 'rgba(50,50,50,0.3)', justifyContent: 'center', alignItems: 'center' }}>
							<View style={{ width: 300, height: 200, position: 'absolute', backgroundColor: 'white', borderRadius: 15 }}>
								<View style={{ paddingRight: 10, marginTop: 30 }}>
									<View style={{ width: '100%', justifyContent: 'center', alignItems: 'center' }}><Text style={{ fontSize: 20, fontWeight: 'bold' }}>{tagStateModalTag}</Text></View>
									<View style={{ position: 'absolute', width: '100%', justifyContent: 'flex-end', alignItems: 'flex-end' }}>
										<Icon name="close" color={colorList[0]} size={30} onPress={() => { setTagStateModal(!tagStateModal) }}></Icon>
									</View>
								</View>
								<View style={{ width: '100%', marginVertical: 15 }}>
									<TouchableOpacity onPress={() => {
										var fixedCopy = fixedTag.filter(x => x != tagStateModalTag)
										setTimeout(() => { setFixedTag(fixedCopy) }, renderTime)
										setAutoTag([...autoTag, tagStateModalTag])
										setTagStateModal(!tagStateModal)
									}} style={{ width: '100%', justifyContent: 'center', alignItems: 'center', marginVertical: 15 }}><Text style={{ fontSize: 20 }}>고정 해제</Text>
									</TouchableOpacity>
									<TouchableOpacity onPress={() => {
										var fixedCopy = fixedTag.filter(x => x != tagStateModalTag)
										setTimeout(() => { setFixedTag(fixedCopy) }, renderTime)
										setDeletedTag([...deletedTag, tagStateModalTag])
										setTagStateModal(!tagStateModal)
									}} style={{ width: '100%', justifyContent: 'center', alignItems: 'center' }}>
										<Text style={{ fontSize: 20 }}>한 동안 보지 않기</Text></TouchableOpacity>
								</View>
							</View>
						</View>
					</Modal>
					{/* 태그 설정 화면 auto */}
					<Modal
						animationType='none'
						transparent={true}
						visible={autoTagStateModal}
						onRequestClose={() => {
							setAutoTagStateModal(!autoTagStateModal);
						}}
					>
						<View style={{ height: '100%', width: '100%', backgroundColor: 'rgba(50,50,50,0.3)', justifyContent: 'center', alignItems: 'center' }}>
							<View style={{ width: 300, height: 200, position: 'absolute', backgroundColor: 'white', borderRadius: 15 }}>
								<View style={{ paddingRight: 10, marginTop: 30 }}>
									<View style={{ width: '100%', justifyContent: 'center', alignItems: 'center' }}><Text style={{ fontSize: 20, fontWeight: 'bold' }}>{tagStateModalTag}</Text></View>
									<View style={{ position: 'absolute', width: '100%', justifyContent: 'flex-end', alignItems: 'flex-end' }}>
										<Icon name="close" color={colorList[0]} size={30} onPress={() => { setAutoTagStateModal(!autoTagStateModal) }}></Icon>
									</View>
								</View>
								<View style={{ width: '100%', marginVertical: 15 }}>
									<TouchableOpacity onPress={() => {
										var autoCopy = autoTag.filter(x => x != tagStateModalTag)
										setTimeout(() => { setAutoTag(autoCopy) }, renderTime)
										setFixedTag([...fixedTag, tagStateModalTag])
										setAutoTagStateModal(!autoTagStateModal)
									}} style={{ width: '100%', justifyContent: 'center', alignItems: 'center', marginVertical: 15 }}><Text style={{ fontSize: 20 }}>나의 태그로 이동</Text>
									</TouchableOpacity>
									<TouchableOpacity onPress={() => {
										var autoCopy = autoTag.filter(x => x != tagStateModalTag)
										setTimeout(() => { setAutoTag(autoCopy) }, renderTime)
										setDeletedTag([...deletedTag, tagStateModalTag])
										setAutoTagStateModal(!autoTagStateModal)
									}} style={{ width: '100%', justifyContent: 'center', alignItems: 'center' }}>
										<Text style={{ fontSize: 20 }}>한 동안 보지 않기</Text></TouchableOpacity>
								</View>
							</View>
						</View>
					</Modal>
					<View style={[rStyles.centeredView]}>
						{/* 유저 페이지 */}
						<ScrollView>

							<View style={{}}>
								<View style={{ flexDirection: 'row', paddingLeft: 30, paddingTop: 40, height: 100 }}>
									<View style={{ width: 320, height: 40 }}>
										<Text style={{ fontSize: 17 }}>안녕하세요,</Text>
										<Text style={{ fontSize: 25, fontWeight: 'bold' }}>{name}님</Text>
									</View>
									<TouchableOpacity onPress={() => {
										auth().signOut();
										GoogleSignin.revokeAccess();
									}}>
										<View style={{ flexDirection: 'row' }}>
											<ImageBackground source={{ uri: `https://music-auto-tag.s3.ap-northeast-2.amazonaws.com/user_images/userimage_sample.png` }}
												style={{ width: 60, height: 60, marginRight: 20 }} borderRadius={20} imageStyle={{ opacity: 1 }}>
												<Image source={{ uri: image }}
													style={{ width: 60, height: 60 }} borderRadius={20} />
											</ImageBackground>
										</View>
									</TouchableOpacity>
								</View>
								<View>
									<View style={{ flexDirection: 'row', marginTop: 15, marginLeft: 30, alignItems: 'center' }}>
										<Text style={{ fontSize: 17, color: 'black', width: 295 }}>태그를 추가해 보세요.</Text>
										<TouchableOpacity onPress={() => {
											setTagSearchOn(!tagSearchOn)
											onClickSendTag();
											SetValue([...fixedTag, ...autoTag])
										}} style={{ width: 85, height: 35, backgroundColor: colorList[1], borderRadius: 8, justifyContent: 'center', alignItems: 'center' }}><Text style={{ fontSize: 18 }}>{tagSearchOn ? '수정' : '저장'}</Text></TouchableOpacity>
									</View>

									{tagSearchOn ? <View style={{ height: 10 }}></View> : <View>
										<TouchableOpacity style={{ alignItems: 'center', marginTop: 20, }}>
											<View style={{ justifyContent: 'center', width: 370, backgroundColor: colorList[1], height: 50, borderRadius: 10, paddingLeft: 20 }}>
												<TextInput onChangeText={(nm) => {
													find_nm(nm);
													setInputText(nm)
												}} style={{ padding: 0, fontSize: 17 }} placeholder="태그 검색" placeholderTextColor='#A1A1A1'></TextInput>
											</View>
										</TouchableOpacity>
										<View style={inputText == '' ? { marginTop: 10, height: 0 } : { marginTop: 10, height: 30 }}>
											{Array.from(Array(1).keys()).map((n, index) =>
												<ScrollView horizontal={true} key={n} style={{ flexDirection: 'row', paddingHorizontal: 20 }}>
													{startText.map((tag) => (
														<TouchableOpacity key={tag} style={{ marginHorizontal: 5, padding: 0.5 }} onPress={() => { setFixedTag([...fixedTag, tag]) }}>
															<Text style={{ fontSize: 17 }}>{'#' + tag}</Text>
														</TouchableOpacity>
													))}
												</ScrollView>
											)}
										</View>
									</View>}

								</View>




								<View style={{ justifyContent: 'center', alignItems: 'center' }}>
									<View style={{ width: '100%' }}>
										<View style={{ marginLeft: 30, marginVertical: 15 }}>
											<Text style={{ fontSize: 17 }}>나의 태그</Text>
										</View>
									</View>
									<View style={{ borderRadius: 10, width: 370, paddingVertical: 11, paddingHorizontal: 20, backgroundColor: colorList[2] }}>
										{fixedTag.length && fixedTag.length > 0 ?
											(
												Array.from(Array(Math.ceil(fixedTag.length / 5)).keys()).map((n, index) =>
													<View key={index} style={{ flexDirection: 'row' }}>
														{fixedTag.slice(n * 5, (n + 1) * 5).map((tag, index) => (
															<TouchableOpacity key={tag} style={{ marginHorizontal: 5, marginVertical: 5 }} onPress={(e) => { changeTagState(tag, e) }}>
																<Text style={{ fontSize: 17 }}>{'#' + tag}</Text>
															</TouchableOpacity>
														))}
													</View>
												)
											)
											: <Text style={{ fontSize: 17, fontStyle: 'italic', marginVertical: 5 }}>추천 태그</Text>
										}
									</View>
									<View style={{ width: '100%' }}>
										<View style={{ marginLeft: 30, marginVertical: 15 }}>
											<Text style={{ fontSize: 17 }}>추천 태그</Text>
										</View>
									</View>
									<View style={{ borderRadius: 10, width: 370, paddingVertical: 11, paddingHorizontal: 20, backgroundColor: colorList[3] }}>
										{autoTag.length && autoTag.length > 0 ?
											(
												Array.from(Array(Math.ceil(autoTag.length / 5)).keys()).map((n, index) =>
													<View key={index} style={{ flexDirection: 'row' }}>
														{autoTag.slice(n * 5, (n + 1) * 5).map((tag, index) => (
															<TouchableOpacity key={tag} style={{ marginHorizontal: 5, marginVertical: 5 }} onPress={(e) => { changeAutoTagState(tag, e) }}>
																<Text style={{ fontSize: 17 }}>{'#' + tag}</Text>
															</TouchableOpacity>
														))}
													</View>
												)
											)
											: <Text style={{ fontSize: 17, fontStyle: 'italic', marginVertical: 5 }}>추천 태그</Text>
										}
									</View>
								</View>
										
								<View style={{ flex: 3 }}>
									<View style={{ flexDirection: 'row', paddingTop: 40, paddingLeft: 30 }}>
										<View>
											<Text style={{ fontSize: 25, color: 'black', fontWeight: 'bold' }}>플레이리스트</Text>
										</View>
										<View style={{ marginTop: 40, height: 30, width: '100%', position: 'absolute', justifyContent: 'center', alignItems: 'flex-end' }}>
											<TouchableOpacity onPress={() => { setShowPlaylist(!showPlaylist) }}>
												<Text style={{ fontSize: 17, color: '#454545' }}>편집</Text>
											</TouchableOpacity>
										</View>
									</View>
									<View style={{ alignItems: 'center', justifyContent: 'center' }}>
										{playlist.map((list, index) => (
											<TouchableOpacity onPress={() => { setPlayingPlaylist(true) }} style={{ padding: 9, flexDirection: 'row', height: 125, backgroundColor: colorList[(index + 4) % 7], borderRadius: 12, width: '88%', marginVertical: 10, }} key={list}>
												<View>
													<Image source={require('../images/playlisticon.jpg')} style={{ height: '100%', aspectRatio: 1, borderRadius: 20 }} />
												</View>
												<View style={{ padding: 10, width: '100%' }}>
													<View style={{ marginLeft: 5 }}>
														<Text style={{ fontSize: 20, color: '#454545', fontWeight: 'bold' }}>{list}</Text>
														<Text style={{ fontSize: 15, color: '#454545', fontWeight: 'bold' }}>2022. 08. 17</Text>
													</View>
													<View style={{ alignItems: 'flex-end', width: '70%' }}><Icon name="play" color='#626262' size={0} /></View>
												</View>
											</TouchableOpacity>
										))}
									</View>
								</View>
							</View>
						</ScrollView>
					</View>
				</View >
			)}
		</CoreConsumer >
	);
};

export default ColorDragDrop;
