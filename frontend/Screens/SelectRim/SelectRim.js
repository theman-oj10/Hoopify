import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { View, Text, Image, StyleSheet, Button, TouchableWithoutFeedback } from 'react-native';
import LoadingScreen from '../LoadingScreen/LoadingScreen';

function SelectRim() {
  const [imageUrl, setImageUrl] = useState("");
  const [coordinates, setCoordinates] = useState([]);
  const [loading, setLoading] = useState(false); // Track loading state
  const [messages, setMessages] = useState([]);
  const [showInstructions, setShowInstructions] = useState(true); // Track whether to show instructions
  const navigation = useNavigation();

  useEffect(() => {
    fetchImage();
  }, []);

  const handleClick = (event) => {
    const { locationX, locationY } = event.nativeEvent;
    console.log(locationX);
    console.log(locationY);
    const newCoord = [...coordinates, [locationX, locationY]];
    setCoordinates(newCoord);
  };

  const fetchImage = async () => {
    try {
      console.log("Image Fetching");
      const response = await fetch('https://hoopbackend-unmihbju4a-as.a.run.app/api/first_frame');
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setImageUrl(url);
    } catch (error) {
      console.log('Error fetching Image:', error);
    }
  };

  const handleSubmit = async () => {
    try {
      if (coordinates.length < 18) {
        alert("You haven't chosen enough points!");
        return;
      }

      setLoading(true); // Start loading state

      const response = await fetch('https://hoopbackend-unmihbju4a-as.a.run.app/api/video-analysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({ coordinates }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data);
        navigation.navigate('StatsPage');
      } else {
        console.log('ResponseError:', response.status);
      }
    } catch (error) {
      console.log('Error:', error);
    } finally {
      setLoading(false); // Stop loading state
    }
  };

  const handleProceed = () => {
    setShowInstructions(false);
  };

  if (loading) {
    return (
      <>
        <LoadingScreen>Loading...</LoadingScreen>
        <Text>{messages[0]}</Text>
      </>
    );
  }

  return (
    <View style={styles.container}>
      {showInstructions ? (
        <>
          <Text style={styles.instructions}>Instructions: Please read the following instructions before proceeding.</Text>
          <Button onPress={handleProceed} title="Proceed" />
        </>
      ) : (
        <>
          {imageUrl ? (
            <TouchableWithoutFeedback onPress={handleClick}>
              <Image source={{ uri: imageUrl }} style={styles.image} />
            </TouchableWithoutFeedback>
          ) : (
            <Text>Loading image...</Text>
          )}
          <Button onPress={handleSubmit} title="Submit" />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  instructions: {
    marginBottom: 20,
  },
  image: {
    width: 1000,
    height: 600,
  },
});

export default SelectRim;
