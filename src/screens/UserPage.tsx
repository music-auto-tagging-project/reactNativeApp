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
import { TextInput, Image, ScrollView, Modal, Animated, ImageBackground } from 'react-native';
import rStyles from '../styles/styles'
import axios from 'axios';
import * as Hangul from 'hangul-js';
import { CoreContext, CoreConsumer } from '../context/CoreManagement';
import tag_data from '../etc/tag'
import { add, color } from 'react-native-reanimated';
// import Animated from 'react-native-reanimated';

interface ColorBlockProps {
	name: string;
	boxId: string;
}

const colorList: any = ['#F1BFBF', '#F1D4BF', '#F1E6BF', '#CCF1BF', '#BFF1DF', '#BFD0F1', '#D6A7D7']
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
		<Text style={{ color: 'black', fontSize: 16 }}>{'#' + name}</Text>
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



	const playlist = ['나만의 플레이리스트', '신나는 음악', '드라이브 할때 좋은 POP!', '추천 플레이리스트!']

	const { route } = props;
	const result = useContext(CoreContext);

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
				<DraxProvider>
					<Modal
						animationType="slide"
						transparent={true}
						visible={accountModal}
						onRequestClose={() => {
							setAccountModal(!accountModal);
						}}
					>
						<View style={[rStyles.centeredView, { backgroundColor: 'black', justifyContent: "flex-start" }]}>
							<View style={{ height: 60, justifyContent: 'center' }}>
								<View style={{ paddingRight: 270, flexDirection: 'row' }}>
									<TouchableOpacity onPress={() => setModalVisible(!modalVisible)}>
										<View style={{}}><Image source={require('../images/magician.jpg')} style={rStyles.Logo} /></View>
									</TouchableOpacity>
									<View style={{ marginTop: 5 }}><Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold' }}>Music App</Text></View>
								</View>
							</View>
							<View style={{ paddingTop: 150, justifyContent: 'center', alignItems: 'center' }}>
								<View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingRight: 20 }}><Text style={{ color: "white", fontSize: 20 }}>ID        </Text><TextInput style={{ borderRadius: 0, margin: 10, height: 40, width: 250, backgroundColor: "rgba(230,230,230,0.8)" }}></TextInput></View>
								<View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingRight: 20 }}><Text style={{ color: "white", fontSize: 20 }}>PW      </Text><TextInput style={{ borderRadius: 0, margin: 10, height: 40, width: 250, backgroundColor: "rgba(230,230,230,0.8)" }}></TextInput></View>
								<View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingRight: 20 }}><Text style={{ color: "white", fontSize: 20 }}>NAME </Text><TextInput style={{ borderRadius: 0, margin: 10, height: 40, width: 250, backgroundColor: "rgba(230,230,230,0.8)" }}></TextInput></View>
								<View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingRight: 20 }}><Text style={{ color: "white", fontSize: 20 }}>BIRTH </Text><TextInput style={{ borderRadius: 0, margin: 10, height: 40, width: 250, backgroundColor: "rgba(230,230,230,0.8)" }}></TextInput></View>
								<TouchableOpacity onPress={() => { setLoginStatus(false) }}>
									<View style={{ justifyContent: 'center', alignItems: 'center', borderRadius: 20, width: 100, height: 50, margin: 10, backgroundColor: "rgba(200,200,200,0.4)" }}>
										<Text style={{ color: "white", fontSize: 20 }}>회원가입</Text>
									</View>
								</TouchableOpacity>
							</View>
						</View>
					</Modal>
					{/* 유저 페이지 */}
					{loginStatus ?

						<View style={[rStyles.centeredView, { justifyContent: "flex-start", }]}>


							<View style={{ paddingTop: 150, justifyContent: 'center', alignItems: 'center' }}>
								<View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingRight: 20 }}><Text style={{ color: "white", fontSize: 20 }}>ID   </Text><TextInput style={{ borderRadius: 0, margin: 10, height: 40, width: 250, backgroundColor: "rgba(230,230,230,0.8)" }}></TextInput></View>
								<View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingRight: 20 }}><Text style={{ color: "white", fontSize: 20 }}>PW </Text><TextInput style={{ borderRadius: 0, margin: 10, height: 40, width: 250, backgroundColor: "rgba(230,230,230,0.8)" }}></TextInput></View>

								<View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 30 }}>
									<TouchableOpacity onPress={() => { setLoginStatus(false) }}>
										<View style={{ justifyContent: 'center', alignItems: 'center', borderRadius: 20, width: 100, height: 50, margin: 10, backgroundColor: "rgba(200,200,200,0.4)" }}>
											<Text style={{ color: "white", fontSize: 20 }}>로그인</Text>
										</View>
									</TouchableOpacity>
									<TouchableOpacity onPress={() => setAccountModal(true)}>
										<View style={{ justifyContent: 'center', alignItems: 'center', borderRadius: 20, width: 100, height: 50, margin: 10, backgroundColor: "rgba(200,200,200,0.4)" }}>
											<Text style={{ color: "white", fontSize: 20 }}>회원가입</Text>
										</View>
									</TouchableOpacity>
								</View>
								<View style={{ marginTop: 40 }}>
									<TouchableOpacity><View style={{ backgroundColor: 'white', justifyContent: 'center', alignItems: 'center', width: 200, height: 50, margin: 10 }}><Text style={{ fontSize: 20 }}>Google</Text></View></TouchableOpacity>
									<TouchableOpacity><View style={{ backgroundColor: 'white', justifyContent: 'center', alignItems: 'center', width: 200, height: 50, margin: 10 }}><Text style={{ fontSize: 20 }}>Facebook</Text></View></TouchableOpacity>
									<TouchableOpacity><View style={{ backgroundColor: 'white', justifyContent: 'center', alignItems: 'center', width: 200, height: 50, margin: 10 }}><Text style={{ fontSize: 20 }}>Naver</Text></View></TouchableOpacity>
								</View>

							</View>



						</View>



						:
						<View style={[rStyles.centeredView]}>
							<DraxScrollView>

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
												{ SetValue([...fixedTag, ...autoTag]); }
												onClickSendTag();
												reRendering()
											}} style={{ width: 85, height: 35, backgroundColor: colorList[1], borderRadius: 8, justifyContent: 'center', alignItems: 'center' }}><Text style={{ fontSize: 18 }}>{tagSearchOn ? '수정' : '저장'}</Text></TouchableOpacity>
										</View>

										{tagSearchOn ? <View></View> :
											<TouchableOpacity style={{ alignItems: 'center', marginTop: 20, }}>
												<View style={{ justifyContent: 'center', width: 370, backgroundColor: colorList[1], height: 45, borderRadius: 10, paddingLeft: 20 }}>
													<TextInput onChangeText={(nm) => {
														find_nm(nm);
														if (inputText == '') {
															reRendering()
														}
														if (nm == '' && inputText !== '') {
															reRendering()
														}
														setInputText(nm)
													}} style={{ padding: 0, fontSize: 17 }} placeholder="태그 검색" placeholderTextColor='#A1A1A1'></TextInput>
												</View>
											</TouchableOpacity>}

									</View>


									<SafeAreaView
										edges={['top', 'left', 'right']}
										style={{ flex: 1, alignItems: 'center' }}
									>
										<View style={inputText == '' ? { marginTop: 5 } : { marginTop: 5, height: 30 }}>
											{Array.from(Array(1).keys()).map((n, index) =>
												<View key={n} style={{ flexDirection: 'row', paddingHorizontal: 20 }}>
													{startText.slice(n * 5, (n + 1) * 5).map((tag) => (
														<View key={tag}>
															<ColorBlock
																name={tag}
																boxId='1'
															/>
														</View>
													))}
												</View>
											)}
										</View>
										<View style={{ width: '100%' }}>
											<View style={{ marginLeft: 30, marginVertical: 15 }}>
												<Text style={{ fontSize: 16 }}>나의 태그</Text>
											</View>
										</View>
										<>
											<DraxView
												style={[
													styles.receivingZone,
													{ width: 370, backgroundColor: colorList[2] }
												]}
												receivingStyle={styles.receiving}
												renderContent={({ viewState }) => {
													return (
														<>
															{(fixedTag.length) && (fixedTag.length > 0) ? (
																Array.from(Array(3).keys()).map((n, index) =>
																	<View key={index} style={{ flexDirection: 'row', paddingHorizontal: 15, alignItems: 'center', paddingTop: 8 }}>
																		{fixedTag.slice(n * 4, (n + 1) * 4).map((tag, index) => (
																			<Animated.View key={index} style={{ opacity: fadeAnim }}>
																				<ColorBlock
																					name={tag}
																					boxId='2'
																				/>
																			</Animated.View>
																		))}
																	</View>
																)
															) : (
																<Text style={styles.instruction}>
																	나의 태그
																</Text>
															)}
														</>
													);
												}}
												onReceiveDragDrop={(event) => {
													const { text, boxId } = event.dragged.payload
														?? { text: '?' };
													if (boxId == '1') {
														if (!fixedTag.includes(text) && !autoTag.includes(text)) {
															var fixedCopy = [...fixedTag, text]
															setFixedTag([])
															setTimeout(() => { setFixedTag(fixedCopy); }, renderTime)
															var startCopy = startText.filter(x => x != text)
															setStartText([])
															setTimeout(() => { setStartText(startCopy) }, renderTime)
														}

													} else if (boxId == '3') {
														var autoCopy = autoTag.filter(x => x != text)
														setAutoTag([])
														setTimeout(() => { setAutoTag(autoCopy); }, renderTime)
														var fixedCopy = [...fixedTag, text]
														setFixedTag([])
														setTimeout(() => { setFixedTag(fixedCopy) }, renderTime)
													}

													return DraxSnapbackTargetPreset.None;
												}}
											/>
										</>
										<View style={{ width: '100%' }}>
											<View style={{ marginLeft: 30, marginVertical: 15 }}>
												<Text style={{ fontSize: 16 }}>추천 태그</Text>
											</View>
										</View>
										<>
											<DraxView
												style={styles.stagingLayout}
												renderContent={({ viewState }) => {
													const receivingDrag = viewState?.receivingDrag;
													const active = viewState?.dragStatus !== DraxViewDragStatus.Inactive;
													const combinedStyles: ViewStyle[] = [
														styles.centeredContent,
														styles.stagingZone,
														{ width: 370 },
														{ backgroundColor: colorList[3] }
													];
													if (active) {
														combinedStyles.push({ opacity: 0.2 });
													} else if (receivingDrag) {
														combinedStyles.push(styles.receiving);
													}
													return (
														<View style={combinedStyles}>
															{(autoTag.length > 0) ? (
																Array.from(Array(3).keys()).map((n, index) =>
																	<View key={n} style={{ flexDirection: 'row', paddingHorizontal: 15, alignItems: 'center', paddingTop: 8 }}>

																		{autoTag.slice(n * 4, (n + 1) * 4).map((tag, index) => (
																			<Animated.View key={index} style={{ opacity: fadeAnim }}>
																				<ColorBlock
																					name={tag}
																					boxId='3'
																				/>
																			</Animated.View>
																		))}
																	</View>
																)
															) : (
																<Text style={styles.instruction}>
																	Drag Tag
																</Text>
															)}

														</View>
													);
												}}
												onReceiveDragDrop={(event) => {
													const { text, boxId } = event.dragged.payload
														?? { text: '?' };
													if (boxId == '1') {
														if (!fixedTag.includes(text) && !autoTag.includes(text)) {
															var autoCopy = [...autoTag, text]
															setAutoTag([])
															setTimeout(() => { setAutoTag(autoCopy); }, renderTime)
															var startCopy = startText.filter(x => x != text)
															setStartText([])
															setTimeout(() => { setStartText(startCopy) }, renderTime)
														} else {
															Alert.alert('해당 태그가 존재합니다.')
														}
													} else if (boxId == '2') {
														var autoCopy = [...autoTag, text]
														setAutoTag([])
														setTimeout(() => { setAutoTag(autoCopy); }, renderTime)
														var fixedCopy = fixedTag.filter(x => x != text)
														setFixedTag([])
														setTimeout(() => { setFixedTag(fixedCopy) }, renderTime)
													}

													return DraxSnapbackTargetPreset.None;
												}}
											/>
										</>
									</SafeAreaView>
									<View style={{ flexDirection: 'row', paddingRight: 30, marginTop: 5 }}>
										<DraxView
											style={styles.stagingLayout}
											renderContent={({ viewState }) => {
												const receivingDrag = viewState?.receivingDrag;
												const active = viewState?.dragStatus !== DraxViewDragStatus.Inactive;
												const combinedStyles: ViewStyle[] = [
													styles.deleteZone,
													{ marginLeft: 20, width: 370 },
													{ backgroundColor: 'white' }
												];
												if (active) {
													combinedStyles.push({ opacity: 0.2 });
												} else if (receivingDrag) {
													combinedStyles.push(styles.receiving);
												}
												return (
													<View style={[combinedStyles, { alignContent: 'flex-start' }]}>
														<View style={{ flexDirection: 'row' }}><Text style={{ color: 'black' }}>Del Here </Text><Icon name="trash-can" color={'black'} size={20} /></View>
													</View>
												);
											}}
											onReceiveDragDrop={(event) => {
												const { text, boxId } = event.dragged.payload
													?? { text: '?' };
												if (boxId == '2') {
													var fixCopy = fixedTag.filter(x => x != text)
													setFixedTag([])
													setTimeout(() => { setFixedTag(fixCopy) }, renderTime)
													setDeletedTag([...deletedTag, text])
												} else if (boxId == '3') {
													var autoCopy = autoTag.filter(x => x != text)
													setAutoTag([])
													setTimeout(() => { setAutoTag(autoCopy) }, renderTime)
													setDeletedTag([...deletedTag, text])
												}

												return DraxSnapbackTargetPreset.None;
											}}
											onDragDrop={() => {
												setAutoTag([]);
											}}
											longPressDelay={200}
										/>

									</View>


									<View style={{ flex: 3 }}>
										<View>
											<Text style={{ fontSize: 25, color: 'black', fontWeight: 'bold', marginTop: 40, marginLeft: 30 }}>플레이리스트</Text>
										</View>
										<View>

											{playlist.map((list,index) => (
												<View style={{ flexDirection: 'row', backgroundColor:colorList[index+4] }} key={list}>
													<View>
														<Image source={require('../images/playlisticon.jpg')} style={{ marginTop: 30, marginLeft: 35, width: 100, height: 100, borderRadius: 20 }} />
													</View>
													<View style={{ marginTop: 25, marginLeft: 20 }}>
														<Text key={list} style={{ fontSize: 17, color: 'white', fontWeight: 'bold' }}>{list}</Text>
														<TouchableOpacity><Text style={[rStyles.logoutbutton, { width: 90, height: 33 }]}> 재생하기</Text></TouchableOpacity>
													</View>
												</View>
											))}
										</View>
									</View>
								</View>
							</DraxScrollView>
						</View>}
				</DraxProvider>
			)}
		</CoreConsumer>
	);
};

const styles = StyleSheet.create({
	centeredContent: {
	},
	receivingZone: {
		borderRadius: 10,
		margin: 8,
		height: 50,
		borderColor: 'white',
		borderWidth: 1
	},
	overlay: {
		...StyleSheet.absoluteFillObject,
		justifyContent: 'flex-end',
		alignItems: 'flex-end',
	},
	trashButton: {
		width: 30,
		height: 30,
		backgroundColor: '#999999',
		borderRadius: 15,
		margin: 10,
		justifyContent: 'center',
		alignItems: 'center',
	},
	receiving: {
		borderColor: 'red',
	},
	incomingText: {
		marginTop: 10,
		fontSize: 24,
	},
	received: {
		marginTop: 10,
		fontSize: 18,
	},
	instruction: {
		marginLeft: 15,
		marginTop: 15,
		fontSize: 12,
		fontStyle: 'italic',
	},
	palette: {
		justifyContent: 'center',
		flexDirection: 'row',
		flexWrap: 'wrap',
	},
	paletteRow: {
		flexDirection: 'row',
		justifyContent: 'space-evenly',
		marginVertical: 8,
	},
	colorBlock: {
		height: 20,
		borderRadius: 10,
		marginHorizontal: 5,
		marginVertical: 3
	},
	dragging: {
		opacity: 0.2,
	},
	hoverDragging: {
		borderColor: 'magenta',
		borderWidth: 0,
	},
	stagingLayout: {
		flex: 3,
		margin: 8,
	},
	stagingZone: {
		borderRadius: 10,
		height: 120,
	},
	deleteZone: {
		height: 50,
		borderColor: 'white',
		borderWidth: 1,
		borderRadius: 10
	},
	stagedCount: {
		fontSize: 18,
	},
});

export default ColorDragDrop;
