import React from 'react';
import { View } from 'react-native';
import { useIsLoggedIn } from '../AuthContext';
import AuthNavigation from '../navigation/AuthNavigation';
import TabNavigation from '../navigation/TabNavigation';

export default () => {
	// 컨텍스트함수를 사용
	const isLoggedIn = true;
	return <View style={{ flex: '1' }}>{isLoggedIn ? <TabNavigation /> : <AuthNavigation />}</View>;
};
