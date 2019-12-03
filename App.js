import React, { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { AppLoading } from 'expo';
import { Asset } from 'expo-asset';
import * as Font from 'expo-font';
import { Text, View, AsyncStorage, TouchableOpacity } from 'react-native';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { persistCache } from 'apollo-cache-persist';
import ApolloClient from 'apollo-boost';
import { ThemeProvider } from 'styled-components';
import { ApolloProvider } from 'react-apollo-hooks';
import apolloClientOptions from './apollo';
import styles from './styles';

export default function App() {
	// 로딩관련, client관련, 로그인관련 state
	const [ loaded, setLoaded ] = useState(false);
	const [ client, setClient ] = useState(null);
	const [ isLoggedIn, setIsLoggedIn ] = useState(null);

	// AsyncStorage에서 여러 정보를 가져오는 함수
	const preLoad = async () => {
		try {
			// 폰트 불러오기
			await Font.loadAsync({
				...Ionicons.font
			});

			// 앱에 필요한 이미지를 불러옴
			await Asset.loadAsync([ require('./assets/logo.png') ]);
			const cache = new InMemoryCache();
			await persistCache({
				cache,
				storage: AsyncStorage
			});

			// 클라이언트 생성
			const client = new ApolloClient({
				cache,
				...apolloClientOptions
			});

			// 이전에 로그인되었었는지 상태를 확인함
			const isLoggedIn = await AsyncStorage.getItem('isLoggedIn');
			// AsyncStorage에 string형태로 저장되기 때문에 string으로 비교해줌
			if (isLoggedIn === null || isLoggedIn === 'false') {
				setIsLoggedIn(false);
			} else {
				setIsLoggedIn(true);
			}

			setLoaded(true);
			setClient(client);
		} catch (e) {
			console.log(e);
		}
	};

	// useEffect로 앱 시작시 preLoad함수를 호출함
	useEffect(() => {
		preLoad();
	}, []);

	// 로그인 함수
	const logUserIn = async () => {
		try {
			await AsyncStorage.setItem('isLoggedIn', 'true');
			setIsLoggedIn(true);
		} catch (e) {
			console.log(e);
		}
	};

	// 로그아웃 함수
	const logUserOut = async () => {
		try {
			await AsyncStorage.setItem('isLoggedIn', 'false');
			setIsLoggedIn(false);
		} catch (e) {
			console.log(e);
		}
	};

	// 로딩이 완료되고 client가 있으며 로그인상태가 null이 아닐경우 화면을 보여주고 그렇지 않을 경우 로딩창 출력
	return loaded && client && isLoggedIn !== null ? (
		<ApolloProvider client={client}>
			<ThemeProvider theme={styles}>
				<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
					{isLoggedIn === true ? (
						<TouchableOpacity onPress={logUserOut}>
							<Text>Log Out</Text>
						</TouchableOpacity>
					) : (
						<TouchableOpacity onPress={logUserIn}>
							<Text>Log In</Text>
						</TouchableOpacity>
					)}
				</View>
			</ThemeProvider>
		</ApolloProvider>
	) : (
		<AppLoading />
	);
}
