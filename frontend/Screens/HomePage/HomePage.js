import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Platform, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as Location from 'expo-location';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, collection } from 'firebase/firestore';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import * as DocumentPicker from 'expo-document-picker';
import { auth } from '../../firebase';

import Logo from '../SignInScreen/Images/Logo.png';

// Initialize Firebase
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

  const onFileChange = (files) => {
    const currentFile = files[0];
    console.log(currentFile);
  };

  const uploadToDatabase = async (url) => {
    const docData = {
      mostRecentUploadURL: url,
      username: auth.currentUser?.email,
    };

    try {
      await setDoc(doc(db, 'users', docData.username), docData, { merge: true });
      console.log('Successfully updated DB');
    } catch (error) {
      console.log('Error:', error);
    }
  };

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
            uploadToDatabase(downloadUrl);
            setUploadProgress(0);
          }
        );
      }
    } catch (error) {
      console.log('Error selecting file:', error);
    }
  };

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
          alert(address);
          console.log(address);
  
          try {
            // Fetch the score value from the Flask web app
            const scoreResponse = await fetch('http://127.0.0.1:5000/api/video-analysis');
            const scoreData = await scoreResponse.text();
            const score = parseFloat(scoreData);
  
            // Upload the score, email, and location to Firestore
            const collectionRef = collection(db, 'scores');
            const documentId = auth.currentUser?.uid;
            const data = {
              email: auth.currentUser?.email,
              location: address,
              score: score
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
        <TouchableOpacity style={styles.statsButton} onPress={GetCurrentLocation}>
          <Text style={styles.buttonText}>Show Location</Text>
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
    width: '100%',
    borderRadius: 10,
    marginTop: 30,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  uploadProgress: {
    marginTop: 10,
    fontSize: 16,
    color: '#777',
  },
  signOutButton: {
    backgroundColor: '#ff4136',
    width: '100%',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginTop: 20,
  },
  statsButton: {
    backgroundColor: '#90ee90',
    width: '100%',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default HomePage;
