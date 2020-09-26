import React, { useState } from 'react';
import { View } from 'react-native';
import { Container, Button, Text, H1, Input, Form, Item, Toast } from 'native-base';
import { useNavigation } from '@react-navigation/native';
import global from '../styles/global';

import { gql, useMutation } from '@apollo/client';

const NUEVA_CUENTA = gql`
	mutation crearUsuario($input: UsuarioInput) {
		crearUsuario(input: $input)
	}
`;

const Login = () => {
	// State del formulario
	const [ nombre, guardarNombre ] = useState('');
	const [ email, guardarEmail ] = useState('');
	const [ password, guardarPassword ] = useState('');

	const [ mensaje, guardarMensaje ] = useState(null);

	// Navigation
	const navigation = useNavigation();

	// Mutation de Apollo
	const [ crearUsuario ] = useMutation(NUEVA_CUENTA);

	// Cuando el usuario presinar a crear cuenta
	const handleSubmit = async () => {
		// Validar
		if (nombre === '' || email === '' || password === '') {
			guardarMensaje('Todos los campos son obligatorios');
			return;
		}

		// Password al menos 6 caracteres
		if (password.length < 6) {
			guardarMensaje('El password debe ser al menos de 6 caracteres');
			return;
		}
		// Guardar usuario

		try {
			const { data } = await crearUsuario({
				variables: {
					input: {
						nombre,
						email,
						password,
						genero: 'Masculino'
					}
				}
			});
			guardarMensaje(data.crearUsuario);
			navigation.navigate('Login');
		} catch (error) {
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
						<Input placeholder="Nombre" onChangeText={(text) => guardarNombre(text)} />
					</Item>
					<Item inlineLabel last style={global.input}>
						<Input placeholder="Email" onChangeText={(text) => guardarEmail(text)} />
					</Item>
					<Item inlineLabel last style={global.input}>
						<Input
							secureTextEntry={true}
							placeholder="Password"
							onChangeText={(text) => guardarPassword(text)}
						/>
					</Item>
				</Form>
				<Button square block style={global.button} onPress={() => handleSubmit()}>
					<Text style={global.buttonText}>Crear Cuenta</Text>
				</Button>
				{mensaje && mostrarMensaje()}
			</View>
		</Container>
	);
};

export default Login;
