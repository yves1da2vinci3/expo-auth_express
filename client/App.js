import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import AppNavigator from './AppNavigator';
import HttpClientProvider from './src/context/HttpClientContext';
import AuthProvider from './src/context/AuthContext';
import Toast from 'react-native-toast-message';
import { ToastProvider } from 'react-native-toast-notifications'

export default function App() {
  return (
    <View className="flex-1 bg-white px-3 pt-10 "  >
      <AuthProvider>
      <HttpClientProvider>
    <ToastProvider  renderToast={(toastOptions) => <View className={`h-12  w-2/3  shadow   ${ toastOptions.type === "success"? 'border-l-green-500' : "border-l-red-500" } border-l-8 min-w-70 flex  px-3 justify-center rounded-lg bg-white pl-4  `}><Text className={ `font-semibold `}> {toastOptions.message}</Text></View> }   >
        
      <AppNavigator />

        </ToastProvider>
     
      </HttpClientProvider>
      </AuthProvider>
     
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
