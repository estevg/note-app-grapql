import React, { useState } from 'react';
import { View } from 'react-native';
import globalStyles from '../styles/global';
import { Text, Container, Button, H1, Form, Input, Item, Toast } from 'native-base';
import { gql, useMutation } from '@apollo/client';
import { useNavigation } from '@react-navigation/native';

const NUEVO_PROYECTO = gql`
	mutation nuevoProyecto($input: ProyectoInput) {
		nuevoProyecto(input: $input) {
			nombre
			id
		}
	}
`;

const OBTENER_PROYECTOS = gql`
	query obtenerProyectos {
		obtenerProyectos {
			id
			nombre
		}
	}
`;

const NuevoProyecto = () => {
	const navigation = useNavigation();
	// State del mensaje
	const [ mensaje, guardarMensaje ] = useState(null);
	const [ nombre, guardarNombre ] = useState('');

	// apollo y actualizar la cache de apollo
	const [ nuevoProyecto ] = useMutation(NUEVO_PROYECTO, {
		update(cache, { data: { nuevoProyecto } }) {
			const { obtenerProyectos } = cache.readQuery({ query: OBTENER_PROYECTOS });
			cache.writeQuery({
				query: OBTENER_PROYECTOS,
				data: { obtenerProyectos: obtenerProyectos.concat([ nuevoProyecto ]) }
			});
		}
	});

	// Validar crear proyecto
	const handleSubmit = async () => {
		if (nombre.trim() === '') {
			guardarMensaje('El nombre del proyecto es obligatorio');
			return;
		}

		try {
			const { data } = await nuevoProyecto({
				variables: {
					input: {
						nombre
					}
				}
			});
			guardarMensaje('Proyecto creado correctamente');

			console.log(data);
			navigation.navigate('Proyectos');
		} catch (error) {
			guardarMensaje(error.message);

			console.log(error);
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
		<Container style={[ globalStyles.contenedor, { backgroundColor: '#E84334' } ]}>
			<View style={globalStyles.contenido}>
				<H1 style={globalStyles.subtitulo}>Nuevo Proyecto</H1>
				<Form>
					<Item inlineLabel last style={globalStyles.input}>
						<Input placeholder="Nombre del Proyecto" onChangeText={(e) => guardarNombre(e)} />
					</Item>
				</Form>
				<Button style={[ globalStyles.button, { marginTop: 30 } ]} square block onPress={() => handleSubmit()}>
					<Text style={globalStyles.buttonText}>Crear Proyecto</Text>
				</Button>
				{mensaje && mostrarMensaje()}
			</View>
		</Container>
	);
};

export default NuevoProyecto;
