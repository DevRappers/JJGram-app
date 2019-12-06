import { createStackNavigator } from 'react-navigation-stack';
import Messages from '../screens/Message/Messages';
import Message from '../screens/Message/Message';
import { stackStyles } from './config';

export default createStackNavigator(
	{
		Messages,
		Message
	},
	{
		defaultNavigationOptions: {
			headerStyle: {
				...stackStyles
			}
		}
	}
);
