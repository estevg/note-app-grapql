import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { Text, Container, Button, H2, Item, Input, Toast, Form, Content, List } from 'native-base';
import globalStyles from '../styles/global';

import { gql, useMutation, useQuery } from '@apollo/client';

import Tarea from '../components/Tarea';

const GUARDAR_TAREA = gql`
	mutation nuevaTarea($input: TareaInput) {
		nuevaTarea(input: $input) {
			nombre
			id
			proyecto
			estado
		}
	}
`;

const OBTENER_TAREAS = gql`
	query obtenerTarea($input: ProyectoIDInput) {
		obtenerTarea(input: $input) {
			id
			nombre
			estado
		}
	}
`;

const Proyecto = ({ route }) => {
	// State
	const [ nombre, guardarNombre ] = useState('');
	const [ mensaje, guardarMensaje ] = useState(null);
	// ID del Proyecto
	const { id } = route.params.proyecto;

	// Apollo obtener tareas
	const { data, loading, error } = useQuery(OBTENER_TAREAS, {
		variables: {
			input: {
				proyecto: id
			}
		}
	});

	// Apollo crear tareas
	const [ nuevaTarea ] = useMutation(GUARDAR_TAREA, {
		update(cache, { data: { nuevaTarea } }) {
			const { obtenerTarea } = cache.readQuery({
				query: OBTENER_TAREAS,
				variables: {
					input: {
						proyecto: id
					}
				}
			});
			cache.writeQuery({
				query: OBTENER_TAREAS,
				variables: {
					input: {
						proyecto: id
					}
				},
				data: { obtenerTarea: [ ...obtenerTarea, nuevaTarea ] }
			});
		}
	});

	const handleSubmit = async () => {
		if (nombre.trim() === '') {
			guardarMensaje('El nombre de la tarea es obligatorio');
			return;
		}

		try {
			const { data } = await nuevaTarea({
				variables: {
					input: {
						nombre,
						proyecto: id
					}
				}
			});

			guardarNombre('');
			guardarMensaje('Tarea guardada correctamente');
			setTimeout(() => {
				guardarMensaje(null);
			}, 1000);
		} catch (error) {
			console.log(error);
		}
	};

	const mostrarAlerta = () => {
		Toast.show({
			text: mensaje,
			buttonText: 'OK',
			duration: 5000
		});
	};

	if (loading) return <Text>Cargando...</Text>;
	console.log(data);

	return (
		<Container style={[ globalStyles.contenedor, { backgroundColor: '#e84347' } ]}>
			<Form style={{ marginHorizontal: '2.5%', marginTop: 20 }}>
				<Item inlineLabel last style={globalStyles.input}>
					<Input value={nombre} placeholder="Nombre tarea" onChangeText={(e) => guardarNombre(e)} />
				</Item>
				<Button style={globalStyles.button} square block onPress={() => handleSubmit()}>
					<Text>Crear tarea</Text>
				</Button>
			</Form>
			<H2 style={globalStyles.subtitulo}>Tareas: {route.params.proyecto.nombre}</H2>
			<Content>
				<List style={styles.contenido}>
					{data.obtenerTarea.map((tarea) => <Tarea key={tarea.id} tarea={tarea} proyectoId={id} />)}
				</List>
			</Content>
			{mensaje && mostrarAlerta()}
		</Container>
	);
};

const styles = StyleSheet.create({
	contenido: {
		backgroundColor: '#FFF',
		marginHorizontal: '2.5%'
	}
});

export default Proyecto;
