import 'react-native-gesture-handler';
import React from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import UserPage from './screens/UserPage';
import MainPage from './screens/MainPage';
import Search from './screens/Search';
import None from './screens/None';

const { Navigator, Screen } = createBottomTabNavigator();
const MyTheme = {
	dark: true,
	colors: {
	  primary: 'white',
	  card: 'rgb(0,0,0)',
	  text: 'white',
	  border: 'rgb(199, 199, 204)',
	  notification: 'white',
	},
  };

const App = () => {
	return (
		<>
			<StatusBar barStyle="dark-content" />
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
