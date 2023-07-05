import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import SignInScreen from './Screens/SignInScreen';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomePage from './Screens/HomePage/HomePage';
import { auth } from './firebase';
import StatsPage from './Screens/StatsPage/StatsPage';
import ReportPage from './Screens/ReportPage/ReportPage';
import HotZonePage from './Screens/HotZonePage/HotZonePage';
import Leaderboard from './Screens/Leaderboard/Leaderboard';
<<<<<<< HEAD
=======
import SelectRim from './Screens/SelectRim/SelectRim';
>>>>>>> reorg

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen options={{ headerShown: false }} name="Sign-In" component={SignInScreen} />
        <Stack.Screen options={{ headerShown: false }} name="HomePage" component={HomePage} />
        <Stack.Screen options={{ headerShown: false }} name="StatsPage" component={StatsPage} />
        <Stack.Screen options={{ headerShown: false }} name="ReportPage" component={ReportPage} />
        <Stack.Screen options={{ headerShown: false }} name="HotZonePage" component={HotZonePage} />
        <Stack.Screen name="Leaderboard" component={Leaderboard} />
<<<<<<< HEAD
=======
        <Stack.Screen options={{ headerShown: false }} name="SelectRim" component={SelectRim} />
>>>>>>> reorg
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: 'pink',
  },
});
