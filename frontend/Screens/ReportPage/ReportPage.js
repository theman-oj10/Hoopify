import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Share } from 'react-native';
import axios from 'axios';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, query, orderBy, getDocs, limit, addDoc } from 'firebase/firestore';
import { auth } from '../../firebase';

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

const ReportPage = () => {
  const [reportData, setReportData] = useState(null);
  const [previousWorkoutScores, setPreviousWorkoutScores] = useState([]);

  useEffect(() => {
    fetchReportData()
      .then((data) => {
        setReportData(data);
      })
      .catch((error) => {
        console.log('Error fetching report data:', error);
      });

    fetchPreviousWorkoutScores();
  }, []);

  const fetchReportData = async () => {
    // Simulated API response
    return {
      total: { shotsMade: 45, shotsTaken: 60 },
      paint: { shotsMade: 20, shotsTaken: 30 },
      free_throw: { shotsMade: 10, shotsTaken: 12 },
      mid_range: { shotsMade: 8, shotsTaken: 15 },
      three_point: { shotsMade: 7, shotsTaken: 20 },
    };
  };

  const formatDateTime = (timestamp) => {
    const date = timestamp.toDate();
    const options = { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric' };
    return date.toLocaleString(undefined, options);
  };

  const fetchPreviousWorkoutScores = async () => {
    try {
      const scoresRef = collection(db, 'scores', auth.currentUser?.uid, 'workouts');
      const scoresQuery = query(scoresRef, orderBy('date', 'desc'), limit(2));
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

  const calculateImprovement = (current, previous) => {
    return ((current - previous) / previous) * 100;
  };

  const calculateFieldGoalPercentage = (shotsMade, shotsTaken) => {
    return ((shotsMade / shotsTaken) * 100).toFixed(2);
  };

  const handleShare = async () => {
    const shareOptions = {
      message: generateDocumentContent(),
    };
    try {
      const ShareResponse = await Share.share(shareOptions);
      if (ShareResponse.action === Share.sharedAction) {
        if (ShareResponse.activityType) {
          saveSharedDocument(ShareResponse.activityType);
        } else {
          saveSharedDocument('Default');
        }
      } else if (ShareResponse.action === Share.dismissedAction) {
        // Share dialog dismissed
      }
    } catch (error) {
      console.log('Error => ', error);
    }
  };

  const saveSharedDocument = async (activityType) => {
    try {
      const docRef = await addDoc(collection(db, 'sharedDocuments'), {
        content: generateDocumentContent(),
        activityType: activityType,
      });
      console.log('Document saved with ID:', docRef.id);
    } catch (error) {
      console.error('Error saving shared document:', error);
    }
  };

  const generateDocumentContent = () => {
    let content = 'Personal Report\n\n';

    content += 'Shooting Performance:\n';
    content += 'Zone\tShots Made\tShots Taken\tField Goal %\n';
    Object.entries(reportData).forEach(([zone, stats]) => {
      content += `${zone}: ${stats.shotsMade}\t/${stats.shotsTaken} \t ${calculateFieldGoalPercentage(stats.shotsMade, stats.shotsTaken)}\n`;
    });
    content += '\n';

    content += 'Previous Workouts:\n';
    previousWorkoutScores.forEach((workout, index) => {
      content += `Workout ${index + 1}:\n`;
      content += `Date: ${workout.date}\n`;
      content += `Number of Shots Made: ${workout.totalShotsMade}\n`;
      content += `Total Shots Attempted: ${workout.totalShotsTaken}\n`;
      content += `Improvement/Deprovement: ${calculateImprovement(reportData.total.shotsMade, workout.totalShotsTaken).toFixed(2)}%\n\n`;
    });

    return content;
  };

  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Customizable Report</Text>

      {reportData ? (
        <View>
          <View style={styles.tableContainer}>
            <Text style={styles.sectionTitle}>Shooting Performance</Text>
            <View style={styles.table}>
              <View style={styles.tableRow}>
                <Text style={styles.tableHeader}>Zone</Text>
                <Text style={styles.tableHeader}>Shots Made</Text>
                <Text style={styles.tableHeader}>Shots Taken</Text>
                <Text style={styles.tableHeader}>Field Goal %</Text>
              </View>
              {Object.entries(reportData).map(([zone, stats]) => (
                <View style={styles.tableRow} key={zone}>
                  <Text style={styles.tableCell}>{zone}</Text>
                  <Text style={styles.tableCell}>{stats.shotsMade}</Text>
                  <Text style={styles.tableCell}>{stats.shotsTaken}</Text>
                  <Text style={styles.tableCell}>
                    {calculateFieldGoalPercentage(stats.shotsMade, stats.shotsTaken)}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.tableContainer}>
            <Text style={styles.sectionTitle}>Previous Workouts</Text>
            {previousWorkoutScores.map((workout, index) => (
              <View key={index} style={styles.workoutContainer}>
                <Text>Date: {workout.date}</Text>
                <Text>Number of Shots Made: {workout.totalShotsMade}</Text>
                <Text>Total Shots Attempted: {workout.totalShotsTaken}</Text>
                <Text>
                  Improvement/Deprovement: {calculateImprovement(reportData.total.shotsMade, workout.totalShotsTaken).toFixed(2)}%
                </Text>
              </View>
            ))}
          </View>
        </View>
      ) : (
        <Text>Loading report data...</Text>
      )}

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('StatsPage')}>
        <Text style={styles.buttonText}>Back to my Stats</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={handleShare}>
        <Text style={styles.buttonText}>Share</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  tableContainer: {
    marginBottom: 20,
    marginTop: 20
  },
  table: {
    borderWidth: 1,
    borderColor: 'lightgray',
    marginBottom: 10,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: 'lightgray',
  },
  tableHeader: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 5,
    fontWeight: 'bold',
    backgroundColor: '#f2f2f2',
  },
  tableCell: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 5,
  },
  workoutContainer: {
    borderWidth: 1,
    borderColor: 'lightgray',
    padding: 10,
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#4287f5',
    width: '100%',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ReportPage;
