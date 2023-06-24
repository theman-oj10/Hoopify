import { initializeApp } from 'firebase/app';
import 'firebase/auth';
import {
  getFirestore,
  collection,
  getDocs,
  orderBy,
  query,
  where,
} from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet } from 'react-native';
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

const Leaderboard = () => {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [sortingLocation, setSortingLocation] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const leaderboardRef = collection(db, 'scores');
        const querySnapshot = await getDocs(
          query(
            leaderboardRef,
            orderBy('score', 'desc'),
            where('location', '==', sortingLocation)
          )
        );
        const fetchedData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          score: doc.data().score,
          email: doc.data().email,
          location: doc.data().location,
        }));
        setLeaderboardData(fetchedData);
        setSortingLocation(sortingLocation || '');
      } catch (error) {
        console.log('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const renderLeaderboardItem = ({ id, score, email, location }, index) => (
    <View key={id} style={styles.leaderboardItem}>
      <Text style={styles.rank}>{index + 1}</Text>
      <Text style={styles.email}>{email}</Text>
      <Text style={styles.score}>{score}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Leaderboard</Text>
      <Text style={styles.sortingLocation}>Sorting by: {sortingLocation}</Text>
      <View style={styles.leaderboard}>
        {leaderboardData.map((item, index) =>
          renderLeaderboardItem(item, index)
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 24,
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  sortingLocation: {
    fontSize: 16,
    marginBottom: 8,
  },
  leaderboard: {
    marginTop: 16,
  },
  leaderboardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
  },
  rank: {
    width: 40,
    marginRight: 8,
    fontWeight: 'bold',
    fontSize: 16,
    color: '#000000',
  },
  email: {
    flex: 1,
    marginRight: 8,
    fontSize: 16,
    color: '#000000',
  },
  score: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
  },
  location: {
    marginLeft: 8,
    fontSize: 16,
    color: '#000000',
  },
});

export default Leaderboard;
