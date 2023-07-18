import React, {useState, useEffect} from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import HotZone from '../SignInScreen/Images/HotZone.png'
import { useNavigation } from '@react-navigation/native';
//import {paintFG, midRangeFG, threePointFG, freeThrowFG, leftCornerThreeFG, rightCornerThreeFG, leftCornerFG, rightCornerFG, leftLowPostFG, rightLowPostFG, leftHighPostFG, rightHighPostFG, topKeyFG, topKeyThreeFG, leftWingThreeFG, rightWingThreeFG} from '../StatsPage/StatsPage'
import StatsPage from '../StatsPage/StatsPage';

const HotZonePage = () => {
  // Sample data
  // three buttons, each button to expand into subregions
  // each button show fg percentage and % improvement
  // each subregion show fg percentage and % improvement
  const hotZones = ['Left Corner 3', 'Right Wing', 'Paint'];
  const weakZones = ['Top of the Key', 'Left Elbow'];
  const [imageUrl, setImageUrl] = useState("")
  
  // organise these values as three dictionaries, keys the name of the button, value1: fg, value2: improvement%
  // add immprovement percentages to this as value2
  const majorZones = [
  { name: "Paint", value: StatsPage.paintFG },
  { name: "Mid-Range", value: StatsPage.midRangeFG },
  { name: "Three Point", value: StatsPage.threePointFG },
  { name: "Free Throw", value: StatsPage.freeThrowFG }
  ];
  majorZones.sort((a, b) => b.value - a.value);
  const midRangeZones = [
  { name: "Left Corner", value: StatsPage.leftCornerFG },
  { name: "Right Corner", value: StatsPage.rightCornerFG },
  { name: "Left Low Post", value: StatsPage.leftLowPostFG },
  { name: "Right Low Post", value: StatsPage.rightLowPostFG },
  { name: "Left High Post", value: StatsPage.leftHighPostFG },
  { name: "Right High Post", value: StatsPage.rightHighPostFG },
  { name: "Top of the Key", value: StatsPage.topKeyFG }
  ];
  midRangeZones.sort((a, b) => b.value - a.value);

  const threePointZones = [
  { name: "Left Corner Three", value: StatsPage.leftCornerThreeFG },
  { name: "Right Corner Three", value: StatsPage.rightCornerThreeFG },
  { name: "Left Wing Three", value: StatsPage.leftWingThreeFG },
  { name: "Right Wing Three", value: StatsPage.rightWingThreeFG },
  { name: "Top of the Key Three", value: StatsPage.topKeyThreeFG }
  ];
  threePointZones.sort((a, b) => b.value - a.value);
  // can sort by value1 so we can show ranking. Three dictionaries
  // show each major region sorted by values. can click on each button to view subcategories sorted by value1

  useEffect(() => {
        fetchImage(); 
  }, []);
  
  const fetchImage = async () => {
      try {
          console.log("Hotzones Image Fetching")
          const response = await fetch('https://hoopbackend-unmihbju4a-as.a.run.app/api/hotzones')
          const blob = await response.blob()
          setImageUrl(response.url)
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

  return (<View>
    <View style={styles.container}>
      <Text style={styles.title}>Hotzones</Text>
      <Image source={{ uri: imageUrl }} style={styles.logo} resizeMode="contain" />
      <View style={styles.hotZoneContainer}>
        {majorZones.map((zone, index) => (index==0?
          <Text key={index} style={styles.hotZone}>{`${zone.name} ${zone.value}%`}</Text>
          : index<=2?<Text key={index} style={styles.midZone}>{`${zone.name} ${zone.value}%`}</Text>
          : <Text key={index} style={styles.weakZone}>{`${zone.name} ${zone.value}%`}</Text>  
          ))}
      </View>
    </View>
      <View style={styles.container}>
      <Text style={styles.title}>Mid-Range Zones</Text>
      <View style={styles.hotZoneContainer}>
        {midRangeZones.map((zone, index) => (zone.value>=40?
          <Text key={index} style={styles.hotZone}>{`${zone.name} ${zone.value}%`}</Text>
          : <Text key={index} style={styles.weakZone}>{`${zone.name} ${zone.value}%`}</Text>  
          ))}
      </View>  
      </View>
      <View style={styles.container}>
      <Text style={styles.title}>Three-Point Zones</Text>
      <View style={styles.hotZoneContainer}>
        {threePointZones.map((zone, index) => (zone.value>=32?
          <Text key={index} style={styles.hotZone}>{`${zone.name} ${zone.value}%`}</Text>
          : <Text key={index} style={styles.weakZone}>{`${zone.name} ${zone.value}%`}</Text>  
          ))}
      </View>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('StatsPage')}>
            <Text style={styles.buttonText}>Back to my Stats</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={handleShare}>
          <Text style={styles.buttonText}>Share</Text>
      </TouchableOpacity>
    </View>
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
  midZoneContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 20,
  },
  midZone: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    margin: 5,
    backgroundColor: 'yellow',
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
