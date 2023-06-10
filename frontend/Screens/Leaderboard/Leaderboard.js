import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { auth, firebase } from '../../firebase';

const Leaderboard = () => {
  const [leaderboardData, setLeaderboardData] = useState([]);

  useEffect(async () => {
    // Retrieve the scores from Firestore
    const scoresRef = firebase.firestore().collection('scores').doc(auth.currentUser.uid);

    const unsubscribe = scoresRef.orderBy('score', 'desc').onSnapshot((querySnapshot) => {
      const scores = [];
      querySnapshot.forEach((doc) => {
        const { score } = doc.data();
        scores.push({ score });
      });
      setLeaderboardData(scores);
    });

    return () => unsubscribe();
  }, []);

  const handleClick = () => {
    scoresRef.doc(userID).set({
        score: 100, // Replace 100 with the actual score value
      });
  }
  

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Leaderboard</Text>
      <TouchableOpacity onPress={handleClick}>
            <Text>Press Me</Text>
        </TouchableOpacity>
      <FlatList
        data={leaderboardData}
        keyExtractor={(item) => auth.currentUser.uid}
        renderItem={({ item, index }) => (
          <View style={styles.itemContainer}>
            <Text style={styles.rank}>{index + 1}.</Text>
            <Text style={styles.user}>{item.userID}</Text>
            <Text style={styles.score}>{item.score}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  rank: {
    width: 40,
    fontSize: 16,
    marginRight: 8,
  },
  user: {
    flex: 1,
    fontSize: 16,
    marginRight: 8,
  },
  score: {
    fontSize: 16,
  },
});

export default Leaderboard;
