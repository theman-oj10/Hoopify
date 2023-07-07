import React, { useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Platform, Alert } from 'react-native';

const LoadingScreen = () => {

  return (
        <div style={containerStyle}>
      <iframe src="https://embed.lottiefiles.com/animation/4414"></iframe>
    </div>
  );
};

export default LoadingScreen
const containerStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'blue', // Change to your desired background color
  };


const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'pink',
  },
  container: {
    alignItems: 'center',
  },
  logo: {
    width: '70%',
    height: 100,
    borderRadius: 10,
    marginBottom: 40,
  },
  title: {
    fontSize: 80,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 10,
    color: '#333',
  },
  email: {
    fontSize: 16,
    marginBottom: 10,
    color: '#777',
  },
  uploadButton: {
    backgroundColor: '#4287f5',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  uploadButtonInner: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  uploadProgress: {
    fontSize: 16,
    marginBottom: 10,
    color: '#777',
  },
  signOutButton: {
    backgroundColor: '#f54242',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  statsButton: {
    backgroundColor: '#42f54a',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
});