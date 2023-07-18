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
import StatsPage from '../StatsPage/StatsPage';

const HotZonePage = () => {
  const [imageUrl, setImageUrl] = useState('');

  const majorZones = [
    { name: 'Paint', value: StatsPage.paintFG },
    { name: 'Mid-Range', value: StatsPage.midRangeFG },
    { name: 'Three Point', value: StatsPage.threePointFG },
    { name: 'Free Throw', value: StatsPage.freeThrowFG },
  ];
  majorZones.sort((a, b) => b.value - a.value);

  const midRangeZones = [
    { name: 'Left Corner', value: StatsPage.leftCornerFG },
    { name: 'Right Corner', value: StatsPage.rightCornerFG },
    { name: 'Left Low Post', value: StatsPage.leftLowPostFG },
    { name: 'Right Low Post', value: StatsPage.rightLowPostFG },
    { name: 'Left High Post', value: StatsPage.leftHighPostFG },
    { name: 'Right High Post', value: StatsPage.rightHighPostFG },
    { name: 'Top of the Key', value: StatsPage.topKeyFG },
  ];
  midRangeZones.sort((a, b) => b.value - a.value);

  const threePointZones = [
    { name: 'Left Corner Three', value: StatsPage.leftCornerThreeFG },
    { name: 'Right Corner Three', value: StatsPage.rightCornerThreeFG },
    { name: 'Left Wing Three', value: StatsPage.leftWingThreeFG },
    { name: 'Right Wing Three', value: StatsPage.rightWingThreeFG },
    { name: 'Top of the Key Three', value: StatsPage.topKeyThreeFG },
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

  const handleShare = () => {
    // Handle the action for sharing
    console.log('Share');
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
      <Text style={styles.hotZoneValue}>{`${zone.value}%`}</Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Hotzones</Text>
      <Image source={{ uri: imageUrl }} style={styles.logo} resizeMode="contain" />

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
    marginTop: 20,
    marginBottom: 5,
  },
  logo: {
    width: '100%',
    height: undefined,
    aspectRatio: 1,
    marginBottom: 5,
  },
  zoneContainer: {
    width: '100%',
  },
  midRangeZoneContainer: {
    marginBottom: 2,
  },
  threePointZoneContainer: {
    marginBottom: 0,
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
  },
  hotZoneValue: {
    color: 'white',
    fontSize: 14,
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
