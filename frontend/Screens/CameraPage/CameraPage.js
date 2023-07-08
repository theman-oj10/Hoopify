import React, { useState, useEffect } from 'react';
import { Text, View, TouchableOpacity, Platform } from 'react-native';
import { Camera } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import { useNavigation } from '@react-navigation/native';

const CameraPage = () => {
  const navigation = useNavigation();
  const [cameraRef, setCameraRef] = useState(null);
  const [recording, setRecording] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        alert('Camera permission not granted!');
      }
      const { status: mediaStatus } = await MediaLibrary.requestPermissionsAsync();
      if (mediaStatus !== 'granted') {
        alert('Media Library permission not granted!');
      }
    })();
  }, []);

  const startRecording = async () => {
    if (cameraRef && !recording) {
      setRecording(true);
      const video = await cameraRef.recordAsync();
      const downloadUrl = await saveVideoToGallery(video.uri);
      console.log('Download URL:', downloadUrl);
      setRecording(false);
    }
  };

  const stopRecording = () => {
    if (cameraRef && recording) {
      cameraRef.stopRecording();
      setRecording(false);
    }
  };

  const saveVideoToGallery = async (videoUri) => {
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        throw new Error('Media Library permission not granted!');
      }
  
      const asset = await MediaLibrary.createAssetAsync(videoUri);
      const album = await MediaLibrary.getAlbumAsync('Download');
      if (album == null) {
        await MediaLibrary.createAlbumAsync('Download', asset, false);
      } else {
        await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
      }
  
      const albumAssets = await MediaLibrary.getAssetsAsync({ album });
      if (albumAssets?.assets.length > 0) {
        const lastVideo = albumAssets.assets[0];
        return lastVideo.uri;
      } else {
        throw new Error('No video found in the album.');
      }
    } catch (error) {
      console.log('Error saving video to gallery:', error);
      return null;
    }
  };
  
  const goToHome = () => {
    navigation.navigate('Home'); // Replace 'Home' with the name of your home screen
  };

  return (
    <View style={{ flex: 1 }}>
      <Camera
        style={{ flex: 1 }}
        ref={(ref) => setCameraRef(ref)}
        type={Camera.Constants.Type.back}
      />
      <View style={{ flex: 0.1, flexDirection: 'row', justifyContent: 'center' }}>
        <TouchableOpacity
          onPress={startRecording}
          style={{ backgroundColor: 'red', padding: 10, margin: 10 }}
        >
          <Text style={{ color: '#fff' }}>Record</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={stopRecording}
          style={{ backgroundColor: 'blue', padding: 10, margin: 10 }}
        >
          <Text style={{ color: '#fff' }}>Stop</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity onPress={goToHome}>
        <Text>Go to Home</Text>
      </TouchableOpacity>
    </View>
  );
};

export default CameraPage;
