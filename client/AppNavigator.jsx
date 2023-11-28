import { View, Text } from 'react-native'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { NavigationContainer } from '@react-navigation/native'
import AuthStack from './src/navigators/AuthStack'
import Home from './src/screens/user/Home'
import * as SecureStore from 'expo-secure-store';
import { AuthContext } from './src/context/AuthContext'
import Spinner from './src/components/Spinner'
const AppNavigator = () => {
    const Stack = createStackNavigator()
    const [status, setStatus] = useState('loading');
    const {setAuthState,authState} = useContext(AuthContext)
  const loadJWT = useCallback(async () => {
    try {
      const value = await SecureStore.getItemAsync('token'); 
      const jwt = JSON.parse(value);
      console.log("sd :",jwt)
      setAuthState({
        accessToken: jwt.accessToken || null,
        refreshToken: jwt.refreshToken || null,
        authenticated: jwt.accessToken !== null,
      });
      setStatus('success');
    } catch (error) {
      setStatus('error');
      console.log(`SecureStore Error: ${error.message}`);
      setAuthState({
        accessToken: null,
        refreshToken: null,
        authenticated: false,
      });
    }
  }, []);

  useEffect(() => {
    loadJWT();
  }, [loadJWT]);

  if (status === 'loading') {
    return (
      <Spinner/>
    );
  }
  return (
    <NavigationContainer>
        <Stack.Navigator screenOptions={{headerShown:false}} >
        { authState?.authenticated === true ? (
          <Stack.Screen options={{ headerShown: false }} name='user' component={Home} />
        ) : (
          <Stack.Screen options={{ headerShown: false }} name='auth' component={AuthStack} />
        )}
        </Stack.Navigator>

    </NavigationContainer>
  )
}

export default AppNavigator