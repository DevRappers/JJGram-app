import React, { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { AppLoading } from 'expo';
import * as Font from 'expo-font';
import { Asset } from 'expo-asset';
import { Text, View, AsyncStorage } from 'react-native';
import { InMomoryCache, InMemoryCache } from 'apollo-cache-inmemory';
import { persistCache } from 'apollo-cache-persist';
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from 'react-apollo-hooks';
import apolloClientOptions from './apollo';

export default function App() {
	// 로딩관련과 client관련
	const [ loaded, setLoaded ] = useState(false);
	const [ client, setClient ] = useState(null);

	const preLoad = async () => {
		try {
			await Font.loadAsync({
				...Ionicons.font
			});
			await Asset.loadAsync([ require('./assets/logo.png') ]);

			// cache로 이전에 사용했던 정보 저장해놓고 불러올때 사용하는 부분
			const cache = new InMemoryCache();
			await persistCache({
				cache,
				storage: AsyncStorage
			});
			const client = new ApolloClient({
				cache,
				...apolloClientOptions
			});

			setLoaded(true);
			setClient(client);
		} catch (e) {
			console.log(e);
		}
	};

	useEffect(() => {
		preLoad();
	}, []);

	return loaded && client ? (
		<ApolloProvider client={client}>
			<View>
				<Text>Hello</Text>
			</View>
		</ApolloProvider>
	) : (
		<AppLoading />
	);
}
