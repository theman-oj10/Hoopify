import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Share, ScrollView } from 'react-native';
import axios from 'axios';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, query, orderBy, getDocs, limit, addDoc, Timestamp } from 'firebase/firestore';
import { auth } from '../../firebase';
import { BarChart, LineChart } from 'react-native-chart-kit';
import { captureRef } from 'react-native-view-shot';


const app = initializeApp(firebaseConfig);
const db = getFirestore(app);



const ReportPage = () => {
  const [previousWorkoutScores, setPreviousWorkoutScores] = useState([]);
  const navigation = useNavigation();
  const chartRef = useRef();
  const [zonesState, setZonesState] = useState(null);
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

  const fetchReportData = async () => {
    try {
      // Fetch data from Firestore
      const scoresRef = collection(db, 'scores', auth.currentUser?.uid, 'workouts');
      const scoresQuery = query(scoresRef, orderBy('date', 'desc'), limit(1));
      const scoresSnapshot = await getDocs(scoresQuery);
      const scores = scoresSnapshot.docs.map((doc) => doc.data());
  
      // Assuming scores is an array with a single object, extract that object
      const scoreData = scores[0]; // Modify this part based on your data structure
  
      // console.log(`StatsData: ${scoreData}`);
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

      // setReportData(scoreData);
      const zones = {
        "Total": { shotsMade: totalShotsMade, shotsTaken: totalShotsTaken },
        "Paint": { shotsMade: paintShotsMade, shotsTaken: paintShotsTaken },
        "Free Throw": { shotsMade: freeThrowShotsMade, shotsTaken: freeThrowShotsTaken },
        "Mid-Range": { shotsMade: midRangeShotsMade, shotsTaken: midRangeShotsTaken },
        "Three Point": { shotsMade: threePointShotsMade, shotsTaken: threePointShotsTaken },
        "Left Corner Three": { shotsMade: leftCornerThreeShotsMade, shotsTaken: leftCornerThreeShotsTaken },
        "Right Corner Three": { shotsMade: rightCornerThreeShotsMade, shotsTaken: rightCornerThreeShotsTaken },
        "Left Corner": { shotsMade: leftCornerShotsMade, shotsTaken: leftCornerShotsTaken },
        "Right Corner": { shotsMade: rightCornerShotsMade, shotsTaken: rightCornerShotsTaken },
        "Left Low Post": { shotsMade: leftLowPostShotsMade, shotsTaken: leftLowPostShotsTaken },
        "Right Low Post": { shotsMade: rightLowPostShotsMade, shotsTaken: rightLowPostShotsTaken },
        "Left High Post": { shotsMade: leftHighPostShotsMade, shotsTaken: leftHighPostShotsTaken },
        "Right High Post": { shotsMade: rightHighPostShotsMade, shotsTaken: rightHighPostShotsTaken },
        "Top Key": { shotsMade: topKeyShotsMade, shotsTaken: topKeyShotsTaken },
        "Top Key Three": { shotsMade: topKeyThreeShotsMade, shotsTaken: topKeyThreeShotsTaken },
        "Left Wing Three": { shotsMade: leftWingThreeShotsMade, shotsTaken: leftWingThreeShotsTaken },
        "Right Wing Three": { shotsMade: rightWingThreeShotsMade, shotsTaken: rightWingThreeShotsTaken },
      };
      setZonesState(zones);
    } catch (error) {
      console.log('Error fetching report data:', error);
      throw error;
    }
  };

  useEffect(() => {
    fetchReportData();
  }, []);

  const formatDateTime = (timestamp) => {
    const date = timestamp.toDate();
    const options = { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric' };
    return date.toLocaleString(undefined, options);
  };
  const formatDate = (timestamp) => {
    const date = timestamp.toDate();
    const options = { year: 'numeric', month: 'numeric', day: 'numeric'};
    return date.toLocaleString(undefined, options);
  }; 

  const fetchPreviousWorkoutScores = async () => {
    try {
      const scoresRef = collection(db, 'scores', auth.currentUser?.uid, 'workouts');
      const scoresQuery = query(scoresRef, orderBy('date', 'desc'), limit(4));
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
  
  const calculateImprovement = (currMade, currTaken, prevMade, prevTaken) => {
    
    // console.log(typeof currMade)
    const prevFG = parseFloat(calculateFieldGoalPercentage(prevMade, prevTaken));
    const currFG = parseFloat(calculateFieldGoalPercentage(currMade, currTaken));
    
    if (isNaN(prevFG) || isNaN(currFG)) {
      return 0; // Handle invalid input
    }
  
    if (prevFG === 0) {
      return (currFG); // Special case when prevFG is 0
    }
  
    return ((prevFG - currFG) / prevFG * 100);
    //return 10;
  };
  
  


  const renderWorkoutCharts = () => {
    // Ref added to the BarChart component
    const workoutLabels = previousWorkoutScores
  .map((workout, index) => workout.date)
  .slice(1)
  .map((label) => {
    // Split the label into date and time by space character
    const [date, time] = label.split(', ');
    // Combine date and time with a line break in between
    return `${date}`;
  });

    //console.log(typeof zonesState["Total"].shotsTaken)
    const totalScoreData = previousWorkoutScores
  .map((workout, index) =>
    calculateImprovement(
      zonesState["Total"].shotsMade,
      zonesState["Total"].shotsTaken,
      workout.totalShotsMade,
      workout.totalShotsTaken
    ).toFixed(2)
  )
  .slice(1);

const paintData = previousWorkoutScores
  .map((workout, index) =>
    calculateImprovement(
      zonesState["Paint"].shotsMade,
      zonesState["Paint"].shotsTaken,
      workout.paintShotsMade,
      workout.paintShotsTaken
    ).toFixed(2)
  )
  .slice(1);

const midrangeData = previousWorkoutScores
  .map((workout, index) =>
    calculateImprovement(
      zonesState["Mid-Range"].shotsMade,
      zonesState["Mid-Range"].shotsTaken,
      workout.midRangeShotsMade,
      workout.midRangeShotsTaken
    ).toFixed(2)
  )
  .slice(1);

const freeThrowData = previousWorkoutScores
  .map((workout, index) =>
    calculateImprovement(
      zonesState["Free Throw"].shotsMade,
      zonesState["Free Throw"].shotsTaken,
      workout.freeThrowShotsMade,
      workout.freeThrowShotsTaken
    ).toFixed(2)
  )
  .slice(1);

const threePointData = previousWorkoutScores
  .map((workout, index) =>
    calculateImprovement(
      zonesState["Three Point"].shotsMade,
      zonesState["Three Point"].shotsTaken,
      workout.threePointShotsMade,
      workout.threePointShotsTaken
    ).toFixed(2)
  )
  .slice(1);

  
    return (
      <View style={styles.chartContainer}>
        <Text style={styles.sectionTitle}>Workout Improvement</Text>
        <View ref={chartRef}>
          <View style={styles.chartWrapper}>
            <Text style={styles.chartText}>Total Score</Text>
            <BarChart
          data={{
            labels: workoutLabels,
            datasets: [
              {
                data: totalScoreData,
                color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                strokeWidth: 2,
              },
            ],
          }}
          width={workoutLabels.length * 100}
          height={200}
          chartConfig={{
            backgroundColor: '#f2f2f2',
            backgroundGradientFrom: '#f2f2f2',
            backgroundGradientTo: '#f2f2f2',
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            style: {
              borderRadius: 10,
            },
          }}
          style={styles.chart}
          bezier
        />
      </View>
      <View style={styles.chartWrapper}>
        <Text style={styles.chartText}>Paint Field Goal %</Text>
        <BarChart
          data={{
            labels: workoutLabels,
            datasets: [
              {
                data: paintData,
                color: (opacity = 1) => `rgba(255, 0, 0, ${opacity})`,
                strokeWidth: 2,
              },
            ],
          }}
          width={workoutLabels.length * 100}
          height={200}
          chartConfig={{
            backgroundColor: '#f2f2f2',
            backgroundGradientFrom: '#f2f2f2',
            backgroundGradientTo: '#f2f2f2',
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            style: {
              borderRadius: 10,
            },
          }}
          style={styles.chart}
          bezier
        />
      </View>
      <View style={styles.chartWrapper}>
        <Text style={styles.chartText}>Mid-Range Field Goal %</Text>
        <BarChart
          data={{
            labels: workoutLabels,
            datasets: [
              {
                data: midrangeData,
                color: (opacity = 1) => `rgba(0, 255, 0, ${opacity})`,
                strokeWidth: 2,
              },
            ],
          }}
          width={workoutLabels.length * 100}
          height={200}
          chartConfig={{
            backgroundColor: '#f2f2f2',
            backgroundGradientFrom: '#f2f2f2',
            backgroundGradientTo: '#f2f2f2',
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            style: {
              borderRadius: 10,
            },
          }}
          style={styles.chart}
          bezier
        />
      </View>
      <View style={styles.chartWrapper}>
        <Text style={styles.chartText}>Free Throw %</Text>
        <BarChart
          data={{
            labels: workoutLabels,
            datasets: [
              {
                data: freeThrowData,
                color: (opacity = 1) => `rgba(0, 0, 255, ${opacity})`,
                strokeWidth: 2,
              },
            ],
          }}
          width={workoutLabels.length * 100}
          height={200}
          chartConfig={{
            backgroundColor: '#f2f2f2',
            backgroundGradientFrom: '#f2f2f2',
            backgroundGradientTo: '#f2f2f2',
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            style: {
              borderRadius: 10,
            },
          }}
          style={styles.chart}
          bezier
        />
      </View>
      <View style={styles.chartWrapper}>
        <Text style={styles.chartText}>Three Point %</Text>
        <BarChart
          data={{
            labels: workoutLabels,
            datasets: [
              {
                data: threePointData,
                color: (opacity = 1) => `rgba(255, 255, 0, ${opacity})`,
                strokeWidth: 2,
              },
            ],
          }}
          width={workoutLabels.length * 100}
          height={200}
          chartConfig={{
            backgroundColor: '#f2f2f2',
            backgroundGradientFrom: '#f2f2f2',
            backgroundGradientTo: '#f2f2f2',
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            style: {
              borderRadius: 10,
            },
          }}
          style={styles.chart}
          bezier
        />
      </View>
        </View>
      </View>
    );
  };
  

  const handleShare = async () => {
    // Capture the bar chart component as an image
    const chartImage = await captureRef(chartRef, {
      format: 'png',
      quality: 1,
    });
  
    // Share options including the chart image
    const shareOptions = {
      message: generateDocumentContent(),
      urls: [chartImage],
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
      const currentDate = Timestamp.fromDate(new Date());
      const docRef = await addDoc(collection(db, 'sharedDocuments'), {
        content: generateDocumentContent(),
        email: auth.currentUser?.email,
        date: currentDate,
      });
      console.log('Document saved with ID:', docRef.id);
    } catch (error) {
      console.error('Error saving shared document:', error);
    }
  };

  const generateDocumentContent = () => {
    let content = 'Shooting Performance:\n';
    content += 'Zone FGM/FGA FG%\n';
    Object.entries(zonesState).forEach(([zone, stats]) => {
      content += `${zone}: ${stats.shotsMade}/${stats.shotsTaken}\t ${calculateFieldGoalPercentage(stats.shotsMade, stats.shotsTaken)}\n`;
    });
    content += '\n';

    content += 'Previous Workouts:\n';
    previousWorkoutScores.forEach((workout, index) => {
      content += `Workout ${index + 1}:\n`;
      content += `Date: ${workout.date}\n`;
      content += `Number of Shots Made: ${workout.totalShotsMade}\n`;
      content += `Total Shots Attempted: ${workout.totalShotsTaken}\n`;
      content += `Improvement/Deprovement: ${calculateImprovement(zonesState["Total"].shotsMade, zonesState["Total"].shotsTaken, workout.totalShotsMade, workout.totalShotsTaken).toFixed(2)}%\n\n`;
    });
    return content;
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollViewContent}>
      <View style={styles.container}>
        <Text style={styles.title}>Report</Text>

        {zonesState ? (
          <View>
            {renderWorkoutCharts()}
            <View style={styles.tableContainer}>
              <Text style={styles.sectionTitle}>Shooting Performance</Text>
              <View style={styles.table}>
                <View style={styles.tableRow}>
                  <Text style={styles.tableHeader}>Zone</Text>
                  <Text style={styles.tableHeader}>Shots Made</Text>
                  <Text style={styles.tableHeader}>Shots Taken</Text>
                  <Text style={styles.tableHeader}>Field Goal %</Text>
                </View>
                {Object.entries(zonesState).map(([zone, stats]) => (
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
                index !== 0 ? (
                  <View key={index} style={styles.workoutContainer}>
                    <Text>{workout.date}</Text>
                    <Text>{workout.totalShotsMade} / {workout.totalShotsTaken}</Text>
                    <Text>
                      Improvement: {calculateImprovement(zonesState["Total"].shotsMade, zonesState["Total"].shotsTaken, workout.totalShotsMade, workout.totalShotsTaken)}%
                    </Text>
                  </View>
                ) : null
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
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollViewContent: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 80,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 20,
  },
  tableContainer: {
    marginBottom: 100,
    marginTop: 40
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
  chartContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
    alignItems: 'center',
  },
  chartWrapper: {
    marginHorizontal: 10,
    marginBottom: 20,
    alignItems: 'center',
  },
  chartText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 20,
  }
});

export default ReportPage;
