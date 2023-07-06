import React, { useState, useEffect } from 'react';
import { Text, View, TouchableOpacity, Platform } from 'react-native';
import { Camera } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import { Permissions } from 'react-native-unimodules';

const CameraPage = () => {
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
      if (Platform.OS === 'android') {
        const { status: audioStatus } = await Permissions.askAsync(Permissions.AUDIO_RECORDING);
        if (audioStatus !== 'granted') {
          alert('Audio recording permission not granted!');
        }
      }
    })();
  }, []);

  const startRecording = async () => {
    if (cameraRef && !recording) {
      setRecording(true);
      const video = await cameraRef.recordAsync();
      saveVideoToGallery(video.uri);
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
      console.log('Download URL:', lastVideo.uri);
    }
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
    </View>
  );
}

export default CameraPage;
