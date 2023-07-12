import React from 'react';
import { View, StyleSheet } from 'react-native';
import LottieView from 'lottie-react-native';

const LoadingScreen = () => {
  return (<div>
    <script src='https://unpkg.com/@lottiefiles/lottie-player@latest/dist/lottie-player.js'>
    </script>
<lottie-player src='https://lottie.host/ef7b3923-3976-4318-994d-c68ee7f18421/P2ikOGoFUc.json' background='Transparent' speed='1' style={{width: '300px', height: '300px'}} direction='1' mode='normal' loop controls autoplay hover>

</lottie-player>
  </div>
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
