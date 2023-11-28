import { View, Text } from 'react-native'
import React from 'react'
import {createStackNavigator} from '@react-navigation/stack'
import Login from '../screens/auth/Login';
import Signup from '../screens/auth/Signup';
const AuthStack = () => {
    const Stack = createStackNavigator();
  return (
   <Stack.Navigator screenOptions={{headerShown: false}} >
    <Stack.Screen name='login' component={Login} />
    <Stack.Screen name='signup' component={Signup} />
   </Stack.Navigator>

  )
}

export default AuthStack


