import React, { useState } from 'react';
import styled from 'styled-components';
import { TouchableWithoutFeedback, Keyboard } from 'react-native';
import AuthButton from '../../components/AuthButton';
import AuthInput from '../../components/AuthInput';
import useInput from '../../hooks/useInput';
import { Alert } from 'react-native';
import { useMutation } from 'react-apollo-hooks';
import { CREATE_ACCOUNT } from './AuthQueries';
import * as Facebook from 'expo-facebook';
import * as Google from 'expo-google-app-auth';

const View = styled.View`
	justify-content: center;
	align-items: center;
	flex: 1;
`;

const FBContainer = styled.View`
	margin-top: 25px;
	padding-top: 25px;
	border-top-width: 1px;
	border-top-color: ${(props) => props.theme.lightGreyColor};
	border-style: solid;
`;

export default ({ navigation }) => {
	const fNameInput = useInput('');
	const lNameInput = useInput('');
	const emailInput = useInput(navigation.getParam('email', ''));
	const nameInput = useInput('');
	const [ loading, setLoading ] = useState(false);
	const [ createAccountMutation ] = useMutation(CREATE_ACCOUNT, {
		variables: {
			name: nameInput.value,
			email: emailInput.value,
			firstName: fNameInput.value,
			lastName: lNameInput.value
		}
	});
	const handleSingup = async () => {
		const { value: email } = emailInput;
		const { value: fName } = fNameInput;
		const { value: lName } = lNameInput;
		const { value: name } = nameInput;
		const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		if (!emailRegex.test(email)) {
			return Alert.alert('이메일형식에 맞게 입력해주세요.');
		}
		if (fName === '') {
			return Alert.alert('성을 입력해주세요.');
		}
		if (name === '') {
			return Alert.alert('사용자이름을 입력해주세요.');
		}
		try {
			setLoading(true);
			const { data: { createAccount } } = await createAccountMutation();
			if (createAccount) {
				Alert.alert('회원가입완료!', '로그인해주세요.');
				navigation.navigate('Login', { email });
			}
		} catch (e) {
			console.log(e);
			Alert.alert('이미 존재하는 이름입니다.', '가입하신 이메일로 로그인해주세요.');
			navigation.navigate('Login', { email });
		} finally {
			setLoading(false);
		}
	};
	const fbLogin = async () => {
		try {
			setLoading(true);
			const { type, token } = await Facebook.logInWithReadPermissionsAsync('2885307264822472', {
				permissions: [ 'public_profile', 'email' ]
			});
			if (type === 'success') {
				// Get the user's name using Facebook's Graph API
				const response = await fetch(
					`https://graph.facebook.com/me?access_token=${token}&fields=id,last_name,first_name,email`
				);
				const { email, first_name, last_name } = await response.json();
				updateFormData(email, first_name, last_name);
				Alert.alert('Logged in!', `Hi ${(await response.json()).name}!`);
				setLoading(false);
			} else {
				// type === 'cancel'
			}
		} catch ({ message }) {
			alert(`Facebook Login Error: ${message}`);
			setLoading(false);
		}
	};
	const googleLogin = async () => {
		const GOOGLE_ID = '160434121506-33fm950jr4ihgpht18r1ccr6rfet9nrd.apps.googleusercontent.com';
		try {
			setLoading(true);
			const result = await Google.logInAsync({
				iosClientId: GOOGLE_ID,
				scopes: [ 'profile', 'email' ]
			});
			if (result.type === 'success') {
				const user = await fetch('https://www.googleapis.com/userinfo/v2/me', {
					headers: { Authorization: `Bearer ${result.accessToken}` }
				});
				const { email, family_name, given_name } = await user.json();
				updateFormData(email, family_name, given_name);
				setLoading(false);
			} else {
				return { cancelled: true };
			}
		} catch (e) {
			setLoading(false);
			return { error: true };
		} finally {
			setLoading(false);
		}
	};
	const updateFormData = (email, firstName, lastName) => {
		emailInput.setValue(email);
		fNameInput.setValue(firstName);
		lNameInput.setValue(lastName);
		const [ username ] = email.split('@');
		nameInput.setValue(username);
	};
	return (
		<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
			<View>
				<AuthInput {...fNameInput} placeholder="성" autoCapitalize="words" />
				<AuthInput {...lNameInput} placeholder="이름" autoCapitalize="words" />
				<AuthInput
					{...emailInput}
					placeholder="이메일"
					keyboardType="email-address"
					returnKeyType="send"
					autoCorrect={false}
				/>
				<AuthInput {...nameInput} placeholder="사용자이름" returnKeyType="send" autoCorrect={false} />
				<AuthButton loading={loading} onPress={handleSingup} text="회원가입" />
				<FBContainer>
					<AuthButton bgColor={'#2D4DA7'} loading={false} onPress={fbLogin} text="Facebook 연결" />
					<AuthButton bgColor={'#EE1922'} loading={false} onPress={googleLogin} text="Google 연결" />
				</FBContainer>
			</View>
		</TouchableWithoutFeedback>
	);
};
