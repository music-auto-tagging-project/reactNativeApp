import {
	StyleSheet,
	View,
	Text,
	ViewStyle,
	TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {
	DraxProvider,
	DraxView,
	DraxViewDragStatus,
	DraxSnapbackTargetPreset,
} from 'react-native-drax';

import * as React from 'react';
import { useState, useEffect, useRef, Component } from 'react';
import { TextInput, Image, ScrollView, Modal } from 'react-native';
import { useCallback } from 'react';
import rStyles from '../styles/styles'
import axios from 'axios';
import * as Hangul from 'hangul-js';
import { disassemble } from 'hangul-js';





interface ColorWeights {
	red: number;
	green: number;
	blue: number;
}

interface ColorBlockProps {
	name: string;
	weights: ColorWeights;
	boxId: string;
}

const getStyleForWeights = ({ red, green, blue }: ColorWeights) => {
	const total = red + green + blue;
	let backgroundColor = '#dddddd';
	if (total > 0) {
		const r = red
		const g = green
		const b = blue
		backgroundColor = `rgb(${r}, ${g}, ${b})`;
	}
	return { backgroundColor };
};

const getEmptyWeights = () => ({ red: 0, green: 0, blue: 0 });

const ColorBlock = ({ name, weights, boxId }: ColorBlockProps) => (
	<DraxView
		style={[
			styles.centeredContent,
			styles.colorBlock,
			getStyleForWeights(weights),
		]}
		draggingStyle={styles.dragging}
		dragReleasedStyle={styles.dragging}
		hoverDraggingStyle={styles.hoverDragging}
		dragPayload={{ weights, text: name, boxId }}
	>
		<Text>{name}</Text>
	</DraxView>
);

const ColorDragDrop = () => {


	// const 모음

	const [modalVisible, setModalVisible] = useState(false);
	const [playmodalVisible, setPlayModalVisible] = useState(false);
	const [mainTagModalVisible, setMainTagModalVisible] = useState(false);
	const [modifyTagVisible, setModifyTagVisible] = useState(false)
	const [recTag, setRecTag] = useState('');
	const [userTag1, setUserTag1] = useState(['null1', 'null2', 'null3', 'null4'])
	const [userTag2, setUserTag2] = useState(['야속', '슬픔', '감동'])
	const [userName, setUserName] = useState('null')
	const [userId, setUserId] = useState('1')
	const [UserImage, setUserImage] = useState('null')
	const [rMusicList, setRMusicList] = useState(['null', 'null', 'null', 'null', 'null', 'null', 'null', 'null']);
	const [musicId, setMusicId] = useState('1')
	const [default_height, setDefault_Height] = useState(100)

	const playlist = ['나만의 플레이리스트', '신나는 음악', '드라이브 할때 좋은 POP!', '추천 플레이리스트!']



	const array = [
		{
			id: 0,
			src: require(`../images/replay1.png`),
			title: '비도 오고 그래서'
		},
		{
			id: 1,
			src: require("../images/replay2.png"),
			title: "Can't Go"
		},
		{
			id: 2,
			src: require("../images/replay3.png"),
			title: '용천동굴'
		},
		{
			id: 3,
			src: require("../images/replay4.png"),
			title: '비구름'
		},
	];

	const onClickSendTag = () => {
		axios
			.post("http://3.35.154.3:5000/user/tag", {
				"userId": userId,
				"tagList": userTag1
			})
	}
	const onClickMusic = () => {
		axios
			.get(`http://3.35.154.3:5000/music/stream/${musicId}`).
			then((response) => {
				setMusicInfo(response.data);
			})
		setPlayModalVisible(true)
		// setMusicId(music.musicId)
	}
	const onClickModifyTag = () => {
		setModifyTagVisible(true)
	}

	function find_nm(nm: any) {

		const temp_list = []
		let flag = false
		{
			text_array.map((x) => {
				flag = true;
				console.log(Hangul.disassemble(nm))
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

	const [receivedWeights, setReceivedWeights] = useState<ColorWeights>(getEmptyWeights());
	const [receivedText, setReceivedText] = useState<string[]>([]);
	const [stagedWeights, setStagedWeights] = useState<ColorWeights>(getEmptyWeights());
	const [stagedText, setStagedText] = useState<string[]>(["행복", "눈물"]);
	const [startText, setStartText] = useState<string[]>(["사랑", "이별", "서정적", "슬픔", "뭉게구름", "새벽", "감성"]);
	const [tagVisible, setTagVisible] = useState(false)
	const [profile, setProfile] = useState(true)
	const [count, setCount] = useState(0)
	const [text_array, setText_Array] = useState(["사랑", "이별", "서정적", "슬픔", "뭉게구름", "따뜻한", "새벽", "감성"])
	const [show_text, setShow_Text] = useState(['null'])
	const [inputText, setInputText] = useState("null")


	useEffect(() => {
		axios.
			get(`http://3.35.154.3:5000/tag`)
			.then((response) => {				
				setText_Array(response.data['tagList'])
			})
	


	}, []
	)



	return (
		<>
			<DraxProvider>
				<View style={[rStyles.centeredView, rStyles.back_black]}>
					<ScrollView showsVerticalScrollIndicator={false}>
						<View style={{ height: 60, justifyContent: 'center' }}>
							<View style={{ paddingRight: 270, flexDirection: 'row' }}>
								<TouchableOpacity onPress={() => setModalVisible(!modalVisible)}>
									<View style={{}}><Image source={require('../images/magician.jpg')} style={rStyles.Logo} /></View>
								</TouchableOpacity>
								<View style={{ marginTop: 5 }}><Text style={{ color:'white', fontSize: 20, fontWeight: 'bold' }}>Music App</Text></View>
							</View>
						</View>



						<View style={{}}>
							{profile && (

								<View style={[rStyles.mypagebox1, { height: default_height }]}>
									<View style={{ flexDirection: 'row' }}>
										<Image
											style={rStyles.player}
											source={{ uri: `data:image/jpeg;base64,${UserImage}` }} />
										<View>
											<Text style={{ fontSize: 20, color: 'rgba(0.1, 0.1, 0.1, 0.5)', fontWeight: 'bold', marginTop: 12, marginLeft: 7 }}>{userName}</Text>
											<TouchableOpacity><Text style={rStyles.logoutbutton}>로그아웃</Text></TouchableOpacity>
										</View>
									</View>
								</View>

							)}
							<View style={{ height: 520 }}>
								<TouchableOpacity onPress={() => { setProfile(true) }}>
									<View style={{ flexDirection: 'row' }}>
										<View style={{ flex: 1 }}></View>
										<Text style={{ borderBottomColor: 'rgba(0.1,0.1,0.1,0.25)', borderBottomWidth: 1, flex: 15 }}></Text>
										<View style={{ flex: 1 }}></View>
									</View>
								</TouchableOpacity>
								<View>
									<Text style={{ fontSize: 25, color: 'rgba(0.1, 0.1, 0.1, 0.5)', fontWeight: 'bold', marginTop: 20, marginLeft: 30 }}>Music Tag</Text>
								</View>


								<TouchableOpacity onPress={() => { setProfile(false) }} style={{ alignItems: 'center', marginTop: 20 }}>
									<View style={{ alignItems: 'center', justifyContent: 'center', width: '80%', backgroundColor: 'rgba(0.1,0.1,0.1,0.15)', height: 30, borderRadius: 15 }}>
										<TextInput onChangeText={(nm) => { setInputText(nm); find_nm(nm) }} style={{ padding: 0 }} placeholder="태그 추가 (예시 : 새벽, 따뜻한 ... )" placeholderTextColor={'black'}></TextInput>
									</View>

								</TouchableOpacity>
								<SafeAreaView
									edges={['top', 'left', 'right']}
									style={styles.container}
								>
									<View style={{ marginTop: 20 }}>
										{Array.from(Array(1).keys()).map((n, index) =>
											<View key={n} style={{ flexDirection: 'row', paddingHorizontal: 20, marginBottom: 10, alignItems: 'center', justifyContent: 'center' }}>
												{startText.slice(n * 4, (n + 1) * 4).map((tag) => (
													<View key={tag}>
														<Text style={{ fontSize: 0 }}>{profile && ""}</Text>
														<ColorBlock
															name={tag}
															weights={{ red: 200, green: 200, blue: 200 }}
															boxId='1'
														/>
													</View>
												))}
											</View>
										)}
									</View>
									<DraxView
										style={[
											styles.centeredContent,
											styles.receivingZone,
											{ backgroundColor: 'rgba(34,139,34,0.1)' }
										]}
										receivingStyle={styles.receiving}
										renderContent={({ viewState }) => {
											const receivingDrag = viewState?.receivingDrag;
											const incomingText = receivingDrag?.payload?.text;

											return (
												<>
													<Text>고정 태그</Text>
													{(receivedText.length > 0) ? (
														Array.from(Array(3).keys()).map((n, index) =>
															<View key={n} style={{ flexDirection: 'row', paddingHorizontal: 20, marginBottom: 20, alignItems: 'center', justifyContent: 'center' }}>
																{receivedText.slice(n * 4, (n + 1) * 4).map((tag) => (
																	<View key={tag}>
																		<Text style={{ fontSize: 0 }}>{profile && ""}</Text>
																		<ColorBlock
																			name={tag}
																			weights={{ red: 200, green: 200, blue: 200 }}
																			boxId='2'
																		/>
																	</View>
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
											const { text, weights, boxId } = event.dragged.payload
												?? { text: '?', weights: getEmptyWeights() };
											if (boxId == '1') {
												setReceivedText([...receivedText, text]);
												setStartText(startText.filter(x => x !== text))

											} else if (boxId == '3') {
												setReceivedText([...receivedText, text]);
												setStagedText(stagedText.filter(x => x !== text))

											}

											return DraxSnapbackTargetPreset.None;
										}}
									/>
									<DraxView
										dragPayload={{ weights: stagedWeights, text: stagedText.join(' ') }}
										draggable={stagedText.length > 0}
										style={styles.stagingLayout}
										hoverDraggingStyle={{
											transform: [
												{ rotate: '10deg' },
											],
										}}
										renderContent={({ viewState }) => {
											const receivingDrag = viewState?.receivingDrag;
											const active = viewState?.dragStatus !== DraxViewDragStatus.Inactive;
											const combinedStyles: ViewStyle[] = [
												styles.centeredContent,
												styles.stagingZone,
												{ width: 370 },
												{ backgroundColor: 'rgba(30,144,255,0.1)' }
											];
											if (active) {
												combinedStyles.push({ opacity: 0.2 });
											} else if (receivingDrag) {
												combinedStyles.push(styles.receiving);
											}
											return (
												<View style={combinedStyles}>
													<Text>Auto Tag</Text>
													{(stagedText.length > 0) ? (
														Array.from(Array(3).keys()).map((n, index) =>
															<View key={n} style={{ flexDirection: 'row', paddingHorizontal: 20, marginBottom: 20, alignItems: 'center', justifyContent: 'center' }}>
																{stagedText.slice(n * 4, (n + 1) * 4).map((tag) => (
																	<View key={tag}>
																		<Text style={{ fontSize: 0 }}>{profile && ""}</Text>
																		<ColorBlock
																			name={tag}
																			weights={{ red: 200, green: 200, blue: 200 }}
																			boxId='3'
																		/>
																	</View>
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
										renderHoverContent={({ viewState }) => {
											const combinedStyles: ViewStyle[] = [
												styles.centeredContent,
												styles.colorBlock,
												getStyleForWeights(stagedWeights),
											];
											if (viewState.grabOffset) {
												combinedStyles.push({
													marginLeft: viewState.grabOffset.x - 40,
													marginTop: viewState.grabOffset.y - 30,
												});
											}
											if (viewState.dragStatus === DraxViewDragStatus.Dragging) {
												combinedStyles.push(styles.hoverDragging);
											}
											return (
												<View style={combinedStyles}>
													<Text style={styles.stagedCount}>{stagedText.length}</Text>
												</View>
											);
										}}
										onReceiveDragDrop={(event) => {
											const { text, weights, boxId } = event.dragged.payload
												?? { text: '?', weights: getEmptyWeights() };
											if (boxId == '1') {
												setStagedText([...stagedText, text]);
												setStartText(startText.filter(x => x !== text))
											} else if (boxId == '2') {
												setStagedText([...stagedText, text]);
												setReceivedText(receivedText.filter(x => x !== text))
											}

											return DraxSnapbackTargetPreset.None;
										}}
										onDragDrop={() => {
											setStagedText([]);
											setStagedWeights(getEmptyWeights());
										}}
										longPressDelay={200}
									/>
								</SafeAreaView>
								<TouchableOpacity onPress={onClickSendTag} style={{ marginTop: 20, marginLeft: "68%", width: 100, height: 33, backgroundColor: 'gray', borderRadius: 20, justifyContent: 'center', alignItems: 'center' }}>
									<Text style={{ color: 'white' }}>태그 저장</Text>
								</TouchableOpacity>
							</View>
							<View style={{ flex: 3 }}>
								<View style={{ flexDirection: 'row' }}>
									<View style={{ flex: 1 }}></View>
									<Text style={{ borderBottomColor: 'rgba(0.1,0.1,0.1,0.25)', borderBottomWidth: 1, flex: 15 }}></Text>
									<View style={{ flex: 1 }}></View>
								</View>
								<View>
									<Text style={{ fontSize: 25, color: 'rgba(0.1, 0.1, 0.1, 0.5)', fontWeight: 'bold', marginTop: 20, marginLeft: 30 }}>PlayList</Text>
								</View>
								<View>

									{playlist.map((list) => (
										<View style={{ flexDirection: 'row' }} key={list}>
											<View>
												<Image source={require('../images/playlisticon.jpg')} style={{ marginTop: 25, marginLeft: 35, width: 100, height: 100, borderRadius: 20 }} />
											</View>
											<View style={{ marginTop: 25, marginLeft: 20 }}>
												<Text key={list} style={{ fontSize: 17, color: 'rgba(0.1, 0.1, 0.1, 0.5)', fontWeight: 'bold' }}>{list}</Text>
												<TouchableOpacity><Text style={[rStyles.logoutbutton, { width: 90, height: 33 }]}> 재생하기</Text></TouchableOpacity>
											</View>
										</View>
									))}
								</View>
							</View>
						</View>
					</ScrollView>
				</View>
			</DraxProvider>

		</>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center'
	},
	centeredContent: {
		justifyContent: 'center',
		alignItems: 'center',
	},
	receivingZone: {
		borderRadius: 10,
		margin: 8,
		borderColor: 'rgb(34,139,34)',
		borderWidth: 2,
		width: '85%',
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
		width: 70,
		height: 30,
		borderRadius: 10,
		marginHorizontal: 8,
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
		borderWidth: 2,
		height: 135,
		width: '85%'
	},
	stagedCount: {
		fontSize: 18,
	},
});

export default ColorDragDrop;
