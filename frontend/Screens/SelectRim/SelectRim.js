import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { View, Text, Image, StyleSheet, Button, TouchableWithoutFeedback, findNodeHandle, Pressable, TouchableOpacity } from 'react-native';
import LoadingScreen from '../LoadingScreen/LoadingScreen';
import { Platform } from 'react-native';
import Instructions from './Instructions';
import select_rim from './select_rim.png'
import rim_img from './rim_img.png'
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, query, orderBy, getDocs, limit, Timestamp, setDoc, addDoc, doc } from 'firebase/firestore';
import { auth } from '../../firebase';
import * as Location from 'expo-location';

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


  async function GetCurrentLocation() {
    let { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== 'granted') {
      Alert.alert(
        'Permission not granted',
        'Allow the app to use location service.',
        [{ text: 'OK' }],
        { cancelable: false }
      );
      return;
    }

    try {
      let { coords } = await Location.getCurrentPositionAsync();

      if (coords) {
        const { latitude, longitude } = coords;
        let response = await Location.reverseGeocodeAsync({
          latitude,
          longitude,
        });

        for (let item of response) {
          let address = `${item.name}, ${item.street}, ${item.postalCode}, ${item.city}`;
          // console.log(address);
          return address;
        }
      }
    } catch (error) {
      console.log('Error getting location:', error);
    }
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
        const datas = await response.json();
        try {
          // Fetch the score value from the Flask web app
          // const response = await axios.get('https://hoopbackend-unmihbju4a-as.a.run.app/api/video-analysis');
          // const datas = await response.json();

          const totalShotsMade = datas.total.shotsMade;
          const totalShotsTaken = datas.total.shotsTaken;
          const paintShotsMade = datas.paint.shotsMade;
          const paintShotsTaken = datas.paint.shotsTaken;
          const freeThrowShotsMade = datas.free_throw.shotsMade;
          const freeThrowShotsTaken = datas.free_throw.shotsTaken;
          const midRangeShotsMade = datas.mid_range.shotsMade;
          const midRangeShotsTaken = datas.mid_range.shotsTaken;
          const threePointShotsMade = datas.three_point.shotsMade;
          const threePointShotsTaken = datas.three_point.shotsTaken;
          const leftCornerThreeShotsMade = datas.left_corner_three.shotsMade;
          const leftCornerThreeShotsTaken = datas.left_corner_three.shotsTaken;
          const rightCornerThreeShotsMade = datas.right_corner_three.shotsMade;
          const rightCornerThreeShotsTaken = datas.right_corner_three.shotsTaken;
          const leftCornerShotsMade = datas.left_corner.shotsMade;
          const leftCornerShotsTaken = datas.left_corner.shotsTaken;
          const rightCornerShotsMade = datas.right_corner.shotsMade;
          const rightCornerShotsTaken = datas.right_corner.shotsTaken;
          const leftLowPostShotsMade = datas.left_low_post.shotsMade;
          const leftLowPostShotsTaken = datas.left_low_post.shotsTaken;
          const rightLowPostShotsMade = datas.right_low_post.shotsMade;
          const rightLowPostShotsTaken = datas.right_low_post.shotsTaken;
          const leftHighPostShotsMade = datas.left_high_post.shotsMade;
          const leftHighPostShotsTaken = datas.left_high_post.shotsTaken;
          const rightHighPostShotsMade = datas.right_high_post.shotsMade;
          const rightHighPostShotsTaken = datas.right_high_post.shotsTaken;
          const topKeyShotsMade = datas.top_key.shotsMade;
          const topKeyShotsTaken = datas.top_key.shotsTaken;
          const topKeyThreeShotsMade = datas.top_key_three.shotsMade;
          const topKeyThreeShotsTaken = datas.top_key_three.shotsTaken;
          const leftWingThreeShotsMade = datas.left_wing_three.shotsMade;
          const leftWingThreeShotsTaken = datas.left_wing_three.shotsTaken;
          const rightWingThreeShotsMade = datas.right_wing_three.shotsMade;
          const rightWingThreeShotsTaken = datas.right_wing_three.shotsTaken;

          const currentDate = Timestamp.fromDate(new Date());
          const newLocation = await GetCurrentLocation();

          const collectionRef = collection(db, 'scores', auth.currentUser?.uid, 'workouts');
          const documentId = collectionRef.id;
          const newData = {
            email: auth.currentUser?.email,
            location: newLocation,
            totalShotsMade: totalShotsMade,
            totalShotsTaken: totalShotsTaken,
            paintShotsMade: paintShotsMade,
            paintShotsTaken: paintShotsTaken,
            freeThrowShotsMade: freeThrowShotsMade,
            freeThrowShotsTaken: freeThrowShotsTaken,
            midRangeShotsMade: midRangeShotsMade,
            midRangeShotsTaken: midRangeShotsTaken,
            threePointShotsMade: threePointShotsMade,
            threePointShotsTaken: threePointShotsTaken,
            leftCornerThreeShotsMade: leftCornerThreeShotsMade,
            leftCornerThreeShotsTaken: leftCornerThreeShotsTaken,
            rightCornerThreeShotsMade: rightCornerThreeShotsMade,
            rightCornerThreeShotsTaken: rightCornerThreeShotsTaken,
            leftCornerShotsMade: leftCornerShotsMade,
            leftCornerShotsTaken: leftCornerShotsTaken,
            rightCornerShotsMade: rightCornerShotsMade,
            rightCornerShotsTaken: rightCornerShotsTaken,
            leftLowPostShotsMade: leftLowPostShotsMade,
            leftLowPostShotsTaken: leftLowPostShotsTaken,
            rightLowPostShotsMade: rightLowPostShotsMade,
            rightLowPostShotsTaken: rightLowPostShotsTaken,
            leftHighPostShotsMade: leftHighPostShotsMade,
            leftHighPostShotsTaken: leftHighPostShotsTaken,
            rightHighPostShotsMade: rightHighPostShotsMade,
            rightHighPostShotsTaken: rightHighPostShotsTaken,
            topKeyShotsMade: topKeyShotsMade,
            topKeyShotsTaken: topKeyShotsTaken,
            topKeyThreeShotsMade: topKeyThreeShotsMade,
            topKeyThreeShotsTaken: topKeyThreeShotsTaken,
            leftWingThreeShotsMade: leftWingThreeShotsMade,
            leftWingThreeShotsTaken: leftWingThreeShotsTaken,
            rightWingThreeShotsMade: rightWingThreeShotsMade,
            rightWingThreeShotsTaken: rightWingThreeShotsTaken,
            date: currentDate
          };

          await addDoc(collectionRef, newData);
          console.log('Document added with ID:', documentId);
        } catch (error) {
          console.error('Error adding document:', error);
        }
        console.log(`ScoreData: ${datas}`);
        setData(datas)
       
      } else {
        console.log('ResponseError:', response.status);
      }
    } catch (error) {
      console.log('Error:', error);
    } finally {
      navigation.navigate('StatsPage');
    }}
    else{ coordinates.length<18?alert("You haven't chosen enough points!"):
    alert("You have chosen too many points! Click Reset");
}
      // setLoading(false); // Stop loading state
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
