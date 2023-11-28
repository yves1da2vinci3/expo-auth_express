import { View, Text } from 'react-native'
import React, { useContext, useState } from 'react'
import { AuthContext } from '../../context/AuthContext'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { useHttpClient } from '../../context/HttpClientContext'
import { set } from 'lodash'
import { useToast } from 'react-native-toast-notifications'

const Home = () => {
  const { user ,logout} = useContext(AuthContext)
  const { authAxios} = useHttpClient()
  const [datas,setDatas] = useState([])
  const toast = useToast()
  const fetchPrivate = async() => { 
    try {
      const {data} =  await authAxios.get('/auth/protected') 
      setDatas(data.dummyData)
    } catch (error) {
      console.log(error)
      toast.show(`${error.response.data.message}`, {
        type: 'custom',
        placement: 'bottom',
        duration: 2000,
        offset: 60,
        animationType: 'slide-in',
      });
    }
   }
  return (
    <View className='flex-1 bg-white' >
      <Text>Welcome back : {user.username}</Text>

      <TouchableOpacity onPress={()=> fetchPrivate()} style={{ height: 50, backgroundColor: '#1877f2', justifyContent: 'center', alignItems: 'center', borderRadius: 8, marginTop: 10 }}>
        <Text style={{ fontSize: 18, fontWeight: 'bold', color: 'white' }}>private call to the server</Text>
      </TouchableOpacity>
      {datas.length >0 && datas.map((datum,index)=> <Text className='h-5 px-2'  key={index} >
        {datum.message}
      </Text>)}
      <TouchableOpacity onPress={()=> logout()} style={{ height: 50, backgroundColor: '#FF6B6B', justifyContent: 'center', alignItems: 'center', borderRadius: 8, marginTop: 10 }}>
        <Text style={{ fontSize: 18, fontWeight: 'bold', color: 'white' }}>Se deconnecter</Text>
      </TouchableOpacity>

 
    </View>
  )
}

export default Home