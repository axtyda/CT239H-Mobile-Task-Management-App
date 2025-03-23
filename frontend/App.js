import { View, Text } from 'react-native'
import React from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Navigation from './Navigation/Navigation'
import InitialScreen from './Screens/InitialScreen/InitialScreen';
import AddTask from './Screens/Task/AddTask';
import Task from './Screens/Task/Task';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='InitialScreen' screenOptions={{ headerShown: false }}>
        <Stack.Screen name='InitialScreen' component={InitialScreen} />
        <Stack.Screen name='MainNavigation' component={Navigation} />
        <Stack.Screen name="AddTask" component={AddTask} />
        <Stack.Screen name="Task" component={Task}/>
      </Stack.Navigator>
    </NavigationContainer>
  )
}