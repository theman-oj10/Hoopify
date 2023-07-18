import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { View, Text, Image, StyleSheet, Button, TouchableWithoutFeedback, findNodeHandle } from 'react-native';
import LoadingScreen from '../LoadingScreen/LoadingScreen';
import { Platform } from 'react-native';
import Instructions from './Instructions';

function SelectRim() {
  const [imageUrl, setImageUrl] = useState("");
  const [coordinates, setCoordinates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [showInstructions, setShowInstructions] = useState(true);
  const navigation = useNavigation();
  const [selectRimURL, setSelectRimURL] = useState("");
  const [rimSelected, setRimSelected] = useState(false);
  //const [firstImageSize, setFirstImageSize] = useState({ width: 0, height: 0 }); // Track the size of the first image
  const [firstImageX, setFirstImageX] = useState(0)
  const [firstImageY, setFirstImageY] = useState(0)
  const fetchImage = async () => {
    try {
      console.log("Image Fetching");
      const response = await fetch('https://hoopbackend-unmihbju4a-as.a.run.app/api/first_frame');
      const blob = await response.blob();
      setImageUrl(response.url);
    } catch (error) {
      console.log('Error fetching Image:', error);
    }
  };

  useEffect(() => {
    fetchImage();
  }, []);

  const handleFirstImageLayout = (event) => {
    const { width, height } = event.nativeEvent.layout;
    //setFirstImageSize({ width, height });
    setFirstImageX(width)
    setFirstImageY(height)
    console.log(width);
    console.log(height);
  };

  const fetchSelectRimProgress = async () => {
    try {
      setRimSelected(true)
      console.log("SelectRim Fetching");
      const response = await fetch('http://127.0.0.1:8080/api/selectRim');
      const blob = await response.blob();
      await setSelectRimURL(response.url);
      //setRefreshKey(refreshKey + 1);
      console.log(response.url)
    } catch (error) {
      console.log('Error fetching Image:', error);
    }
  }; 

  // useEffect(() => {
  //   if (coordinates.length > 0) {
  //     fetchSelectRimProgress();
  //   }
  // }, [coordinates]);

  const handleClick = async (event) => {
    let locationX, locationY;
    if (Platform.OS === 'web') {
      const { clientX, clientY } = event;
      locationX = clientX;
      locationY = clientY;
    } else {
      const { locationX: rawLocationX, locationY: rawLocationY } = event.nativeEvent;
      locationX = rawLocationX;
      locationY = rawLocationY;
    }
    console.log(locationX);
    console.log(locationY);
    const updatedX = 600/firstImageX * locationX
    const updatedY = 400/firstImageY * locationY
    console.log(updatedX);
    console.log(updatedY);
    const newCoord = await [...coordinates, [updatedX, updatedY]];
    const coordinatesLen = await newCoord.length;
    console.log(`coordinateslen ${coordinatesLen}`)
    await setCoordinates(newCoord)
    await selectRimProgress(coordinatesLen)
    //await fetchSelectRimProgress()
  }

  const selectRimProgress = async (coordinatesLen) => {
    try {
      const response = await fetch('http://127.0.0.1:8080/api/selectRim', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({ coordinatesLen }),
      });
      if (response.ok) {
        const data = await response.json();
        console.log(data);
        //fetchSelectRimProgress()
      } else {
        console.log('ResponseError:', response.status);
      }
    } catch (error) {
      console.log('Error:', error);
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
        console.log("response received")
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
            <View style={{ transform: [{ rotate: '90deg' }] }}>
              <View style={styles.imageContainer}>
                <TouchableWithoutFeedback onLayout={handleFirstImageLayout} onPress={handleClick}>
                  <Image source={{ uri: imageUrl }} style={styles.image} />
                </TouchableWithoutFeedback>
              </View>
            </View>
          ) : (
            <Text>Loading image...</Text>
          )}
          <View style={{ transform: [{ rotate: '90deg' }] }}>
            <View style={styles.buttonContainer}>
              <Button onPress={handleSubmit} title="Submit" style={styles.submitButton} />
            </View>
          </View>
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: `${selectRimURL}?timestamp=${new Date().getTime()}` }}
              key={coordinates}
              style={styles.image}
            />
          </View>
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
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: '80%',
  },
  image: {
    width: '80%',
    height: 'auto',
    marginLeft: '100%',
    aspectRatio: 16 / 9,
  },
  submitButton: {
    marginTop: 10,
    marginRight: '20%',
  },
});

export default SelectRim;
