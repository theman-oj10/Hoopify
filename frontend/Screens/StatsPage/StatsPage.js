import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, Share } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Logo from '../SignInScreen/Images/Logo.png';
import axios from 'axios';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, query, orderBy, getDocs, limit } from 'firebase/firestore';
import { auth } from '../../firebase';
import LoadingScreen from '../LoadingScreen/LoadingScreen';

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

  const calculateFieldGoalPercentage = () => {
    if (totalShotsTaken === 0) {
      return '0%';
    }
    const percentage = (totalShotsMade / totalShotsTaken) * 100;
    return `${percentage.toFixed(2)}%`;
  };

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

  const fetchScore = async () => {
    try {
      setIsLoading(true); // Start loading state

      const response = await axios.get('http://127.0.0.1:5000/api/video-analysis');
      const scoreData = response.data;
      setTotalShotsMade(scoreData.total.shotsMade);
      setTotalShotsTaken(scoreData.total.shotsTaken);

      setIsLoading(false); // Stop loading state
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
            style={[styles.button, styles.uploadButton]}
            onPress={() => navigation.navigate('HomePage')}
          >
            <Text style={styles.buttonText}>Hoopify More</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={handleShare}>
            <Text style={styles.buttonText}>Share</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.uploadButton]}
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
    backgroundColor: 'white',
    width: '100%',
    padding: 15,
    marginBottom: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  uploadButton: {
    backgroundColor: '#1E90FF',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E90FF',
  },
});

export default StatsPage;
