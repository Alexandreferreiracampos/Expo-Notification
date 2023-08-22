import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import * as Notifications from 'expo-notifications';
import { useEffect, useRef, useState } from 'react';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function App() {
  const [notification, setNotification] = useState(false);
  const [teste, setTeste] = useState('')
  const notificationListener = useRef();

  useEffect(()=>{
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
      const json = JSON.parse(notification.request.content.data.data)
      console.log(json[0].latitude)
      setTeste(json[0])
    });
  },[])

  async function handleCallNotification(){
    const {status} = await Notifications.getPermissionsAsync()
    if(status != "granted"){
    alert("Não permitido notificação")
     return;
    }

    let token = (await Notifications.getExpoPushTokenAsync())
    console.log(token)
    console.log(notification)
  }
  return (
    <View style={styles.container}>
      <Text>Open up App.tsx to start working on your app!</Text>
      <TouchableOpacity onPress={()=>handleCallNotification()}><Text>Notificação</Text></TouchableOpacity>
      <Text>{teste.categoriaAlerta}</Text>
      <Text>{teste.descricao}</Text>
      <Text>{teste.nome}</Text>
      <Text>{teste.latitude, teste.longitude}</Text>
      
      <StatusBar style="auto" />
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
