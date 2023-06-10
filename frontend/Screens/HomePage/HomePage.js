import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { auth, storage, db } from '../../firebase';
import { useNavigation } from '@react-navigation/native';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { doc, setDoc } from 'firebase/firestore';

import Logo from '../SignInScreen/Images/Logo.png';

const HomePage = () => {
  const navigation = useNavigation();
  const [uploadProgress, setUploadProgress] = useState(0);

  const onFileChange = (files) => {
    const currentFile = files[0];
    console.log(currentFile);
  };

  const uploadToDatabase = (url) => {
    const docData = {
      mostRecentUploadURL: url,
      username: auth.currentUser?.email,
    };

    const userRef = doc(db, 'users', docData.username);
    setDoc(userRef, docData, { merge: true })
      .then(() => {
        console.log('Successfully updated DB');
      })
      .catch((error) => {
        console.log('Error:', error);
      });
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
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 15,
    fontWeight: 'bold',
  },
});

export default HomePage;
