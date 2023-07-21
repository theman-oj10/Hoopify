import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { View, Text, Image, StyleSheet, Button, TouchableWithoutFeedback, findNodeHandle, Pressable, TouchableOpacity } from 'react-native';
import LoadingScreen from '../LoadingScreen/LoadingScreen';
import { Platform } from 'react-native';
import Instructions from './Instructions';
import select_rim from './select_rim.png'
import rim_img from './rim_img.png'

function SelectRim() {
  const [data, setData] = useState(null); 
  const [imageUrl, setImageUrl] = useState("");
  const [coordinates, setCoordinates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [showInstructions, setShowInstructions] = useState(true);
  const navigation = useNavigation();
  const [selectRimURL, setSelectRimURL] = useState("");
  const [rimSelected, setRimSelected] = useState(false);
  //const [firstImageSize, setFirstImageSize] = useState({ width: 0, height: 0 }); // Track the size of the first image
  const [firstImageX, setFirstImageX] = useState(0);
  const [firstImageY, setFirstImageY] = useState(0);
  const [firstFrameX, setFirstFrameX] = useState(0);
  const [firstFrameY, setFirstFrameY] = useState(0);

  const fetchImage = async () => {
    try {
      console.log("Image Fetching");
      const response = await fetch('https://hoopbackend-unmihbju4a-as.a.run.app/api/first_frame');
      const blob = await response.blob();
      setImageUrl(response.url);
      const urlLink = 'https://hoopbackend-unmihbju4a-as.a.run.app/api/first_frame';
      Image.getSize(urlLink, (width, height) => {
        console.log('Image width:', width);
        console.log('Image height:', height);
        setFirstFrameX(width);
        setFirstFrameY(height);
      }, (error) => {
        console.log('Error getting image size:', error);
      });
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
    setFirstImageX(width);
    setFirstImageY(height);
    console.log(width);
    console.log(height);
  };

  // const fetchSelectRimProgress = async () => {
  //   try {
  //     setRimSelected(true)
  //     console.log("SelectRim Fetching");
  //     const response = await fetch('http://127.0.0.1:8080/api/selectRim');
  //     const blob = await response.blob();
  //     await setSelectRimURL(response.url);
  //     //setRefreshKey(refreshKey + 1);
  //     console.log(response.url)
  //   } catch (error) {
  //     console.log('Error fetching Image:', error);
  //   }
  // }; 

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
    const updatedX = firstFrameX/firstImageX * locationX
    const updatedY = firstFrameY/firstImageY * locationY
    console.log(updatedX);
    console.log(updatedY);
    const newCoord = await [...coordinates, [updatedX, updatedY]];
    const coordinatesLen = await newCoord.length;
    console.log(`coordinateslen ${coordinatesLen}`)
    await setCoordinates(newCoord)
    //await selectRimProgress(coordinatesLen)
    //await fetchSelectRimProgress()
  }

  // const selectRimProgress = async (coordinatesLen) => {
  //   try {
  //     const response = await fetch('http://127.0.0.1:8080/api/selectRim', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //         'Access-Control-Allow-Origin': '*'
  //       },
  //       body: JSON.stringify({ coordinatesLen }),
  //     });
  //     if (response.ok) {
  //       const data = await response.json();
  //       console.log(data);
  //       //fetchSelectRimProgress()
  //     } else {
  //       console.log('ResponseError:', response.status);
  //     }
  //   } catch (error) {
  //     console.log('Error:', error);
  //   }
  // };
  const handleReset = async () => {
    await setCoordinates([]);
  }
  const handleSubmit = async () => {
   if (coordinates.length == 18) { 
    try {
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
        const scoreData = await response.json();
        console.log(`ScoreData: ${scoreData}`);
        setData(scoreData)
       
      } else {
        console.log('ResponseError:', response.status);
      }
    } catch (error) {
      console.log('Error:', error);
    } finally {
      navigation.navigate('StatsPage');
      setLoading(false); // Stop loading state
    }}
    else{ coordinates.length<18?alert("You haven't chosen enough points!"):
    alert("You have chosen too many points! Click Reset");
}
  };

  const handleProceed = () => {
    setShowInstructions(false);
  };
  if (Platform.OS == 'web') {
    console.log("web")
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
                  <Image source={{ uri: imageUrl }} 
                  style={styles.imageWeb}
                   />
                </TouchableWithoutFeedback>

          ) : (
             <Text>Loading image...</Text>
          )}
        
              <Button onPress={handleSubmit} title="Submit"/>

        </>
      )}
    </View>
  );
}
else {
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
          <Text style={styles.instructions}>Please select the following points in the shown order on the court. Following that, select the points around the backboard and rim as shown by the second image.
          </Text>
          <View>
          <Image source={select_rim} style={styles.instructionImage} resizeMode='contain'></Image>
          <Image source={rim_img} style={styles.instructionImage} resizeMode='contain'></Image>
          </View>
    
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
              <Button onPress={handleReset} title="Reset" style={styles.submitButton} />
              <Button onPress={handleSubmit} title="Submit" style={styles.submitButton} />
            </View>
          </View>
          {/* <View style={styles.imageContainer}>
            <Image
              source={{ uri: `${selectRimURL}?timestamp=${new Date().getTime()}` }}
              key={coordinates}
              style={styles.image}
            />
          </View> */}
        </>
      )}
    </View>
  );
}}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  instructions: {
    marginLeft:30,
    marginRight: 30,
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
    //alignItems: 'center',
    marginLeft:20,
    marginRight: '60%',
  },
  imageWeb: {
    width: 1000,
    height: 600,
    alignItems: 'center',
    justifyContent: 'center',
    //marginTop: 'auto'
    
  },
  image: {
    width: '85%',
    height: 'auto',
    marginLeft: '100%',
    aspectRatio: 16 / 9,
  },
  instructionImage: {
    height:270,
    width: '100%',
    marginBottom: 20,
    aspectRatio: 16 / 9,
  },
  submitButton: {
    marginTop: 10,
    padding: 50,
    
  },
});

export default SelectRim;
