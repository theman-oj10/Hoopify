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
  const [totalShotsMade, setTotalShotsMade] = useState(0);
  const [totalShotsTaken, setTotalShotsTaken] = useState(0);
  // all the hotzones data
  const [paintFG, setPaintFG] = useState(0);
  const [midRangeFG, setMidRangeFG] = useState(0);
  const [threePointFG, setThreePointFG] = useState(0);
  const [freeThrowFG, setFreeThrowFG] = useState(0);

  // sub regions
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
  const [isLoading, setIsLoading] = useState(false);
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
        const data = doc.data();
        const formattedDateTime = formatDateTime(data.date);
        return { ...data, date: formattedDateTime };
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

  const calculateImprovement = (currFG, prevFG) => {
    // how are the scores formatted in firestore?
  }

  const handleViewHotZone = () => {
    console.log('View Hot Zone');
  };

  const handleShare = async () => {
    const shareOptions = {
      message: `I made ${totalShotsMade} / ${totalShotsTaken} shots today`,
    };
    try {
      const ShareResponse = await Share.share(shareOptions);
    } catch (error) {
      console.log('Error => ', error);
    }
  };

  // async function GetCurrentLocation() {
  //   let { status } = await Location.requestForegroundPermissionsAsync();
  
  //   if (status !== 'granted') {
  //     Alert.alert(
  //       'Permission not granted',
  //       'Allow the app to use location service.',
  //       [{ text: 'OK' }],
  //       { cancelable: false }
  //     );
  //     return;
  //   }
  
  //   try {
  //     let { coords } = await Location.getCurrentPositionAsync();
  
  //     if (coords) {
  //       const { latitude, longitude } = coords;
  //       let response = await Location.reverseGeocodeAsync({
  //         latitude,
  //         longitude,
  //       });
  
  //       for (let item of response) {
  //         let address = `${item.name}, ${item.street}, ${item.postalCode}, ${item.city}`;
  //         // console.log(address);
  
  //         try {
  //           const totalShotsMade = 10;
  //           const totalShotsTaken = 15;
  //           const paintShotsMade = 5;
  //           const paintShotsTaken = 8;
  //           const freeThrowShotsMade = 7;
  //           const freeThrowShotsTaken = 10;
  //           const midRangeShotsMade = 3;
  //           const midRangeShotsTaken = 5;
  //           const threePointShotsMade = 4;
  //           const threePointShotsTaken = 7;
  //           const leftCornerThreeShotsMade = 2;
  //           const leftCornerThreeShotsTaken = 3;
  //           const rightCornerThreeShotsMade = 1;
  //           const rightCornerThreeShotsTaken = 2;
  //           const leftCornerShotsMade = 1;
  //           const leftCornerShotsTaken = 2;
  //           const rightCornerShotsMade = 3;
  //           const rightCornerShotsTaken = 4;
  //           const leftLowPostShotsMade = 2;
  //           const leftLowPostShotsTaken = 3;
  //           const rightLowPostShotsMade = 1;
  //           const rightLowPostShotsTaken = 2;
  //           const leftHighPostShotsMade = 4;
  //           const leftHighPostShotsTaken = 5;
  //           const rightHighPostShotsMade = 3;
  //           const rightHighPostShotsTaken = 4;
  //           const topKeyShotsMade = 6;
  //           const topKeyShotsTaken = 9;
  //           const topKeyThreeShotsMade = 5;
  //           const topKeyThreeShotsTaken = 8;
  //           const leftWingThreeShotsMade = 3;
  //           const leftWingThreeShotsTaken = 5;
  //           const rightWingThreeShotsMade = 2;
  //           const rightWingThreeShotsTaken = 4;
  
  //           const currentDate = Timestamp.fromDate(new Date());
  
  //           const collectionRef = collection(db, 'scores', auth.currentUser?.uid, 'workouts');
  //           const data = {
  //             email: auth.currentUser?.email,
  //             location: address,
  //             totalShotsMade: totalShotsMade,
  //             totalShotsTaken: totalShotsTaken,
  //             paintShotsMade: paintShotsMade,
  //             paintShotsTaken: paintShotsTaken,
  //             freeThrowShotsMade: freeThrowShotsMade,
  //             freeThrowShotsTaken: freeThrowShotsTaken,
  //             midRangeShotsMade: midRangeShotsMade,
  //             midRangeShotsTaken: midRangeShotsTaken,
  //             threePointShotsMade: threePointShotsMade,
  //             threePointShotsTaken: threePointShotsTaken,
  //             leftCornerThreeShotsMade: leftCornerThreeShotsMade,
  //             leftCornerThreeShotsTaken: leftCornerThreeShotsTaken,
  //             rightCornerThreeShotsMade: rightCornerThreeShotsMade,
  //             rightCornerThreeShotsTaken: rightCornerThreeShotsTaken,
  //             leftCornerShotsMade: leftCornerShotsMade,
  //             leftCornerShotsTaken: leftCornerShotsTaken,
  //             rightCornerShotsMade: rightCornerShotsMade,
  //             rightCornerShotsTaken: rightCornerShotsTaken,
  //             leftLowPostShotsMade: leftLowPostShotsMade,
  //             leftLowPostShotsTaken: leftLowPostShotsTaken,
  //             rightLowPostShotsMade: rightLowPostShotsMade,
  //             rightLowPostShotsTaken: rightLowPostShotsTaken,
  //             leftHighPostShotsMade: leftHighPostShotsMade,
  //             leftHighPostShotsTaken: leftHighPostShotsTaken,
  //             rightHighPostShotsMade: rightHighPostShotsMade,
  //             rightHighPostShotsTaken: rightHighPostShotsTaken,
  //             topKeyShotsMade: topKeyShotsMade,
  //             topKeyShotsTaken: topKeyShotsTaken,
  //             topKeyThreeShotsMade: topKeyThreeShotsMade,
  //             topKeyThreeShotsTaken: topKeyThreeShotsTaken,
  //             leftWingThreeShotsMade: leftWingThreeShotsMade,
  //             leftWingThreeShotsTaken: leftWingThreeShotsTaken,
  //             rightWingThreeShotsMade: rightWingThreeShotsMade,
  //             rightWingThreeShotsTaken: rightWingThreeShotsTaken,
  //             date: currentDate
  //           };
  //           const docRef = await addDoc(collectionRef, data);
  //           console.log('Document added with ID:', docRef.id);
  //         } catch (error) {
  //           console.error('Error adding document:', error);
  //         }
  //       }
  //     }
  //   } catch (error) {
  //     console.log('Error getting location:', error);
  //   }
  // }

  async function GetCurrentLocation() {
    let { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== 'granted') {
      Alert.alert(
        'Permission not granted',
        'Allow the app to use location service.',
        [{ text: 'OK' }],
        { cancelable: false }
      );
      return;
    }

    try {
      let { coords } = await Location.getCurrentPositionAsync();

      if (coords) {
        const { latitude, longitude } = coords;
        let response = await Location.reverseGeocodeAsync({
          latitude,
          longitude,
        });

        for (let item of response) {
          let address = `${item.name}, ${item.street}, ${item.postalCode}, ${item.city}`;
          // console.log(address);

          try {
            // Fetch the score value from the Flask web app
            const response = await fetch('https://hoopbackend-unmihbju4a-as.a.run.app/api/video-analysis');
            const datas = await response.json();

            const totalShotsMade = datas.total.shotsMade;
            const totalShotsTaken = datas.total.shotsTaken;
            const paintShotsMade = datas.paint.shotsMade;
            const paintShotsTaken = datas.paint.shotsTaken;
            const freeThrowShotsMade = datas.free_throw.shotsMade;
            const freeThrowShotsTaken = datas.free_throw.shotsTaken;
            const midRangeShotsMade = datas.mid_range.shotsMade;
            const midRangeShotsTaken = datas.mid_range.shotsTaken;
            const threePointShotsMade = datas.three_point.shotsMade;
            const threePointShotsTaken = datas.three_point.shotsTaken;
            const leftCornerThreeShotsMade = datas.left_corner_three.shotsMade;
            const leftCornerThreeShotsTaken = datas.left_corner_three.shotsTaken;
            const rightCornerThreeShotsMade = datas.right_corner_three.shotsMade;
            const rightCornerThreeShotsTaken = datas.right_corner_three.shotsTaken;
            const leftCornerShotsMade = datas.left_corner.shotsMade;
            const leftCornerShotsTaken = datas.left_corner.shotsTaken;
            const rightCornerShotsMade = datas.right_corner.shotsMade;
            const rightCornerShotsTaken = datas.right_corner.shotsTaken;
            const leftLowPostShotsMade = datas.left_low_post.shotsMade;
            const leftLowPostShotsTaken = datas.left_low_post.shotsTaken;
            const rightLowPostShotsMade = datas.right_low_post.shotsMade;
            const rightLowPostShotsTaken = datas.right_low_post.shotsTaken;
            const leftHighPostShotsMade = datas.left_high_post.shotsMade;
            const leftHighPostShotsTaken = datas.left_high_post.shotsTaken;
            const rightHighPostShotsMade = datas.right_high_post.shotsMade;
            const rightHighPostShotsTaken = datas.right_high_post.shotsTaken;
            const topKeyShotsMade = datas.top_key.shotsMade;
            const topKeyShotsTaken = datas.top_key.shotsTaken;
            const topKeyThreeShotsMade = datas.top_key_three.shotsMade;
            const topKeyThreeShotsTaken = datas.top_key_three.shotsTaken;
            const leftWingThreeShotsMade = datas.left_wing_three.shotsMade;
            const leftWingThreeShotsTaken = datas.left_wing_three.shotsTaken;
            const rightWingThreeShotsMade = datas.right_wing_three.shotsMade;
            const rightWingThreeShotsTaken = datas.right_wing_three.shotsTaken;


            // const totalShotsMade = 10;
            // const totalShotsTaken = 15;
            const currentDate = Timestamp.fromDate(new Date());

            const collectionRef = collection(db, 'scores', auth.currentUser?.uid, 'workouts');
            const documentId = collectionRef.id;
            const data = {
              email: auth.currentUser?.email,
              location: address,
              totalShotsMade: totalShotsMade,
              totalShotsTaken: totalShotsTaken,
              paintShotsMade: paintShotsMade,
              paintShotsTaken: paintShotsTaken,
              freeThrowShotsMade: freeThrowShotsMade,
              freeThrowShotsTaken: freeThrowShotsTaken,
              midRangeShotsMade: midRangeShotsMade,
              midRangeShotsTaken: midRangeShotsTaken,
              threePointShotsMade: threePointShotsMade,
              threePointShotsTaken: threePointShotsTaken,
              leftCornerThreeShotsMade: leftCornerThreeShotsMade,
              leftCornerThreeShotsTaken: leftCornerThreeShotsTaken,
              rightCornerThreeShotsMade: rightCornerThreeShotsMade,
              rightCornerThreeShotsTaken: rightCornerThreeShotsTaken,
              leftCornerShotsMade: leftCornerShotsMade,
              leftCornerShotsTaken: leftCornerShotsTaken,
              rightCornerShotsMade: rightCornerShotsMade,
              rightCornerShotsTaken: rightCornerShotsTaken,
              leftLowPostShotsMade: leftLowPostShotsMade,
              leftLowPostShotsTaken: leftLowPostShotsTaken,
              rightLowPostShotsMade: rightLowPostShotsMade,
              rightLowPostShotsTaken: rightLowPostShotsTaken,
              leftHighPostShotsMade: leftHighPostShotsMade,
              leftHighPostShotsTaken: leftHighPostShotsTaken,
              rightHighPostShotsMade: rightHighPostShotsMade,
              rightHighPostShotsTaken: rightHighPostShotsTaken,
              topKeyShotsMade: topKeyShotsMade,
              topKeyShotsTaken: topKeyShotsTaken,
              topKeyThreeShotsMade: topKeyThreeShotsMade,
              topKeyThreeShotsTaken: topKeyThreeShotsTaken,
              leftWingThreeShotsMade: leftWingThreeShotsMade,
              leftWingThreeShotsTaken: leftWingThreeShotsTaken,
              rightWingThreeShotsMade: rightWingThreeShotsMade,
              rightWingThreeShotsTaken: rightWingThreeShotsTaken,
              date: currentDate
            };

            await addDoc(collectionRef, data);
            console.log('Document added with ID:', documentId);
          } catch (error) {
            console.error('Error adding document:', error);
          }
        }
      }
    } catch (error) {
      console.log('Error getting location:', error);
    }
  }

  const fetchScore = async () => {
    try {
      const response = await axios.get('https://hoopbackend-unmihbju4a-as.a.run.app/api/video-analysis');
      setIsLoading(true); // Start loading state
      const scoreData = response.data;
      setTotalShotsMade(scoreData.total.shotsMade);
      setTotalShotsTaken(scoreData.total.shotsTaken);

      setPaintFG(calculateFieldGoalPercentage(scoreData.paint.shotsMade, scoreData.paint.shotsTaken))
      setFreeThrowFG(calculateFieldGoalPercentage(scoreData.free_throw.shotsMade, scoreData.free_throw.shotsTaken))
      setMidRangeFG(calculateFieldGoalPercentage(scoreData.mid_range.shotsMade, scoreData.mid_range.shotsTaken))
      setThreePointFG(calculateFieldGoalPercentage(scoreData.three_point.shotsMade, scoreData.three_point.shotsTaken))
      
      setLeftCornerThreeFG(calculateFieldGoalPercentage(scoreData.left_corner_three.shotsMade, scoreData.left_corner_three.shotsTaken))
      setRightCornerThreeFG(calculateFieldGoalPercentage(scoreData.right_corner_three.shotsMade, scoreData.right_corner_three.shotsTaken))
      setLeftCornerFG(calculateFieldGoalPercentage(scoreData.left_corner.shotsMade, scoreData.left_corner.shotsTaken))
      setRightCornerFG(calculateFieldGoalPercentage(scoreData.right_corner.shotsMade, scoreData.right_corner.shotsTaken))
      setLeftLowPostFG(calculateFieldGoalPercentage(scoreData.left_low_post.shotsMade, scoreData.left_low_post.shotsTaken))
      setRightLowPostFG(calculateFieldGoalPercentage(scoreData.right_low_post.shotsMade, scoreData.right_low_post.shotsTaken))
      setLeftHighPostFG(calculateFieldGoalPercentage(scoreData.left_high_post.shotsMade, scoreData.left_high_post.shotsTaken))
      setRightHighPostFG(calculateFieldGoalPercentage(scoreData.right_high_post.shotsMade, scoreData.right_high_post.shotsTaken))
      setTopKeyFG(calculateFieldGoalPercentage(scoreData.top_key.shotsMade, scoreData.top_key.shotsTaken))
      setTopKeyThreeFG(calculateFieldGoalPercentage(scoreData.top_key_three.shotsMade, scoreData.top_key_three.shotsTaken))
      setLeftWingThreeFG(calculateFieldGoalPercentage(scoreData.left_wing_three.shotsMade, scoreData.left_wing_three.shotsTaken))
      setRightWingThreeFG(calculateFieldGoalPercentage(scoreData.right_wing_three.shotsMade, scoreData.right_wing_three.shotsTaken))


      setIsLoading(false); // Stop loading state
      GetCurrentLocation();
    } catch (error) {
      console.log('Error fetching score:', error);
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

          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('HotZonePage')}>
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
