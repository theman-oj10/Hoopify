import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { View, Text, Image, StyleSheet, Button, TouchableWithoutFeedback } from 'react-native';
import LoadingScreen from '../LoadingScreen/LoadingScreen';
import { Platform } from 'react-native';
import Instructions from './Instructions';


function SelectRim() {
  const [imageUrl, setImageUrl] = useState("");
  const [coordinates, setCoordinates] = useState([]);
  const [loading, setLoading] = useState(false); // Track loading state
  const [messages, setMessages] = useState([]);
  const [showInstructions, setShowInstructions] = useState(true); // Track whether to show instructions
  const navigation = useNavigation();
  const [selectRimURL, setSelectRimURL] = useState(""); 
  const [rimSelected, setRimSelected] = useState(false);

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
  useEffect(() => {
    fetchImage();
  }, []);
useEffect(() => {
    if (coordinates.length > 0) {
      fetchSelectRimProgress();
    }
  }, [coordinates]);

  // useEffect(() => {
  //   fetchSelectRimProgress();
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
  const newCoord = await [...coordinates, [locationX, locationY]];
  const coordinatesLen = await newCoord.length;
  console.log(`coordinateslen ${coordinatesLen}`)
  await setCoordinates(newCoord)
  await selectRimProgress(coordinatesLen)
  //await fetchSelectRimProgress()
}
  // posting the coordinates length to backend
  const selectRimProgress = async (coordinatesLen) => {
    try {
      const response = await fetch('http://127.0.0.1:8080/api/selectRim', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({coordinatesLen}),
      }); 
      if (response.ok) {
        const data = await response.json();
        // Handle the response data from the Flask server
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
            <TouchableWithoutFeedback onPress={handleClick}>
              <Image source={{ uri: imageUrl }} style={styles.image} />
            </TouchableWithoutFeedback>
          ) : (
            <Text>Loading image...</Text>
          )}
          <Button onPress={handleSubmit} title="Submit" />
          <Image
            source={{ uri: `${selectRimURL}?timestamp=${new Date().getTime()}` }}
            key={coordinates}
            style={styles.image}
          />

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