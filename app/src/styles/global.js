import { StyleSheet } from 'react-native';

const global = StyleSheet.create({
	contenedor: {
		flex: 1
	},
	contenido: {
		flexDirection: 'column',
		justifyContent: 'center',
		marginHorizontal: '2.5%',
		flex: 1
	},
	titulo: {
		textAlign: 'center',
		marginBottom: 20,
		fontSize: 32,
		fontWeight: 'bold',
		color: '#fff'
	},
	subtitulo: {
		textAlign: 'center',
		marginBottom: 20,
		fontSize: 26,
		fontWeight: 'bold',
		color: '#fff',
		marginTop: 20
	},
	input: {
		backgroundColor: '#fff',
		marginBottom: 20
	},
	button: {
		backgroundColor: '#28303b'
	},
	buttonText: {
		textTransform: 'uppercase',
		fontWeight: 'bold',
		color: '#fff',
		textAlign: 'center'
	},
	enlace: {
		color: '#fff',
		marginTop: 60,
		textTransform: 'uppercase',
		textAlign: 'center'
	}
});

export default global;
