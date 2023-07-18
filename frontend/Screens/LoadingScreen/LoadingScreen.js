import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import LottieView from 'lottie-react-native';

const LoadingScreen = () => {
  return (
    <View style={styles.container}>
      <LottieView
        source={require('../LoadingScreen/animation_ljzx6p74.json')} 
        autoPlay
        loop
        style={styles.animation}
      />
      <LottieView
        source={require('../LoadingScreen/animation_ljzy1ap8')} 
        autoPlay
        loop
        style={styles.animation}
      />
    </View>
  );
};

export default LoadingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'pink',
  },
  animation: {
    width: '70%',
    height: 350,
    borderRadius: 10,
  },
  text: {
    fontSize: 50
  }
});