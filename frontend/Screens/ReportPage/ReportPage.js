import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const ReportPage = () => {
  const [reportData, setReportData] = useState(null);
  const [previousWorkouts, setPreviousWorkouts] = useState([]);

  useEffect(() => {
    // Fetch report data from API or database
    fetchReportData()
      .then((data) => {
        setReportData(data);
      })
      .catch((error) => {
        console.log('Error fetching report data:', error);
      });

    // Fetch previous workouts data
    fetchPreviousWorkouts()
      .then((workouts) => {
        setPreviousWorkouts(workouts);
      })
      .catch((error) => {
        console.log('Error fetching previous workouts:', error);
      });
  }, []);

  const fetchReportData = async () => {
    // Perform API request or fetch data from database
    // Return the fetched report data
    // Example Below
    return {
      shotsMade: 45,
      totalShots: 60,
      fieldGoalPercentage: 75,
      hotZones: ['Left Corner', 'Mid Range'],
    };
  };

  const fetchPreviousWorkouts = async () => {
    // Perform API request or fetch data from database
    // Return the fetched previous workouts data
    // Example Below
    return [
      {
        date: '2022-01-10',
        shotsMade: 30,
        totalShots: 50,
      },
      {
        date: '2022-01-15',
        shotsMade: 40,
        totalShots: 60,
      },
      {
        date: '2022-01-20',
        shotsMade: 35,
        totalShots: 55,
      },
    ];
  };

  const calculateImprovement = (current, previous) => {
    return ((current - previous) / previous) * 100;
  };
  
  const handleShare = () => {
    // Handle the action for sharing
    console.log('Share');
  };

  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Customizable Report</Text>

      {reportData ? (
        <View>
          <Text style={styles.sectionTitle}>Shooting Performance</Text>
          <Text>Number of Shots Made: {reportData.shotsMade}</Text>
          <Text>Total Shots Attempted: {reportData.totalShots}</Text>
          <Text>Field Goal Percentage: {reportData.fieldGoalPercentage}%</Text>
          <Text>Hot Zones: {reportData.hotZones.join(', ')}</Text>

          <Text style={styles.sectionTitle}>Previous Workouts</Text>
          {previousWorkouts.map((workout, index) => (
            <View key={index} style={styles.workoutContainer}>
              <Text>Date: {workout.date}</Text>
              <Text>Number of Shots Made: {workout.shotsMade}</Text>
              <Text>Total Shots Attempted: {workout.totalShots}</Text>
              <Text>
                Improvement/Deprovement: {calculateImprovement(reportData.shotsMade, workout.shotsMade).toFixed(2)}%
              </Text>
            </View>
          ))}
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
    padding: 50,
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
  workoutContainer: {
    marginTop: 10,
    borderWidth: 1,
    borderColor: 'lightgray',
    padding: 10,
    marginBottom: 20,
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
