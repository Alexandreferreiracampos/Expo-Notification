import { StatusBar } from 'expo-status-bar';
import * as React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import * as Notifications from 'expo-notifications';
import { useEffect, useRef, useState } from 'react';
import * as Clipboard from 'expo-clipboard';

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
  const [token, setToken] = useState('');
  const [copiedText, setCopiedText] = React.useState('');

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
    alert("Token") 
    console.log(token.data)
    await Clipboard.setStringAsync(token.data);
    setToken(token.data)
  }
  
  const copyToClipboard = async () => {
    await Clipboard.setStringAsync(token);
  };

  const fetchCopiedText = async () => {
    const text = await Clipboard.getStringAsync();
    alert(text)
  };

  return (
    <View style={styles.container}>
      <StatusBar style='auto'/>
      <Text>Open up App.tsx to start working on your app!</Text>
      <TouchableOpacity onPress={()=>handleCallNotification()}><Text>Notificação</Text></TouchableOpacity>
      <TouchableOpacity onPress={()=>copyToClipboard()}><Text>Copiar Token</Text></TouchableOpacity>
      <TouchableOpacity onPress={()=>fetchCopiedText()}><Text>Mostrar Token</Text></TouchableOpacity>
      <Text>{teste.categoriaAlerta}</Text>
      <Text>{teste.descricao}</Text>
      <Text>{teste.nome}</Text>
      <Text>{teste.latitude, teste.longitude}</Text>
      
      <Text>{token}</Text>
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
