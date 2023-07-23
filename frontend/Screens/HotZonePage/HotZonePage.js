import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

import HotZone from '../SignInScreen/Images/HotZone.png';

const HotZonePage = ({ route }) => {
  const { 
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
    rightWingThreeFG
  } = route.params;
  const [imageUrl, setImageUrl] = useState('https://hoopbackend-unmihbju4a-as.a.run.app/api/hotzones');

  const majorZones = [
    { name: 'Paint', value: paintFG },
    { name: 'Mid-Range', value: midRangeFG },
    { name: 'Three Point', value: threePointFG },
    { name: 'Free Throw', value: freeThrowFG },
  ];
  majorZones.sort((a, b) => b.value - a.value);

  const midRangeZones = [
    { name: 'Left Corner', value: leftCornerFG },
    { name: 'Right Corner', value: rightCornerFG },
    { name: 'Left Low Post', value: leftLowPostFG },
    { name: 'Right Low Post', value: rightLowPostFG },
    { name: 'Left High Post', value: leftHighPostFG },
    { name: 'Right High Post', value: rightHighPostFG },
    { name: 'Top of the Key', value: topKeyFG },
  ];
  midRangeZones.sort((a, b) => b.value - a.value);

  const threePointZones = [
    { name: 'Left Corner Three', value: leftCornerThreeFG },
    { name: 'Right Corner Three', value: rightCornerThreeFG },
    { name: 'Left Wing Three', value: leftWingThreeFG },
    { name: 'Right Wing Three', value: rightWingThreeFG },
    { name: 'Top of the Key Three', value: topKeyThreeFG },
  ];
  threePointZones.sort((a, b) => b.value - a.value);

  const navigation = useNavigation();

  useEffect(() => {
    fetchImage();
  }, []);

  const fetchImage = async () => {
    try {
      console.log('Hotzones Image Fetching');
      const response = await fetch(
        'https://hoopbackend-unmihbju4a-as.a.run.app/api/hotzones'
      );
      const blob = await response.blob();
      setImageUrl(response.url);
    } catch (error) {
      console.log('Error fetching Image:', error);
    }
  };

   const handleShare = async () => {
    const shareOptions = {
      message: `Paint : ${paintFG}
                Mid-Range : ${midRangeFG}
                Free Throw : ${freeThrowFG}
                Three-Point : ${threePointFG}
                My 🔥 Zones: ${midRangeZones[0].name} : ${midRangeZones[0].value}
                             ${threePointZones[0].name} : ${threePointZones[0].value}`
    };
    try {
      const ShareResponse = await Share.share(shareOptions);
    } catch (error) {
      console.log('Error => ', error);
    }
  };


  const renderZone = (zone) => (
    <TouchableOpacity
      style={[
        styles.hotZone,
        zone.value >= 40 ? styles.hotZone : styles.weakZone,
      ]}
      key={zone.name}
    >
      <Text style={styles.hotZoneText}>{zone.name}</Text>
      <Text style={styles.hotZoneValue}>{`${Math.round(zone.value)}%`}</Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Hotzones</Text>
      <Image source={{uri: imageUrl}} style={styles.logo} resizeMode="contain" />

      <View style={styles.zoneContainer}>
        <Text style={styles.zoneTitle}>Major Zones</Text>
        <View style={styles.hotZoneContainer}>
          {majorZones.map(renderZone)}
        </View>
      </View>

      <View style={[styles.zoneContainer, styles.midRangeZoneContainer]}>
        <Text style={styles.zoneTitle}>Mid-Range Zones</Text>
        <View style={styles.hotZoneContainer}>
          {midRangeZones.map(renderZone)}
        </View>
      </View>

      <View style={[styles.zoneContainer, styles.threePointZoneContainer]}>
        <Text style={styles.zoneTitle}>Three-Point Zones</Text>
        <View style={styles.hotZoneContainer}>
          {threePointZones.map(renderZone)}
        </View>
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('StatsPage')}
      >
        <Text style={styles.buttonText}>Back to my Stats</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={handleShare}>
        <Text style={styles.buttonText}>Share</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#98FB98'
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    marginTop: 70,
    marginBottom: 20,
  },
  logo: {
    width: '100%',
    height: undefined,
    aspectRatio: 1,
    marginBottom: 5,
  },
  zoneContainer: {
    width: '100%',
    marginBottom:-20,
  },
  midRangeZoneContainer: {
    marginBottom: -100,
  },
  threePointZoneContainer: {
    marginBottom: -20,
  },
  zoneTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  hotZoneContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  hotZone: {
    width: '45%',
    aspectRatio: 1,
    margin: 5,
    backgroundColor: 'green',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hotZoneText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  hotZoneValue: {
    color: 'white',
    fontSize: 20,
  },
  weakZone: {
    backgroundColor: 'red',
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
