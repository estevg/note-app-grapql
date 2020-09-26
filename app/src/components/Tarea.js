import React from 'react';
import { Text, ListItem, Left, Right, Icon, Toast } from 'native-base';
import { StyleSheet, Alert } from 'react-native';
import { gql, useMutation } from '@apollo/client';

const ACTUALIZAR_TAREA = gql`
	mutation actualizarTarea($id: ID!, $input: TareaInput, $estado: Boolean) {
		actualizarTarea(id: $id, input: $input, estado: $estado) {
			nombre
			id
			proyecto
			estado
		}
	}
`;

const ELIMINAR_TAREA = gql`
	mutation eliminarTarea($id: ID!) {
		eliminarTarea(id: $id)
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

const Tarea = ({ tarea, proyectoId }) => {
	const [ actualizarTarea ] = useMutation(ACTUALIZAR_TAREA);
	const [ eliminarTarea ] = useMutation(ELIMINAR_TAREA, {
		update(cache) {
			const { obtenerTarea } = cache.readQuery({
				query: OBTENER_TAREAS,
				variables: {
					input: {
						proyecto: proyectoId
					}
				}
			});
			cache.writeQuery({
				query: OBTENER_TAREAS,
				variables: {
					input: {
						proyecto: proyectoId
					}
				},
				data: {
					obtenerTarea: obtenerTarea.filter((tareaActual) => tareaActual.id !== tarea.id)
				}
			});
		}
	});

	const cambiarEstado = async () => {
		const { id } = tarea;

		try {
			const { data } = await actualizarTarea({
				variables: {
					id,
					input: {
						nombre: tarea.nombre
					},
					estado: !tarea.estado
				}
			});
			console.log(data);
		} catch (error) {
			console.log(error);
		}
	};

	const mostrarEliminar = () => {
		Alert.alert('Eliminar Tarea', 'Deseas eliminar esta tarea ?', [
			{
				text: 'Cancelar',
				style: 'cancel'
			},
			{
				text: 'Confirmar',
				onPress: () => eliminar()
			}
		]);
	};

	const eliminar = async () => {
		const { id } = tarea;

		try {
			const { data } = await eliminarTarea({
				variables: {
					id
				}
			});
			console.log(data);
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<React.Fragment>
			<ListItem onPress={() => cambiarEstado()} onLongPress={() => mostrarEliminar()}>
				<Left>
					<Text>{tarea.nombre}</Text>
				</Left>
				<Right>
					{tarea.estado ? (
						<Icon style={[ styles.icon, styles.completo ]} name="ios-checkmark-circle" />
					) : (
						<Icon style={[ styles.icon, styles.incompleto ]} name="ios-checkmark-circle" />
					)}
				</Right>
			</ListItem>
		</React.Fragment>
	);
};

const styles = StyleSheet.create({
	completo: {
		color: 'green'
	},
	incompleto: {
		color: '#E1E1E1'
	},
	icon: {
		fontSize: 32
	}
});

export default Tarea;
