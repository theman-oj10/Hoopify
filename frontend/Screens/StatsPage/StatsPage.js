import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, Share } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Logo from '../SignInScreen/Images/Logo.png';

const StatsPage = () => {
  const totalShotsTaken = 100;
  const totalShotsMade = 72;
  const previousWorkoutScores = [
    { date: '2023-05-22', shotsTaken: 20, shotsMade: 16 },
    { date: '2023-05-20', shotsTaken: 15, shotsMade: 9 },
    { date: '2023-05-18', shotsTaken: 25, shotsMade: 18 },
  ];
  const navigation = useNavigation();

  const calculateFieldGoalPercentage = () => {
    if (totalShotsTaken === 0) {
      return '0%';
    }
    const percentage = (totalShotsMade / totalShotsTaken) * 100;
    return `${percentage.toFixed(2)}%`;
  };

  const handleViewHotZone = () => {
    // Handle the action for viewing the hot zone
    console.log('View Hot Zone');
  };

  const handleShare = async() => {
    // Handle the action for sharing
    const shareOptions = {
      message: `I made ${totalShotsMade} / ${totalShotsTaken} shots today`,
    }
    try {
      const ShareResponse = await Share.share(shareOptions);
    } catch(error) {
      console.log('Error => ', error);
    }
  };

  return (
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
              {stat.shotsMade}/{stat.shotsTaken}
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
      <TouchableOpacity style={[styles.button, styles.uploadButton]} onPress={() => navigation.navigate('ReportPage')}>
        <Text style={styles.buttonText}>Show my progress</Text>
      </TouchableOpacity>
    </View>
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
    fontSize: 30,
    marginTop: 10,
    fontWeight: 'bold',
    color: 'white',
  },
  previousStatsContainer: {
    marginBottom: 30,
    alignItems: 'center',
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'black',
  },
  previousStatContainer: {
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 10,
  },
  previousStatDate: {
    fontSize: 16,
    color: 'black',
  },
  previousStatScore: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
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
  uploadButton: {
    backgroundColor: '#f54242',
  },
});

export default StatsPage;
