import React from 'react';
import { View } from 'react-native';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import Home from '../screens/Tabs/Home';
import Notifications from '../screens/Tabs/Notifications';
import Profile from '../screens/Tabs/Profile';
import Search from '../screens/Tabs/Search';
import { createStackNavigator } from 'react-navigation-stack';
import MessagesLink from '../components/MessagesLink';

// 헤더를 만들어주기 위한 함수로 tabnavigation의 있는 정보가 들어오면 스택네비게이션으로 반환해줌
// tab네비게이션을 스택네비게이션으로 만들어주는 과정
const stackFactory = (initialRoute, customConfig) =>
	createStackNavigator({ InitialRout: { screen: initialRoute, navigationOptions: { ...customConfig } } });

export default (TabNavigation = createBottomTabNavigator({
	Home: {
		screen: stackFactory(Home, {
			title: 'Home',
			headerRight: <MessagesLink />
		})
	},
	Search: {
		screen: stackFactory(Search, {
			title: 'Search'
		})
	},
	Add: {
		screen: () => <View />,
		navigationOptions: {
			tabBarOnPress: ({ navigation }) => navigation.navigate('PhotoNavigation')
		}
	},
	Notifications: {
		screen: stackFactory(Notifications, {
			title: 'Notifications'
		})
	},
	Profile: {
		screen: stackFactory(Profile, {
			title: 'Profile'
		})
	}
}));
