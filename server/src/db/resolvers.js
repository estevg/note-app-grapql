const Usuario = require('../models/Usuario');
const Proyecto = require('../models/Proyecto');
const Tarea = require('../models/Tarea');
const bcryptjs = require('bcryptjs');
require('dotenv').config({ path: 'variables.env' });

const jwt = require('jsonwebtoken');

// Crear token
const crearToken = (usuario, secreta, expiresIn) => {
	const { id, email, nombre } = usuario;

	return jwt.sign({ id, email, nombre }, secreta, { expiresIn });
};

const resolvers = {
	Query: {
		// Proyecto
		obtenerProyectos: async (_, {}, ctx) => {
			const proyectos = await Proyecto.find({ creador: ctx.usuario.id });

			return proyectos;
		},
		// Tarea
		obtenerTarea: async (_, { input }, ctx) => {
			// Revisar si la persona que trata de consultar, es el creador
			const tarea = await Tarea.find({ creador: ctx.usuario.id }).where('proyecto').equals(input.proyecto);

			return tarea;
		}
	},
	// Guardar usuario en nuestra bd
	Mutation: {
		// Proyecto
		crearUsuario: async (_, { input }) => {
			const { nombre, email, password, genero } = input;

			const existeUsuario = await Usuario.findOne({ email });

			if (existeUsuario) {
				throw new Error('El usuario ya esta registrado');
			}

			if (nombre === '' || email === '' || password === '' || genero === '') {
				throw new Error('Todos los campos son obligatorios');
			}

			try {
				// Hashear el password
				const salt = await bcryptjs.genSalt(10);
				input.password = await bcryptjs.hash(password, salt);

				// console.log(input)
				// Crear nueva instacia de usuario
				const nuevoUsuario = new Usuario(input);
				nuevoUsuario.save();
				return 'Usuario creado correctamente';
			} catch (error) {
				console.log(error);
			}
		},
		autenticarUsuario: async (_, { input }) => {
			const { email, password } = input;

			// Si el usuario existe
			const existeUsuario = await Usuario.findOne({ email });

			if (!existeUsuario) {
				throw new Error('El usuario no existe');
			}

			// Si el password es correcto
			const passwordCorrecto = await bcryptjs.compare(password, existeUsuario.password);
			if (!passwordCorrecto) {
				throw new Error('Password Incorrecto');
			}

			// Dar acceso a la app
			return {
				token: crearToken(existeUsuario, process.env.SECRETA, '2hr')
			};
		},
		nuevoProyecto: async (_, { input }, ctx) => {
			try {
				const proyecto = new Proyecto(input);

				// asociar al creador
				proyecto.creador = ctx.usuario.id;

				// almacenar en la bd
				const resultado = await proyecto.save();

				return resultado;
			} catch (error) {
				throw new Error('Debe autenticarse');
			}
		},
		actualizarProyecto: async (_, { id, input }, ctx) => {
			// Revisar si el proyecto existe
			let proyecto = await Proyecto.findById(id);

			if (!proyecto) {
				throw new Error('Proyecto no encontrado');
			}
			// Revisar si la persona que trata de editarlo, es el creador
			if (proyecto.creador.toString() !== ctx.usuario.id) {
				throw new Error('No tienes las credenciales para editar');
			}

			// Guardar el proyecto
			proyecto = await Proyecto.findOneAndUpdate({ _id: id }, input, { new: true });
			return proyecto;
		},
		eliminarProyecto: async (_, { id }, ctx) => {
			// Revisar si el proyecto existe
			let proyecto = await Proyecto.findById(id);

			if (!proyecto) {
				throw new Error('Proyecto no encontrado');
			}
			// Revisar si la persona que trata de eliminar, es el creador
			if (proyecto.creador.toString() !== ctx.usuario.id) {
				throw new Error('No tienes las credenciales para editar');
			}

			// Eliminar
			proyecto = await Proyecto.findOneAndDelete({ _id: id });

			return 'Proyecto eliminado';
		},

		// Terea
		nuevaTarea: async (_, { input }, ctx) => {
			try {
				const tarea = new Tarea(input);

				// Asociar el creador
				tarea.creador = ctx.usuario.id;

				// almacenar en la bd
				const resultado = await tarea.save();

				return resultado;
			} catch (error) {
				console.log(error);
			}
		},
		actualizarTarea: async (_, { id, input, estado }, ctx) => {
			// Revisar si la tarea existe
			let tarea = await Tarea.findById(id);

			if (!tarea) {
				throw new Error('La tarea no fue encontrada');
			}
			// Revisar si la persona que trata de editarlo, es el creador
			if (tarea.creador.toString() !== ctx.usuario.id) {
				throw new Error('No tienes las credenciales para editar');
			}

			// Cambiar el estado a la tarea
			input.estado = estado;

			// guardar tarea
			tarea = await Tarea.findOneAndUpdate({ _id: id }, input, { new: true });

			return tarea;
		},
		eliminarTarea: async (_, { id }, ctx) => {
			let tarea = await Tarea.findById(id);

			if (!tarea) {
				throw new Error('Tarea no encontrado');
			}
			// Revisar si la persona que trata de eliminar, es el creador
			if (tarea.creador.toString() !== ctx.usuario.id) {
				throw new Error('No tienes las credenciales para editar');
			}

			tarea = await Tarea.findOneAndDelete({ _id: id });

			return 'Tarea eliminada';
		}
	}
};

module.exports = resolvers;
