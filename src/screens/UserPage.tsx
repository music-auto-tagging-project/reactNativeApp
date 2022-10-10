import {
	StyleSheet,
	View,
	Text,
	ViewStyle,
	TouchableOpacity,
	Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {
	DraxProvider,
	DraxView,
	DraxViewDragStatus,
	DraxSnapbackTargetPreset,
	DraxScrollView
} from 'react-native-drax';

import * as React from 'react';
import { useState, useEffect, useRef, Component, useContext, useCallback } from 'react';
import { TextInput, Image, ScrollView, Modal, Animated, ImageBackground, Pressable } from 'react-native';
import rStyles from '../styles/styles'
import axios from 'axios';
import * as Hangul from 'hangul-js';
import { CoreContext, CoreConsumer } from '../context/CoreManagement';
import tag_data from '../etc/tag'
import { add, color } from 'react-native-reanimated';
import style from '../styles/styles';
import { TouchableHighlight } from 'react-native-gesture-handler';
// import Animated from 'react-native-reanimated';

interface ColorBlockProps {
	name: string;
	boxId: string;
}

const colorList = ['#F1BFBF', '#F1D4BF', '#F1E6BF', '#CCF1BF', '#BFF1DF', '#BFD0F1', '#D6A7D7', '#F1BFBF', '#F1D4BF', '#F1E6BF', '#CCF1BF', '#BFF1DF', '#BFD0F1', '#D6A7D7', '#F1BFBF', '#F1D4BF', '#F1E6BF', '#CCF1BF', '#BFF1DF', '#BFD0F1', '#D6A7D7', '#F1BFBF', '#F1D4BF', '#F1E6BF', '#CCF1BF', '#BFF1DF', '#BFD0F1', '#D6A7D7', '#F1BFBF', '#F1D4BF', '#F1E6BF', '#CCF1BF', '#BFF1DF', '#BFD0F1', '#D6A7D7', '#F1BFBF', '#F1D4BF', '#F1E6BF', '#CCF1BF', '#BFF1DF', '#BFD0F1', '#D6A7D7', '#F1BFBF', '#F1D4BF', '#F1E6BF', '#CCF1BF', '#BFF1DF', '#BFD0F1', '#D6A7D7']
const ColorBlock = ({ name, boxId }: ColorBlockProps) => (
	<DraxView
		style={[
			styles.centeredContent,
			styles.colorBlock,
			{ backgroundColor: 'rgba(0,0,0,0)' },
		]}
		draggingStyle={styles.dragging}
		dragReleasedStyle={styles.dragging}
		hoverDraggingStyle={styles.hoverDragging}
		dragPayload={{ text: name, boxId }}
	>
		<Text style={{ color: 'black', fontSize: 17 }}>{'#' + name}</Text>
	</DraxView>
);

const ColorDragDrop = (props: any) => {


	// const 모음

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
	const [loginStatus, setLoginStatus] = useState(true)
	const [accountModal, setAccountModal] = useState(false)
	const [tagSearchOn, setTagSearchOn] = useState(true)
	const [tagStateModal, setTagStateModal] = useState(false)
	const [autoTagStateModal, setAutoTagStateModal] = useState(false)
	const [tagStateModalTag, setTagStateModalTag] = useState(['Tag'])



	const playlist = ['나만의 플레이리스트', '신나는 음악', '드라이브', '드라이브 ']

	const { route } = props;
	const result = useContext(CoreContext);

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
			.get(`http://ec2-3-35-154-3.ap-northeast-2.compute.amazonaws.com:8080/main/${userId}`)
			.then((response) => {
				setAutoTag(response.data['tagList']);
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
			{({ value, SetValue }) => (
				<View>
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
					{/* 로그인 화면 */}

					{loginStatus ?

						<View style={[rStyles.centeredView, { height: '100%', justifyContent: "flex-start", }]}>


							<View style={{ justifyContent: 'center', alignItems: 'center' }}>
								<View style={{ height: 150 }}></View>
								<View style={{ justifyContent: 'center', alignItems: 'center', width: '100%' }}>
									<TextInput style={{ marginBottom: 25, paddingLeft: 15, width: '77%', backgroundColor: '#F7F8F9', height: 55, borderColor: '#E0E1E2', borderWidth: 1, borderRadius: 10, fontSize: 18 }} placeholder='아이디' placeholderTextColor='#CECED1'></TextInput>
									<TextInput secureTextEntry={true} style={{ paddingLeft: 15, width: '77%', backgroundColor: '#F7F8F9', height: 55, borderColor: '#E0E1E2', borderWidth: 1, borderRadius: 10, fontSize: 18 }} placeholder='비밀번호' placeholderTextColor='#CECED1'></TextInput>
									<View style={{ alignItems: 'flex-end', width: '100%', marginTop: 70, marginBottom: 40, paddingRight: 50 }}><Text style={{ color: '#6B8BDE' }}>비밀번호 재설정</Text></View>
								</View>
								<View style={{ width: '100%', alignItems: 'center' }}>
									<TouchableOpacity onPress={() => { setLoginStatus(false) }} style={{ width: '77%', backgroundColor: '#F1BFBF', height: 55, borderRadius: 10, marginBottom: 8, alignItems: 'center', justifyContent: 'center' }}><Text style={{ fontSize: 18, color: 'white', fontWeight: 'bold' }}>로그인</Text></TouchableOpacity>
									<TouchableOpacity style={{ flexDirection: 'row', width: '77%', borderColor: '#E8E9EA', borderWidth: 2, height: 55, borderRadius: 8, alignItems: 'center', justifyContent: 'center' }}>
										<Image source={require('../images/google-logo-thumbnail.png')} style={{ height: 35, width: 35, marginRight: 5 }}></Image>
										<Text style={{ fontSize: 18, color: 'black', fontWeight: 'bold' }}>구글 계정으로 로그인</Text>
									</TouchableOpacity>
									<View style={{ flexDirection: 'row', marginTop: 35 }}>
										<Text>아직 계정이 없으신가요?</Text>
										<TouchableOpacity style={{ marginLeft: 10 }}><Text style={{ fontWeight: 'bold' }}>회원가입</Text></TouchableOpacity>
									</View>
								</View>

							</View>



						</View>



						:
						<View style={[rStyles.centeredView]}>
							{/* 유저 페이지 */}
							<ScrollView>

								<View style={{}}>
									<View style={{ flexDirection: 'row', paddingLeft: 30, paddingTop: 40, height: 100 }}>
										<View style={{ width: 320, height: 40 }}>
											<Text style={{ fontSize: 17 }}>안녕하세요,</Text>
											<Text style={{ fontSize: 25, fontWeight: 'bold' }}>{userName}님</Text>
										</View>
										<TouchableOpacity>
											<View style={{ flexDirection: 'row' }}>
												<ImageBackground source={{ uri: `https://music-auto-tag.s3.ap-northeast-2.amazonaws.com/user_images/userimage_sample.png` }}
													style={{ width: 60, height: 60, marginRight: 20 }} borderRadius={20} imageStyle={{ opacity: 1 }}>
													<Image source={{ uri: `https://music-auto-tag.s3.ap-northeast-2.amazonaws.com/user_images/userimage_sample.png` }}
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
												SetValue([...fixedTag,...autoTag])
											}} style={{ width: 85, height: 35, backgroundColor: colorList[1], borderRadius: 8, justifyContent: 'center', alignItems: 'center' }}><Text style={{ fontSize: 18 }}>{tagSearchOn ? '수정' : '저장'}</Text></TouchableOpacity>
										</View>

										{tagSearchOn ? <View style={{ height: 10 }}></View> : <View>
											<TouchableOpacity style={{ alignItems: 'center', marginTop: 20, }}>
												<View style={{ justifyContent: 'center', width: 370, backgroundColor: colorList[1], height: 45, borderRadius: 10, paddingLeft: 20 }}>
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
												: <Text style={{ fontSize: 17, fontStyle: 'italic' }}>추천 태그</Text>
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
												: <Text style={{ fontSize: 17, fontStyle: 'italic' }}>추천 태그</Text>
											}
										</View>
									</View>


									<View style={{ flex: 3 }}>
										<View>
											<Text style={{ fontSize: 25, color: 'black', fontWeight: 'bold', marginTop: 40, marginLeft: 30 }}>플레이리스트</Text>
										</View>
										<View style={{ alignItems: 'center', justifyContent: 'center' }}>
											{playlist.map((list, index) => (
												<View style={{ padding: 9, flexDirection: 'row', height: 125, backgroundColor: colorList[index + 4], borderRadius: 12, width: '88%', marginVertical: 10, }} key={list}>
													<View>
														<Image source={require('../images/playlisticon.jpg')} style={{ height: '100%', aspectRatio: 1, borderRadius: 20 }} />
													</View>
													<View style={{ padding: 10, width: '100%' }}>
														<View style={{ marginLeft: 5 }}>
															<Text style={{ fontSize: 20, color: '#454545', fontWeight: 'bold' }}>{list}</Text>
															<Text style={{ fontSize: 15, color: '#454545', fontWeight: 'bold' }}>2022. 08. 17</Text>
														</View>
														<View style={{ alignItems: 'flex-end', width: '70%' }}><Icon name="play" color='#626262' size={40} /></View>
													</View>
												</View>
											))}
										</View>
									</View>
								</View>
							</ScrollView>
						</View>}
				</View >
			)}
		</CoreConsumer >
	);
};

export default ColorDragDrop;
