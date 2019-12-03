import { View } from 'react-native';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import Home from '../screens/Home';
import Notifications from '../screens/Notifications';
import Profile from '../screens/Profile';
import Search from '../screens/Search';

export default (TabNavigation = createBottomTabNavigator({
	Home,
	Search,
	Add: {
		screen: View,
		navigationOptions: {
			tabBarOnPress: ({ navigation }) => navigation.navigate('PhotoNavigation')
		}
	},
	Notifications,
	Profile
}));
