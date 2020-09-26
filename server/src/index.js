// 1. Importar
const { ApolloServer, gql } = require('apollo-server');
const typeDefs = require('./db/schema');
const resolvers = require('./db/resolvers');
const conectarDB = require('./config/db');

require('dotenv').config({ path: 'variables.env' });
const jwt = require('jsonwebtoken');

// Conectar db
conectarDB();

// 2. Crear servidor
// Colocamos en orden nuestro typeDefs, resolvers, context
//
const server = new ApolloServer({
	typeDefs,
	resolvers,
	context: ({ req }) => {
		const token = req.headers['authorization'] || '';
		if (token) {
			try {
				const usuario = jwt.verify(token.replace('Bearer ', ''), process.env.SECRETA);
				console.log(usuario);
				return {
					usuario
				};
			} catch (error) {
				console.log(error);
			}
		}
	}
});

// 3.  Arrancar servidor de apollo
server.listen().then(({ url }) => {
	console.log(`Server listo en la url ${url}`);
});
