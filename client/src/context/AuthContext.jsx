import React, {createContext,useEffect,useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
export const AuthContext = createContext()

 function AuthProvider({ children }) {
  const [user, setUser] = useState({});
  const [authState, setAuthState] = useState({
    accessToken: null,
    refreshToken: null,
    authenticated: null,
  });

  const checkUserInformation = async () => {
    const userStringfied = await AsyncStorage.getItem('userInfo');
    const user = JSON.parse(userStringfied);
    if (user) {
      setUser(user);
    }
  }

  const logout = async () => {
    await SecureStore.deleteItemAsync('token'); // Delete the token using SecureStore
    setAuthState({
      accessToken: null,
      refreshToken: null,
      authenticated: false,
    });
  };

  useEffect(() => {
    checkUserInformation();
  }, []);

  const getAccessToken = async () => {
    console.log("log from authContext",authState.accessToken)
      return authState.accessToken;
  };

  const setSession = async (data) => {
    console.log('from context:', data);
    setUser(data);
    await AsyncStorage.setItem('userInfo', JSON.stringify(data));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setSession,
        authState,
        getAccessToken,
        setAuthState,
        logout,
      }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;