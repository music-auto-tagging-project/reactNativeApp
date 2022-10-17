import 'react-native-gesture-handler';
import React, {useContext, useEffect} from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import UserPage from './screens/UserPage';
import MainPage from './screens/MainPage';
import Search from './screens/Search';

import {CoreContext} from './context/CoreManagement';

const { Navigator, Screen } = createBottomTabNavigator();
const MyTheme : any = {
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
	console.log(result.tag);
	return (
		<>
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
	);
};

export default App;
