import React from 'react';
import { View, Platform } from 'react-native';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import Home from '../screens/Tabs/Home';
import Notifications from '../screens/Tabs/Notifications';
import Profile from '../screens/Tabs/Profile';
import Search from '../screens/Tabs/Search';
import { createStackNavigator } from 'react-navigation-stack';
import MessagesLink from '../components/MessagesLink';
import NavIcon from '../components/NavIcon';
import { stackStyles } from './config';

// 헤더를 만들어주기 위한 함수로 tabnavigation의 있는 정보가 들어오면 스택네비게이션으로 반환해줌
// tab네비게이션을 스택네비게이션으로 만들어주는 과정
const stackFactory = (initialRoute, customConfig) =>
	createStackNavigator({
		InitialRout: {
			screen: initialRoute,
			navigationOptions: {
				...customConfig,
				headerStyle: { ...stackStyles }
			}
		}
	});

export default (TabNavigation = createBottomTabNavigator(
	{
		Home: {
			screen: stackFactory(Home, {
				headerRight: <MessagesLink />,
				headerTitle: <NavIcon name="logo-instagram" size={36} />
			}),
			navigationOptions: {
				tabBarIcon: ({ focused }) => (
					<NavIcon focused={focused} name={Platform.OS === 'ios' ? 'ios-home' : 'md-home'} />
				)
			}
		},
		Search: {
			screen: stackFactory(Search, {
				title: 'Search'
			}),
			navigationOptions: {
				tabBarIcon: ({ focused }) => (
					<NavIcon focused={focused} name={Platform.OS === 'ios' ? 'ios-search' : 'md-search'} />
				)
			}
		},
		Add: {
			screen: () => <View />,
			navigationOptions: {
				tabBarOnPress: ({ navigation }) => navigation.navigate('PhotoNavigation'),
				tabBarIcon: ({ focused }) => (
					<NavIcon
						focused={focused}
						size={32}
						name={Platform.OS === 'ios' ? 'ios-add-circle-outline' : 'md-add-circle-outline'}
					/>
				)
			}
		},
		Notifications: {
			screen: stackFactory(Notifications, {
				title: 'Notifications'
			}),
			navigationOptions: {
				tabBarIcon: ({ focused }) => (
					<NavIcon
						focused={focused}
						name={
							Platform.OS === 'ios' ? focused ? (
								'ios-heart'
							) : (
								'ios-heart-empty'
							) : focused ? (
								'md-heart'
							) : (
								'md-heart-empty'
							)
						}
					/>
				)
			}
		},
		Profile: {
			screen: stackFactory(Profile, {
				title: 'Profile'
			}),
			navigationOptions: {
				tabBarIcon: ({ focused }) => (
					<NavIcon focused={focused} name={Platform.OS === 'ios' ? 'ios-person' : 'md-person'} />
				)
			}
		}
	},
	{
		tabBarOptions: {
			showLabel: false,
			style: {
				backgroundColor: '#FAFAFA'
			}
		}
	}
));
