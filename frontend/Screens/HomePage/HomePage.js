import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Platform, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as Location from 'expo-location';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, collection, Timestamp, documentId } from 'firebase/firestore';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import * as DocumentPicker from 'expo-document-picker';
import { auth } from '../../firebase';

import Logo from '../SignInScreen/Images/Logo.png';

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
const storage = getStorage(app);

const HomePage = () => {
  const navigation = useNavigation();
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploadCompleted, setIsUploadCompleted] = useState(false);
  const [coordinates, setCoordinates] = useState([]) // for SelectRim
  const [frameFound, setFrameFound] = useState(false);
  const onFileChange = (files) => {
    const currentFile = files[0];
    console.log(currentFile);
  };

  // const uploadToDatabase = async (url) => {
  //   const email = auth.currentUser?.email;
  //   const userId = auth.currentUser?.uid;

  //   const documentId = userId; // Use the user ID as the document ID in the 'scores' collection

  //   const data = {
  //     email: email,
  //     location: address,
  //     score: 80,
  //   };

  //   try {
  //     await setDoc(doc(db, 'scores', documentId), data, { merge: true });
  //     console.log('Document updated with ID:', documentId);
  //   } catch (error) {
  //     console.error('Error updating document:', error);
  //   }
  // };

  const handleClick = async () => {
    try {
      let filePickerOptions = {
        type: '*/*',
        copyToCacheDirectory: true,
      };

      if (Platform.OS !== 'web') {
        filePickerOptions = {
          ...filePickerOptions,
          multiple: false,
        };
      }

      const result = await DocumentPicker.getDocumentAsync(filePickerOptions);

      if (result.type === 'success') {
        const { name, uri } = result;
        const response = await fetch(uri);
        const blob = await response.blob();
        const userId = auth.currentUser?.uid;
        const emailId = auth.currentUser?.email;
        const filename = `${emailId}/${userId}/${name}`;

        const storageRef = ref(storage, filename);
        const uploadTask = uploadBytesResumable(storageRef, blob);

        uploadTask.on(
          'state_changed',
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setUploadProgress(progress);
          },
          (error) => {
            console.log('File upload error:', error);
            setUploadProgress(0);
          },
          async () => {
            const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
            console.log('File uploaded successfully. Download URL:', downloadUrl);
            sendDownloadUrl(downloadUrl);
            setUploadProgress(0);
            setIsUploadCompleted(true); // Set upload completion status to true
          }
        );
      }
    } catch (error) {
      console.log('Error selecting file:', error);
    }
  };

  useEffect(() => {
    if (isUploadCompleted && frameFound) {
      navigation.navigate("SelectRim")
      /** 
      navigation.navigate("StatsPage");
      GetCurrentLocation(); // Call GetCurrentLocation after upload is completed
      setIsUploadCompleted(false); // Reset upload completion status*/
    }
  }, [isUploadCompleted, frameFound]);

  const handleSignOut = () => {
    auth
      .signOut()
      .then(() => {
        navigation.replace('Sign-In');
      })
      .catch((error) => {
        alert(error.message);
      });
  };

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

          try {
            // Fetch the score value from the Flask web app
            const response = await fetch('https://hoopbackend-unmihbju4a-as.a.run.app/api/video-analysis');
            const datas = await response.json();

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


            // const totalShotsMade = 10;
            // const totalShotsTaken = 15;
            const currentDate = Timestamp.fromDate(new Date());


            const collectionRef = collection(db, 'scores', auth.currentUser?.uid, 'workouts');
            const data = {
              email: auth.currentUser?.email,
              location: address,
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

            await setDoc(doc(collectionRef, documentId), data);
            console.log('Document added with ID:', documentId);
          } catch (error) {
            console.error('Error adding document:', error);
          }
        }
      }
    } catch (error) {
      console.log('Error getting location:', error);
    }
  }

  const sendDownloadUrl = async (downloadUrl) => {
    try {
      const response = await fetch('https://hoopbackend-unmihbju4a-as.a.run.app/api/first_frame', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ downloadUrl }),
      }); 
      if (response.ok) {
        const data = await response.json();
        // Handle the response data from the Flask server
        console.log(data);
        setFrameFound(true);
      } else {
        console.log('ResponseError:', response.status);
      }
    } catch (error) {
      console.log('Error:', error);
    }
  };
  
  return (
    <View style={styles.root}>
      <View style={styles.container}>
        <Image source={Logo} style={styles.logo} resizeMode="contain" />
        <Text style={styles.title}>Hoopify</Text>
        <Text style={styles.email}>Email: {auth.currentUser?.email}</Text>

        <TouchableOpacity style={styles.uploadButton} onPress={handleClick}>
          <View style={styles.uploadButtonInner}>
            <Text style={styles.buttonText}>Upload File</Text>
          </View>
        </TouchableOpacity>

        {uploadProgress > 0 && (
          <Text style={styles.uploadProgress}>Upload Progress: {Math.round(uploadProgress)}%</Text>
        )}

        <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
          <Text style={styles.buttonText}>Sign out</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.statsButton}
          onPress={() => navigation.navigate('StatsPage')}
        >
          <Text style={styles.buttonText}>Show My Stats</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.statsButton}
          onPress={() => navigation.navigate('Leaderboard')}
        >
          <Text style={styles.buttonText}>Leaderboard</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.statsButton}
          onPress={() => navigation.navigate('CameraPage')}
        >
          <Text style={styles.buttonText}>Use My Camera</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.statsButton}
          onPress={() => navigation.navigate('ReportPage')}
        >
          <Text style={styles.buttonText}>See My Report</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'pink',
  },
  container: {
    alignItems: 'center',
  },
  logo: {
    width: '70%',
    height: 100,
    borderRadius: 10,
    marginBottom: 40,
  },
  title: {
    fontSize: 80,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 10,
    color: '#333',
  },
  email: {
    fontSize: 16,
    marginBottom: 10,
    color: '#777',
  },
  uploadButton: {
    backgroundColor: '#4287f5',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  uploadButtonInner: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  uploadProgress: {
    fontSize: 16,
    marginBottom: 10,
    color: '#777',
  },
  signOutButton: {
    backgroundColor: '#f54242',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  statsButton: {
    backgroundColor: '#42f54a',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
});

export default HomePage;
