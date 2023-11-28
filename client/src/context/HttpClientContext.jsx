import React, {createContext, useContext} from 'react';
import axios from 'axios';
import {AuthContext} from './AuthContext';
import createAuthRefreshInterceptor from 'axios-auth-refresh';
import * as SecureStore from 'expo-secure-store';
export const httpClientContext = createContext();
const {Provider} = httpClientContext;

export const useHttpClient = () => {
  return useContext(httpClientContext);
};
const HttpClientProvider = ({children}) => {
  const authContext = useContext(AuthContext);

  const apiUrl = `http://192.168.x.x:3000`
  const authAxios = axios.create({
    baseURL: `${apiUrl}/api`,
  });

  const publicAxios = axios.create({
    baseURL:`${apiUrl}/api`,
  });
   const accesTokeObj = authContext.getAccessToken()
  console.log('accessToken: ' + accesTokeObj)
  console.log('accessToken 2: ' + authContext.authState.accessToken)
  authAxios.interceptors.request.use(
    config => {
      if (!config.headers.Authorization) {
        config.headers.Authorization = `Bearer ${authContext.authState.accessToken}`;
      }

      return config;
    },
    error => {
      return Promise.reject(error);
    },
  );

  const refreshAuthLogic = async failedRequest => {
    const data = {
      refreshToken: authContext.authState.refreshToken,
    };

    const options = {
      method: 'POST',
      data,
      url: `${apiUrl}/api/auth/refresh-token`,
    };

    try {
      const tokenRefreshResponse = await axios(options);
      failedRequest.response.config.headers.Authorization =
        'Bearer ' + tokenRefreshResponse.data.accessToken;

      authContext.setAuthState({
        ...authContext.authState,
        accessToken: tokenRefreshResponse.data.accessToken,
      });

      await SecureStore.setItemAsync('token', JSON.stringify({
        accessToken: tokenRefreshResponse.data.accessToken,
        refreshToken: authContext.authState.refreshToken,
      }))
      
      return await Promise.resolve();
    } catch (e) {
      authContext.setAuthState({
        accessToken: null,
        refreshToken: null,
      });
    }
  };

  createAuthRefreshInterceptor(authAxios, refreshAuthLogic, {});

  return (
    <Provider
      value={{
        authAxios,
        publicAxios,
        apiUrl
      }}>
      {children}
    </Provider>
  );
};

export default HttpClientProvider;