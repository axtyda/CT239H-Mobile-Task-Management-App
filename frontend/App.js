import { View, Text } from 'react-native'
import React from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Navigation from './Navigation/Navigation'
import InitialScreen from './Screens/InitialScreen/InitialScreen';
import AddTask from './Screens/Task/AddTask';
import Task from './Screens/Task/Task';
import * as Notifications from 'expo-notifications';

const Stack = createStackNavigator();

const initializeNotifications = async () => {
  await Notifications.requestPermissionsAsync();
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  });
};

initializeNotifications();

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