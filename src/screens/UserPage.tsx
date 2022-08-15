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
import { add } from 'react-native-reanimated';
// import Animated from 'react-native-reanimated';

interface ColorBlockProps {
	name: string;
	boxId: string;
}

const ColorBlock = ({ name, boxId }: ColorBlockProps) => (
	<DraxView
		style={[
			styles.centeredContent,
			styles.colorBlock,
			{ backgroundColor: `rgba(255,255,255,0.25)` },
		]}
		draggingStyle={styles.dragging}
		dragReleasedStyle={styles.dragging}
		hoverDraggingStyle={styles.hoverDragging}
		dragPayload={{ text: name, boxId }}
	>
		<Text style={{ color: 'white', fontSize: 16 }}>{name}</Text>
	</DraxView>
);

const ColorDragDrop = (props: any) => {


	// const 모음

	const renderTime = 10
	const [modalVisible, setModalVisible] = useState(false);
	const [userName, setUserName] = useState('User_1')
	const [userId, setUserId] = useState('1')
	const [UserImage, setUserImage] = useState('null')
	const [fixedTag, setFixedTag] = useState<string[]>([]);
	const [autoTag, setAutoTag] = useState<string[]>(['벚꽃', '잔잔한', '평화로운', '봄바람']);
	const [startText, setStartText] = useState<string[]>([]);
	const [text_array, setText_Array] = useState(["사랑", "이별", "서정적", "슬픔", "뭉게구름", "따뜻한", "새벽", "감성"])
	const [inputText, setInputText] = useState('')
	const [deletedTag,setDeletedTag] = useState<string[]>([])

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

	function onClickSendTag() {
		console.log([...fixedTag, ...autoTag])
		let add_list: any = []
		fixedTag.map((tag, index) => (
			add_list.push({ "tagName": tag, "isFixed": 'FIXED' })
		))
		autoTag.map((tag, index) => (
			add_list.push({ "tagName": tag, "isFixed": 'UNFIXED' })
		))
		deletedTag.map((tag, index) => (
			add_list.push({ "tagName": tag, "isFixed": 'DELETED' })
		))
		console.log(add_list)

		axios
			.post("http://3.35.154.3:5000/user/tag", {
				"userId": userId,
				"usertagList": add_list
			}).catch(error => {
				console.log(error.config)
			});
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
			.get(`http://3.35.154.3:5000/tag`)
			.then((response) => {
				setText_Array(response.data['tagList'])
				console.log('Get Tag Sucess')
			}).catch(error => {
				console.log('Get tag error')
			});

		axios
			.get(`http://3.35.154.3:5000/main/${userId}`)
			.then((response) => {
				setAutoTag(response.data['tagList']);
				setUserName(response.data['userName']);
				setUserImage(response.data['userImage']);
			}).catch(error => {
				console.log(error.config)
			});

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
			{({ value, SetValue}) => (
				<DraxProvider>
					<View style={[rStyles.centeredView, rStyles.back_black]}>
						<DraxScrollView>
							<View style={{ height: 60, justifyContent: 'center' }}>
								<View style={{ paddingRight: 270, flexDirection: 'row' }}>
									<TouchableOpacity onPress={() => setModalVisible(!modalVisible)}>
										<View style={{}}><Image source={require('../images/magician.jpg')} style={rStyles.Logo} /></View>
									</TouchableOpacity>
									<View style={{ marginTop: 5 }}><Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold' }}>Music App</Text></View>
								</View>
							</View>



							<View style={{}}>
								<View style={[rStyles.mypagebox1, { height: 100 }]}>
									<View style={{ flexDirection: 'row' , alignItems:'center'}}>
										<ImageBackground source={{ uri: `https://music-auto-tag.s3.ap-northeast-2.amazonaws.com/music_images/music_default.png` }}
											style={rStyles.player} borderRadius={100} imageStyle={{ opacity: 0.5 }}>
											<Image source={{ uri: `https://music-auto-tag.s3.ap-northeast-2.amazonaws.com/user_images/_${userId}.jpg` }}
												style={[rStyles.player]} />												
										</ImageBackground>										
										<View>
											<Text style={{ fontSize: 30, color: 'white', fontWeight: 'bold', marginVertical: 15, marginLeft: 7 }}>{userName}</Text>
											<TouchableOpacity style={[rStyles.container, { backgroundColor: 'rgba(255,255,255,0.25)' }]}><Text style={{ fontSize: 17, color: 'white' }}>로그아웃</Text></TouchableOpacity>
										</View>
									</View>
								</View>
								<View>
									<View>
										<Text style={{ fontSize: 30, color: 'white', fontWeight: 'bold', marginTop: 40, marginLeft: 30 }}>Music 태그</Text>
									</View>


									<TouchableOpacity style={{ alignItems: 'center', marginTop: 30 }}>
										<View style={{ alignItems: 'center', justifyContent: 'center', width: '80%', backgroundColor: 'rgba(255,255,255,0.25)', height: 40, borderRadius: 20 }}>
											<TextInput onChangeText={(nm) => {
												find_nm(nm);
												if (inputText == '') {
													reRendering()
												}
												if (nm == '' && inputText !== '') {
													reRendering()
												}
												setInputText(nm)
											}} style={{ padding: 0, fontSize: 17 }} placeholder="태그 추가 (예시 : 새벽, 따뜻한 ... )" placeholderTextColor={'white'}></TextInput>
										</View>
									</TouchableOpacity>
								</View>
								<SafeAreaView
									edges={['top', 'left', 'right']}
									style={{ flex: 1, alignItems: 'center' }}
								>
									<View style={inputText == '' ? { marginTop: 20 } : { marginTop: 20, height: 60 }}>
										{Array.from(Array(1).keys()).map((n, index) =>
											<View key={n} style={{ flexDirection: 'row', paddingHorizontal: 20, marginBottom: 10, alignItems: 'center', justifyContent: 'center' }}>
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
									<>
										<DraxView
											style={[
												styles.centeredContent,
												styles.receivingZone,
												{ width: 370, backgroundColor: 'rgba(153,234,163,0.3)' }
											]}
											receivingStyle={styles.receiving}
											renderContent={({ viewState }) => {
												return (
													<>
														{(fixedTag.length) && (fixedTag.length > 0) ? (
															Array.from(Array(3).keys()).map((n, index) =>
																<View key={index} style={{ flexDirection: 'row', paddingHorizontal: 5, alignItems: 'center', justifyContent: 'center' }}>
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
																Drag Tag
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
													{ backgroundColor: 'rgba(170,224,255,0.35)' }
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
																<View key={n} style={{ flexDirection: 'row', paddingHorizontal: 5, alignItems: 'center', justifyContent: 'center' }}>

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
												{ marginLeft: 20, width: 245 },
												{ backgroundColor: 'black' }
											];
											if (active) {
												combinedStyles.push({ opacity: 0.2 });
											} else if (receivingDrag) {
												combinedStyles.push(styles.receiving);
											}
											return (
												<View style={[combinedStyles, { alignContent: 'flex-start' }]}>
													<View style={{ flexDirection: 'row' }}><Text style={{ color: 'white' }}>Del Here </Text><Icon name="trash-can" color={'white'} size={20} /></View>
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
												setDeletedTag([...deletedTag,text])
											} else if (boxId == '3') {
												var autoCopy = autoTag.filter(x => x != text)
												setAutoTag([])
												setTimeout(() => { setAutoTag(autoCopy) }, renderTime)
												setDeletedTag([...deletedTag,text])
											}

											return DraxSnapbackTargetPreset.None;
										}}
										onDragDrop={() => {
											setAutoTag([]);
										}}
										longPressDelay={200}
									/>
									<TouchableOpacity onPress={() => {
										{ SetValue([...fixedTag, ...autoTag]); }
										onClickSendTag()
									}} style={{
										marginTop: 50,
										backgroundColor: 'rgba(255, 255, 255, 0.25)', width: 130, height: 40, paddingVertical: 8,
										paddingHorizontal: 20, borderRadius: 20, alignItems: 'center'
									}}>
										<Text style={{ color: 'white', fontSize: 17 }}>태그 저장</Text>
									</TouchableOpacity>
								</View>


								<View style={{ flex: 3 }}>
									<View>
										<Text style={{ fontSize: 30, color: 'white', fontWeight: 'bold', marginTop: 40, marginLeft: 30 }}>PlayList</Text>
									</View>
									<View>

										{playlist.map((list) => (
											<View style={{ flexDirection: 'row' }} key={list}>
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
					</View>
				</DraxProvider>

			)}
		</CoreConsumer>
	);
};

const styles = StyleSheet.create({
	centeredContent: {
		justifyContent: 'center',
		alignItems: 'center',
	},
	receivingZone: {
		borderRadius: 10,
		margin: 8,
		borderColor: 'rgb(34,139,34)',
		borderWidth: 1,
		height: 135
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
		marginTop: 10,
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
		width: 75,
		height: 40,
		borderRadius: 20,
		marginHorizontal: 6,
		marginVertical: 7
	},
	dragging: {
		opacity: 0.2,
	},
	hoverDragging: {
		borderColor: 'magenta',
		borderWidth: 2,
	},
	stagingLayout: {
		flex: 3,
		margin: 8,
	},
	stagingZone: {
		borderRadius: 10,
		borderColor: 'rgb(30,144,255)',
		borderWidth: 1,
		height: 135,
	},
	deleteZone: {
		height: 110,
		borderColor: 'black',
		borderWidth: 1,
		borderRadius: 10
	},
	stagedCount: {
		fontSize: 18,
	},
});

export default ColorDragDrop;
