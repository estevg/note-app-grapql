import React, { useState } from 'react';
import { View } from 'react-native';
import { Container, Button, Text, H1, Input, Form, Item, Toast } from 'native-base';
import { useNavigation } from '@react-navigation/native';
import global from '../styles/global';

import { gql, useMutation } from '@apollo/client';
import AsyncStorage from '@react-native-community/async-storage';

const AUTENTICAR_USUARIO = gql`
	mutation autenticarUsuario($input: AutenticarInput) {
		autenticarUsuario(input: $input) {
			token
		}
	}
`;

const Login = () => {
	const navigation = useNavigation();

	// State del formulario
	const [ email, guardarEmail ] = useState('');
	const [ password, guardarPassword ] = useState('');
	const [ mensaje, guardarMensaje ] = useState(null);

	const [ autenticarUsuario ] = useMutation(AUTENTICAR_USUARIO);

	const _handleSubmit = async () => {
		// Validar
		if (email === '' || password === '') {
			guardarMensaje('Todos los campos son obligatorios');
			return;
		}

		try {
			const { data } = await autenticarUsuario({
				variables: {
					input: {
						email,
						password
					}
				}
			});
			const { token } = data.autenticarUsuario;

			// Colocar token en el Storage
			await AsyncStorage.setItem('token', token);

			// Redireccionar a proyectos
			navigation.navigate('Proyectos');
		} catch (error) {
			console.log(error);
			guardarMensaje(error.message);
		}
	};

	// Mostrar el mensaje
	const mostrarMensaje = () => {
		Toast.show({
			text: mensaje,
			buttonText: 'OK',
			duration: 5000
		});
	};

	return (
		<Container style={[ global.contenedor, { backgroundColor: '#e84347' } ]}>
			<View style={global.contenido}>
				<H1 style={global.titulo}>Uptask</H1>
				<Form>
					<Item inlineLabel last style={global.input}>
						<Input
							autoCorrect={false}
							autoCapitalize="none"
							placeholder="Email"
							onChangeText={(text) => guardarEmail(text)}
						/>
					</Item>
					<Item inlineLabel last style={global.input}>
						<Input
							secureTextEntry={true}
							placeholder="Password"
							onChangeText={(text) => guardarPassword(text)}
							autoCapitalize="words"
						/>
					</Item>
				</Form>
				<Button square block style={global.button} onPress={() => _handleSubmit()}>
					<Text style={global.buttonText}>Iniciar Sessión</Text>
				</Button>
				{mensaje && mostrarMensaje()}
				<Text onPress={() => navigation.navigate('CrearCuenta')} style={global.enlace}>
					Crear cuenta
				</Text>
			</View>
		</Container>
	);
};

export default Login;
