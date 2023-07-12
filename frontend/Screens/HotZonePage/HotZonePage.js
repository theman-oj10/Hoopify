import React, {useState, useEffect} from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import HotZone from '../SignInScreen/Images/HotZone.png'
import { useNavigation } from '@react-navigation/native';

const HotZonePage = () => {
  // Sample data
  const hotZones = ['Left Corner 3', 'Right Wing', 'Paint'];
  const weakZones = ['Top of the Key', 'Left Elbow'];
  const [imageUrl, setImageUrl] = useState("")
  
  useEffect(() => {
        fetchImage(); 
  }, []);
  
  const fetchImage = async () => {
      try {
          console.log("Hotzones Image Fetching")
          const response = await fetch('https://hoopbackend-unmihbju4a-as.a.run.app/api/hotzones')
          const blob = await response.blob()
          const url = URL.createObjectURL(blob)
          setImageUrl(url)
      }
      catch (error) {
          console.log('Error fetching Image:', error);
      }
      if (!imageUrl) {
          return <div>Loading...</div>; // Placeholder for the loading state
      }   
  }

  const handleShare = () => {
    // Handle the action for sharing
    console.log('Share');
  };

  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hotzones</Text>
      <Image source={imageUrl} style={styles.logo} resizeMode="contain" />
      
      <Text style={styles.title}>Hot Zones</Text>
      <View style={styles.hotZoneContainer}>
        {hotZones.map((zone, index) => (
          <Text key={index} style={styles.hotZone}>{zone}</Text>
        ))}
      </View>
      
      <Text style={styles.title}>Weak Zones</Text>
      <View style={styles.weakZoneContainer}>
        {weakZones.map((zone, index) => (
          <Text key={index} style={styles.weakZone}>{zone}</Text>
        ))}
      </View>
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
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: 'pink',
  },
  title: {
    fontSize: 70,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  logo: {
    width: 400,
    height: 300,
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  hotZoneContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 20,
  },
  hotZone: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    margin: 5,
    backgroundColor: 'green',
    color: 'white',
    borderRadius: 5,
  },
  weakZoneContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  weakZone: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    margin: 5,
    backgroundColor: 'red',
    color: 'white',
    borderRadius: 5,
    marginBottom: 40,
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

export default HotZonePage;
