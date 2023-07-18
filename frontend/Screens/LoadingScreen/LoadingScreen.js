import React, { useEffect, useRef } from 'react';
import { View, Platform, StyleSheet } from 'react-native';
import LottieView from 'lottie-react-native';
//import Lottie from 'lottie-web';

const LoadingScreen = () => {

  // if (Platform.OS === 'web') {
  //   const animationRef = useRef(null); // Add this line to declare the animationRef

  // useEffect(() => {
  //   const animation = Lottie.loadAnimation({
  //     container: animationRef.current,
  //     renderer: 'svg', // Use 'svg' renderer for web
  //     loop: true,
  //     autoplay: true,
  //     animationData: require('../LoadingScreen/animation_ljzx6p74.json'),
  //     // Other Lottie options can be added here
  //   });

  //   // Cleanup the animation when the component unmounts
  //   return () => {
  //     animation.destroy();
  //   };
  // }, []);
  //   return (
  //     <div style={styles.container}>
  //       <div ref={animationRef} style={styles.animation}></div>
  //     </div>
  //   );
  // } else {
    return (
      <View style={styles.container}>
        <LottieView
          source={require('../LoadingScreen/animation_ljzx6p74.json')}
          autoPlay
          loop
          style={styles.animation}
        />
        <LottieView
          source={require('../LoadingScreen/animation_ljzy1ap8.json')}
          autoPlay
          loop
          style={styles.animation}
        />
      </View>
    );
  }
//};

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
    fontSize: 50,
  },
});

export default LoadingScreen;
