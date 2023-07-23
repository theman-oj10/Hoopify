import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, Share } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Logo from '../SignInScreen/Images/Logo.png';
import axios from 'axios';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, query, orderBy, getDocs, limit, Timestamp, setDoc, addDoc, doc } from 'firebase/firestore';
import { auth } from '../../firebase';
import LoadingScreen from '../LoadingScreen/LoadingScreen';
import * as Location from 'expo-location';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCHLyLBe7Bh5Q48rUK2-x8-A6A2vxk0hdI",
  authDomain: "orbital-app-proto.firebaseapp.com",
  projectId: "orbital-app-proto",
  storageBucket: "orbital-app-proto.appspot.com",
  messagingSenderId: "965591983424",
  appId: "1:965591983424:web:759b1b999d60cfd6e6c6a5",
  measurementId: "G-JV5TKFE1BX"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const StatsPage = () => {
  //const [statsData, setStatsData] = useState(scoreData);
  // hotzone data
  const [totalShotsMade, setTotalShotsMade] = useState(0);
  const [totalShotsTaken, setTotalShotsTaken] = useState(0);
  const [paintShotsTaken, setPaintShotsTaken] = useState(0);
  const [paintShotsMade, setPaintShotsMade] = useState(0);
  const [freeThrowShotsMade, setFreeThrowShotsMade] = useState(0);
  const [freeThrowShotsTaken, setFreeThrowShotsTaken] = useState(0);
  const [midRangeShotsMade, setMidRangeShotsMade] = useState(0);
  const [midRangeShotsTaken, setMidRangeShotsTaken] = useState(0);
  const [threePointShotsMade, setThreePointShotsMade] = useState(0);
  const [threePointShotsTaken, setThreePointShotsTaken] = useState(0);


  // sub regions
  const [leftCornerThreeShotsMade, setLeftCornerThreeShotsMade] = useState(0);
  const [leftCornerThreeShotsTaken, setLeftCornerThreeShotsTaken] = useState(0);
  const [rightCornerThreeShotsMade, setRightCornerThreeShotsMade] = useState(0);
  const [rightCornerThreeShotsTaken, setRightCornerThreeShotsTaken] = useState(0);
  const [leftCornerShotsMade, setLeftCornerShotsMade] = useState(0);
  const [leftCornerShotsTaken, setLeftCornerShotsTaken] = useState(0);
  const [rightCornerShotsMade, setRightCornerShotsMade] = useState(0);
  const [rightCornerShotsTaken, setRightCornerShotsTaken] = useState(0);
  const [leftLowPostShotsMade, setLeftLowPostShotsMade] = useState(0);
  const [leftLowPostShotsTaken, setLeftLowPostShotsTaken] = useState(0);
  const [rightLowPostShotsMade, setRightLowPostShotsMade] = useState(0);
  const [rightLowPostShotsTaken, setRightLowPostShotsTaken] = useState(0);
  const [leftHighPostShotsMade, setLeftHighPostShotsMade] = useState(0);
  const [leftHighPostShotsTaken, setLeftHighPostShotsTaken] = useState(0);
  const [rightHighPostShotsMade, setRightHighPostShotsMade] = useState(0);
  const [rightHighPostShotsTaken, setRightHighPostShotsTaken] = useState(0);
  const [topKeyShotsMade, setTopKeyShotsMade] = useState(0);
  const [topKeyShotsTaken, setTopKeyShotsTaken] = useState(0);
  const [topKeyThreeShotsMade, setTopKeyThreeShotsMade] = useState(0);
  const [topKeyThreeShotsTaken, setTopKeyThreeShotsTaken] = useState(0);
  const [leftWingThreeShotsMade, setLeftWingThreeShotsMade] = useState(0);
  const [leftWingThreeShotsTaken, setLeftWingThreeShotsTaken] = useState(0);
  const [rightWingThreeShotsMade, setRightWingThreeShotsMade] = useState(0);
  const [rightWingThreeShotsTaken, setRightWingThreeShotsTaken] = useState(0);
  
  // field goal %
  const [paintFG, setPaintFG] = useState(0);
  const [midRangeFG, setMidRangeFG] = useState(0);
  const [threePointFG, setThreePointFG] = useState(0);
  const [freeThrowFG, setFreeThrowFG] = useState(0);
  const [leftCornerThreeFG, setLeftCornerThreeFG] = useState(0);
  const [rightCornerThreeFG, setRightCornerThreeFG] = useState(0);
  const [leftCornerFG, setLeftCornerFG] = useState(0);
  const [rightCornerFG, setRightCornerFG] = useState(0);
  const [leftLowPostFG, setLeftLowPostFG] = useState(0);
  const [rightLowPostFG, setRightLowPostFG] = useState(0);
  const [leftHighPostFG, setLeftHighPostFG] = useState(0);
  const [rightHighPostFG, setRightHighPostFG] = useState(0);
  const [topKeyFG, setTopKeyFG] = useState(0);
  const [topKeyThreeFG, setTopKeyThreeFG] = useState(0);
  const [leftWingThreeFG, setLeftWingThreeFG] = useState(0);
  const [rightWingThreeFG, setRightWingThreeFG] = useState(0);

  const [previousWorkoutScores, setPreviousWorkoutScores] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigation = useNavigation();

  const formatDateTime = (timestamp) => {
    const date = timestamp.toDate();
    const options = { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric' };
    return date.toLocaleString(undefined, options);
  };

  const fetchPreviousWorkoutScores = async () => {
    try {
      const scoresRef = collection(db, 'scores', auth.currentUser?.uid, 'workouts');
      const scoresQuery = query(scoresRef, orderBy('date', 'desc'), limit(3));
      const scoresSnapshot = await getDocs(scoresQuery);

      const scores = scoresSnapshot.docs.map((doc) => {
        const prevData = doc.data();
        const formattedDateTime = formatDateTime(prevData.date);
        return { ...prevData, date: formattedDateTime };
      });
      setPreviousWorkoutScores(scores);
    } catch (error) {
      console.log('Error fetching previous workout scores:', error);
    }
  };

  useEffect(() => {
    fetchPreviousWorkoutScores();
  }, []);

  const calculateFieldGoalPercentage = (attempts, makes) => {
    attempts = parseInt(attempts)
    makes = parseInt(makes)
    if (attempts === 0) {
      return 0;
    }
    const percentage = (makes / attempts) * 100;
    return percentage.toFixed(2);
  };

  const handleShare = async () => {
    const shareOptions = {
      message: `I made ${totalShotsMade} / ${totalShotsTaken} 🏀 today on Hoopify!`,
    };
    try {
      const ShareResponse = await Share.share(shareOptions);
    } catch (error) {
      console.log('Error => ', error);
    }
  };

  const fetchScore = async () => {
    try {
      setIsLoading(true); // Start loading state
  
      // Fetch data from Firestore
      const scoresRef = collection(db, 'scores', auth.currentUser?.uid, 'workouts');
      const scoresQuery = query(scoresRef, orderBy('date', 'desc'), limit(1));
      const scoresSnapshot = await getDocs(scoresQuery);
      const scores = scoresSnapshot.docs.map((doc) => doc.data());
  
      // Assuming scores is an array with a single object, extract that object
      const scoreData = scores[0]; // Modify this part based on your data structure
  
      //console.log(`StatsData: ${scoreData}`);
      // Set the state variables using the data from Firestore
      // Total shots and shot attempts
      setTotalShotsMade(scoreData.totalShotsMade);
      setTotalShotsTaken(scoreData.totalShotsTaken);

      // Paint shots
      setPaintShotsMade(scoreData.paintShotsMade);
      setPaintShotsTaken(scoreData.paintShotsTaken);

      // Free throw shots
      setFreeThrowShotsMade(scoreData.freeThrowShotsMade);
      setFreeThrowShotsTaken(scoreData.freeThrowShotsTaken);

      // Mid-range shots
      setMidRangeShotsMade(scoreData.midRangeShotsMade);
      setMidRangeShotsTaken(scoreData.midRangeShotsTaken);

      // Three-point shots
      setThreePointShotsMade(scoreData.threePointShotsMade);
      setThreePointShotsTaken(scoreData.threePointShotsTaken);

      // Left corner three-point shots
      setLeftCornerThreeShotsMade(scoreData.leftCornerThreeShotsMade);
      setLeftCornerThreeShotsTaken(scoreData.leftCornerThreeShotsTaken);

      // Right corner three-point shots
      setRightCornerThreeShotsMade(scoreData.rightCornerThreeShotsMade);
      setRightCornerThreeShotsTaken(scoreData.rightCornerThreeShotsTaken);

      // Left corner shots
      setLeftCornerShotsMade(scoreData.leftCornerShotsMade);
      setLeftCornerShotsTaken(scoreData.leftCornerShotsTaken);

      // Right corner shots
      setRightCornerShotsMade(scoreData.rightCornerShotsMade);
      setRightCornerShotsTaken(scoreData.rightCornerShotsTaken);

      // Left low post shots
      setLeftLowPostShotsMade(scoreData.leftLowPostShotsMade);
      setLeftLowPostShotsTaken(scoreData.leftLowPostShotsTaken);

      // Right low post shots
      setRightLowPostShotsMade(scoreData.rightLowPostShotsMade);
      setRightLowPostShotsTaken(scoreData.rightLowPostShotsTaken);

      // Left high post shots
      setLeftHighPostShotsMade(scoreData.leftHighPostShotsMade);
      setLeftHighPostShotsTaken(scoreData.leftHighPostShotsTaken);

      // Right high post shots
      setRightHighPostShotsMade(scoreData.rightHighPostShotsMade);
      setRightHighPostShotsTaken(scoreData.rightHighPostShotsTaken);

      // Top key shots
      setTopKeyShotsMade(scoreData.topKeyShotsMade);
      setTopKeyShotsTaken(scoreData.topKeyShotsTaken);

      // Top key three-point shots
      setTopKeyThreeShotsMade(scoreData.topKeyThreeShotsMade);
      setTopKeyThreeShotsTaken(scoreData.topKeyThreeShotsTaken);

      // Left wing three-point shots
      setLeftWingThreeShotsMade(scoreData.leftWingThreeShotsMade);
      setLeftWingThreeShotsTaken(scoreData.leftWingThreeShotsTaken);

      // Right wing three-point shots
      setRightWingThreeShotsMade(scoreData.rightWingThreeShotsMade);
      setRightWingThreeShotsTaken(scoreData.rightWingThreeShotsTaken);

      // Calculate and set field goal percentage for each shot type
      setPaintFG(calculateFieldGoalPercentage(scoreData.paintShotsMade, scoreData.paintShotsTaken));
      setFreeThrowFG(calculateFieldGoalPercentage(scoreData.freeThrowShotsMade, scoreData.freeThrowShotsTaken));
      setMidRangeFG(calculateFieldGoalPercentage(scoreData.midRangeShotsMade, scoreData.midRangeShotsTaken));
      setThreePointFG(calculateFieldGoalPercentage(scoreData.threePointShotsMade, scoreData.threePointShotsTaken));
      setLeftCornerThreeFG(calculateFieldGoalPercentage(scoreData.leftCornerThreeShotsMade, scoreData.leftCornerThreeShotsTaken));
      setRightCornerThreeFG(calculateFieldGoalPercentage(scoreData.rightCornerThreeShotsMade, scoreData.rightCornerThreeShotsTaken));
      setLeftCornerFG(calculateFieldGoalPercentage(scoreData.leftCornerShotsMade, scoreData.leftCornerShotsTaken));
      setRightCornerFG(calculateFieldGoalPercentage(scoreData.rightCornerShotsMade, scoreData.rightCornerShotsTaken));
      setLeftLowPostFG(calculateFieldGoalPercentage(scoreData.leftLowPostShotsMade, scoreData.leftLowPostShotsTaken));
      setRightLowPostFG(calculateFieldGoalPercentage(scoreData.rightLowPostShotsMade, scoreData.rightLowPostShotsTaken));
      setLeftHighPostFG(calculateFieldGoalPercentage(scoreData.leftHighPostShotsMade, scoreData.leftHighPostShotsTaken));
      setRightHighPostFG(calculateFieldGoalPercentage(scoreData.rightHighPostShotsMade, scoreData.rightHighPostShotsTaken));
      setTopKeyFG(calculateFieldGoalPercentage(scoreData.topKeyShotsMade, scoreData.topKeyShotsTaken));
      setTopKeyThreeFG(calculateFieldGoalPercentage(scoreData.topKeyThreeShotsMade, scoreData.topKeyThreeShotsTaken));
      setLeftWingThreeFG(calculateFieldGoalPercentage(scoreData.leftWingThreeShotsMade, scoreData.leftWingThreeShotsTaken));
      setRightWingThreeFG(calculateFieldGoalPercentage(scoreData.rightWingThreeShotsMade, scoreData.rightWingThreeShotsTaken));

      setIsLoading(false); // Stop loading state
    } catch (error) {
      console.log('Error fetching score:', error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchScore();
  }, []);

  return (
    <>
      {isLoading ? (
        <LoadingScreen />
      ) : (
        <View style={styles.container}>
          <Image source={Logo} style={styles.logo} resizeMode="contain" />
          <View style={styles.mainStatContainer}>
            <Text style={styles.mainFraction}>
              {totalShotsMade}/{totalShotsTaken}
            </Text>
            <Text style={styles.mainStatLabel}>Workout Results</Text>
          </View>

          <View style={styles.previousStatsContainer}>
            <Text style={styles.heading}>Previous Workout Scores</Text>
            {previousWorkoutScores.map((stat, index) => (
              <View key={index} style={styles.previousStatContainer}>
                <Text style={styles.previousStatDate}>{stat.date}</Text>
                <Text style={styles.previousStatScore}>
                  {stat.totalShotsMade}/{stat.totalShotsTaken}
                </Text>
              </View>
            ))}
          </View>

          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('HotZonePage', {
            paintFG,
            midRangeFG,
            threePointFG,
            freeThrowFG,
            leftCornerThreeFG,
            rightCornerThreeFG,
            leftCornerFG,
            rightCornerFG,
            leftLowPostFG,
            rightLowPostFG,
            leftHighPostFG,
            rightHighPostFG,
            topKeyFG,
            topKeyThreeFG,
            leftWingThreeFG,
            rightWingThreeFG,
          })}>
            <Text style={styles.buttonText}>View Hot Zone</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button} 
            onPress={() => navigation.navigate('HomePage')}
          >
            <Text style={styles.buttonText}>Hoopify More</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={handleShare}>
            <Text style={styles.buttonText}>Share</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('ReportPage')}
          >
            <Text style={styles.buttonText}>Show my progress</Text>
          </TouchableOpacity>
        </View>
      )}
    </>
  );

};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#98FB98',
  },
  logo: {
    width: '70%',
    height: 200,
    borderRadius: 10,
    marginBottom: 30,
  },
  mainStatContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  mainFraction: {
    fontSize: 48,
    fontWeight: 'bold',
    color: 'white',
  },
  mainStatLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  previousStatsContainer: {
    width: '100%',
    marginBottom: 20,
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'white',
  },
  previousStatContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  previousStatDate: {
    fontSize: 16,
    color: 'white',
  },
  previousStatScore: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  button: {
    backgroundColor: '#1E90FF',
    width: '100%',
    padding: 15,
    marginBottom: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
});

export default StatsPage;


