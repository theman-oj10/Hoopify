import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TextInput, KeyboardAvoidingView, ScrollView, TouchableOpacity } from 'react-native';
import Logo from './Images/Logo.png';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase';
import { useNavigation } from '@react-navigation/native';

const SignInScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        navigation.replace('HomePage');
      }
    });
    return unsubscribe;
  }, []);

  const handleLogin = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then(userCredentials => {
        const user = userCredentials.user;
        console.log('Logged in with:', user.email);
      })
      .catch(error => alert(error.message));
  };

  const handleRegister = () => {
    navigation.navigate('RegisterPage');
  };

  return (
    <KeyboardAvoidingView style={styles.root} behavior="padding">
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>hoopify</Text>
        <Image source={Logo} style={styles.logo} resizeMode="contain" />

        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#888"
          value={email}
          onChangeText={text => setEmail(text)}
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#888"
          secureTextEntry
          value={password}
          onChangeText={text => setPassword(text)}
        />

        <TouchableOpacity onPress={handleLogin} style={styles.button}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleRegister} style={[styles.button, styles.registerButton]}>
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};
  
  const styles = StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: 'pink',
      paddingHorizontal: 20,
      justifyContent: 'center',
    },
    container: {
      flexGrow: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    title: {
      fontSize: 50,
      fontWeight: 'bold',
      marginBottom: 20,
      color: 'blue',
      textTransform: 'uppercase',
      letterSpacing: 3,
    },
    logo: {
      width: '70%',
      height: 200,
      borderRadius: 10,
      marginBottom: 40,
    },
    input: {
      backgroundColor: '#fff',
      width: '100%',
      borderColor: '#e8e8e8',
      borderWidth: 1,
      borderRadius: 5,
      paddingHorizontal: 15,
      marginTop: 10,
      marginBottom: 20,
      fontSize: 16,
      color: '#555',
    },
    button: {
      backgroundColor: 'blue',
      width: '100%',
      paddingVertical: 14,
      borderRadius: 10,
      alignItems: 'center',
      marginTop: 10,
    },
    registerButton: {
      backgroundColor: '#2196f3',
      marginTop: 20,
    },
    buttonText: {
      color: 'white',
      fontSize: 16,
      fontWeight: 'bold',
    },
  });
  
  export default SignInScreen;
