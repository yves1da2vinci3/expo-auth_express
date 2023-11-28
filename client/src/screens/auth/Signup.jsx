import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, TextInput } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { useNavigation } from '@react-navigation/native';
import { httpClientContext } from '../../context/HttpClientContext';
import { useToast } from 'react-native-toast-notifications';

const Signup = () => {
  const navigation = useNavigation();
  const { publicAxios } = useContext(httpClientContext);
  const { control, handleSubmit, setError, formState: { errors } } = useForm();
  const toast = useToast();
  const onSubmit = async (data) => {
    try {
      // Perform signup using data.email, data.userName, and data.password
      const response = await publicAxios.post('/auth/register', {
        email: data.email,
        username: data.username,
        password: data.password,
      });
      // Handle successful signup
      toast.show('Signup succeed', {
        type: 'success',
        placement: 'bottom',
        duration: 2000,
        offset: 60,
        animationType: 'slide-in',
      });
      navigation.navigate('login')
    } catch (error) {
      // Handle signup error and set error messages using setError
      toast.show(`${error.response.data.message}`, {
        type: 'custom',
        placement: 'bottom',
        duration: 2000,
        offset: 60,
        animationType: 'slide-in',
      });
      console.log(error);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: 'white', padding: 16 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold' }}>Enregistrement</Text>

      <Controller
        control={control}
        render={({ field : {onBlur,onChange,value} }) => (
          <TextInput
          onBlur={onBlur}
          onChangeText={value => onChange(value)}
          value={value}
            placeholder="Entrez votre mail"
            style={{ height: 50, backgroundColor: '#E5E7EB', borderRadius: 8, padding: 10, marginTop: 10 }}
          />
        )}
        name="email"
        rules={{
          required: 'Email is required',
          pattern: {
            value: /\S+@\S+\.\S+/,
            message: 'Invalid email address',
          },
        }}
        defaultValue=""
      />
      {errors.email && <Text style={{ color: 'red' }}>{errors.email.message}</Text>}

      <Controller
        control={control}
        render={({ field : {onBlur,onChange,value} }) => (
          <TextInput
            onBlur={onBlur}
            onChangeText={value => onChange(value)}
            value={value}
            placeholder="Entrez votre user Name"
            style={{ height: 50, backgroundColor: '#E5E7EB', borderRadius: 8, padding: 10, marginTop: 10 }}
          />
        )}
        name="username"
        rules={{ required: 'Username is required' }}
        defaultValue=""
      />
      {errors.username && <Text style={{ color: 'red' }}>{errors.username.message}</Text>}

      <Controller
        control={control}
        render={({ field : {onBlur,onChange,value} }) => (
          <TextInput
          onBlur={onBlur}
          onChangeText={value => onChange(value)}
          value={value}
            placeholder="Entrez votre mot de passe"
            secureTextEntry
            style={{ height: 50, backgroundColor: '#E5E7EB', borderRadius: 8, padding: 10, marginTop: 10 }}
          />
        )}
        name="password"
        rules={{
          required: 'Password is required',
          pattern: {
            value: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
            message: 'Password must be alphanumeric with at least 8 characters',
          },
        }}
        defaultValue=""
      />
      {errors.password && <Text style={{ color: 'red' }}>{errors.password.message}</Text>}

      <TouchableOpacity onPress={handleSubmit(onSubmit)} style={{ height: 50, backgroundColor: '#FF6B6B', justifyContent: 'center', alignItems: 'center', borderRadius: 8, marginTop: 10 }}>
        <Text style={{ fontSize: 18, fontWeight: 'bold', color: 'white' }}>S'enregistrer</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('login')} style={{ height: 50, justifyContent: 'center', alignItems: 'center', borderRadius: 8, marginTop: 10, backgroundColor: 'gray' }}>
        <Text style={{ fontSize: 18, fontWeight: 'bold', color: 'white' }}>Se connecter</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Signup;
