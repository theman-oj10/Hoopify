import React from 'react';
import { View, StyleSheet } from 'react-native';
import LottieView from 'lottie-react-native';

const LoadingScreen = () => {
  return (
    <View style={styles.container}>
      <LottieView
        source={'https://assets10.lottiefiles.com/packages/lf20_jGw3lx.json'} // Replace with the path to your animation JSON file
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
    backgroundColor: 'blue',
  },
  animation: {
    width: '70%',
    height: 100,
    borderRadius: 10,
  },
});
