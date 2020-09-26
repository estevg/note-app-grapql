import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Root } from 'native-base';

import Login from './src/view/Login';
import CrearCuenta from './src/view/CrearCuenta';
import Proyectos from './src/view/Proyectos';
import NuevoProyecto from './src/view/NuevoProyecto';
import Proyecto from './src/view/Proyecto';

const Stack = createStackNavigator();
const App = () => {
	return (
		<React.Fragment>
			<Root>
				<NavigationContainer>
					<Stack.Navigator>
						<Stack.Screen
							name="Login"
							component={Login}
							options={{
								title: 'Iniciar Session',
								headerShown: false
							}}
						/>
						<Stack.Screen
							name="CrearCuenta"
							component={CrearCuenta}
							options={{
								title: 'Crear Cuenta',
								headerStyle: {
									backgroundColor: '#28303b'
								},
								headerTintColor: '#fff',
								headerTitleStyle: {
									fontWeight: 'bold'
								}
							}}
						/>
						<Stack.Screen
							name="Proyectos"
							component={Proyectos}
							options={{
								title: 'Proyectos',
								headerStyle: {
									backgroundColor: '#28303b'
								},
								headerTintColor: '#fff',
								headerTitleStyle: {
									fontWeight: 'bold'
								}
							}}
						/>
						<Stack.Screen
							name="NuevoProyecto"
							component={NuevoProyecto}
							options={{
								title: 'Nuevo Proyecto',
								headerStyle: {
									backgroundColor: '#28303b'
								},
								headerTintColor: '#fff',
								headerTitleStyle: {
									fontWeight: 'bold'
								}
							}}
						/>
						<Stack.Screen
							name="Proyecto"
							component={Proyecto}
							options={({ route }) => ({
								title: route.params.proyecto.nombre,
								headerStyle: {
									backgroundColor: '#28303b'
								},
								headerTintColor: '#fff',
								headerTitleStyle: {
									fontWeight: 'bold'
								}
							})}
						/>
					</Stack.Navigator>
				</NavigationContainer>
			</Root>
		</React.Fragment>
	);
};

export default App;
console.disableYellowBox = true;
