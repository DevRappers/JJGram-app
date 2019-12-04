import React, { useState } from 'react';
import styled from 'styled-components';
import AuthButtton from '../../components/AuthButton';
import AuthInput from '../../components/AuthInput';
import useInput from '../../hooks/useInput';
import { Alert, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { LOG_IN } from './AuthQueries';
import { useMutation } from 'react-apollo-hooks';

const View = styled.View`
	justify-content: center;
	align-items: center;
	flex: 1;
`;

export default ({ navigation }) => {
	const emailInput = useInput('');
	const [ loading, setLoading ] = useState(false);
	const [ requestSecretMutation ] = useMutation(LOG_IN, {
		variables: {
			email: emailInput.value
		}
	});
	const handleLogin = async () => {
		const { value } = emailInput;
		// 이메일 유효성 검사
		const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		if (value === '') {
			return Alert.alert('이메일칸이 비었습니다.');
		} else if (!value.includes('@') || !value.includes('.')) {
			return Alert.alert('이메일 형식에 어긋납니다.');
		} else if (!emailRegex.test(value)) {
			return Alert.alert('이메일 형식에 어긋납니다.');
		}
		try {
			setLoading(true);
			const { data: { requestSecret } } = await requestSecretMutation();

			if (requestSecret) {
				Alert.alert('이메일로 전송된 시크릿코드를 확인해 주세요.');
				navigation.navigate('Confirm');
			} else {
				Alert.alert('가입되지 않은 이메일주소입니다.');
				navigation.navigate('Signup');
			}
		} catch (e) {
			console.log(e);
			Alert.alert('로그인 실패');
		} finally {
			setLoading(false);
		}
	};

	return (
		<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
			<View>
				<AuthInput
					{...emailInput}
					placeholder="Email"
					keyboardType="email-address"
					returnKeyType="send"
					onSubmitEditing={handleLogin}
					autoCorrect={false}
				/>
				<AuthButtton loading={loading} text="Log In" onPress={handleLogin} />
			</View>
		</TouchableWithoutFeedback>
	);
};
