import React from 'react';
import styled from 'styled-components';
import constants from '../../constants';
import AuthButtton from '../../components/AuthButton';

const View = styled.View`
	justify-content: center;
	align-items: center;
	flex: 1;
`;

const Image = styled.Image`
	width: ${constants.width / 2.5};
	margin-bottom: 0px;
`;

const Touchable = styled.TouchableOpacity``;

const LoginLink = styled.View``;

const LoginLinkText = styled.Text`
	color: ${(props) => props.theme.blueColor};
	margin-top: 20px;
	font-weight: 600;
`;

export default ({ navigation }) => (
	<View>
		<Image resizeMode={'contain'} source={require('../../assets/logo.png')} />
		<AuthButtton text={'Create New Account'} onPress={() => navigation.navigate('Signup')} />
		<Touchable onPress={() => navigation.navigate('Login')}>
			<LoginLink>
				<LoginLinkText>Log in</LoginLinkText>
			</LoginLink>
		</Touchable>
	</View>
);
