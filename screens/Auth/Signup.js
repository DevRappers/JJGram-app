import React, { useState } from 'react';
import styled from 'styled-components';
import { TouchableWithoutFeedback, Keyboard } from 'react-native';
import AuthButton from '../../components/AuthButton';
import AuthInput from '../../components/AuthInput';
import useInput from '../../hooks/useInput';
import { Alert } from 'react-native';
import { useMutation } from 'react-apollo-hooks';
import { CREATE_ACCOUNT } from './AuthQueries';

const View = styled.View`
	justify-content: center;
	align-items: center;
	flex: 1;
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
			</View>
		</TouchableWithoutFeedback>
	);
};
