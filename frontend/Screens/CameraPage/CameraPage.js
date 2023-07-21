import { StyleSheet, Text, View, Button, SafeAreaView } from 'react-native';
import { useEffect, useState, useRef } from 'react';
import { Camera } from 'expo-camera';
import { Video } from 'expo-av';
import { shareAsync } from 'expo-sharing';
import * as MediaLibrary from 'expo-media-library';
import { auth } from '../../firebase';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, collection, Timestamp, documentId, addDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { useNavigation } from '@react-navigation/native';
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
const storage = getStorage(app);

const CameraPage = () => {
  const navigation = useNavigation();
  let cameraRef = useRef();
  const [hasCameraPermission, setHasCameraPermission] = useState();
  const [hasMicrophonePermission, setHasMicrophonePermission] = useState();
  const [hasMediaLibraryPermission, setHasMediaLibraryPermission] = useState();
  const [isRecording, setIsRecording] = useState(false);
  const [video, setVideo] = useState();
  const [frameFound, setFrameFound] = useState(false);
  const [isUploadCompleted, setIsUploadCompleted] = useState(false);

  useEffect(() => {
    (async () => {
      const cameraPermission = await Camera.requestCameraPermissionsAsync();
      const microphonePermission = await Camera.requestMicrophonePermissionsAsync();
      const mediaLibraryPermission = await MediaLibrary.requestPermissionsAsync();

      setHasCameraPermission(cameraPermission.status === "granted");
      setHasMicrophonePermission(microphonePermission.status === "granted");
      setHasMediaLibraryPermission(mediaLibraryPermission.status === "granted");
    })();
  }, []);

  if (hasCameraPermission === undefined || hasMicrophonePermission === undefined) {
    return <Text>Requesting permissions...</Text>
  } else if (!hasCameraPermission) {
    return <Text>Permission for camera not granted.</Text>
  }

  let recordVideo = async () => {
    setIsRecording(true);
    let options = {
      quality: "1080p",
      maxDuration: 60,
      mute: false
    };

    const recordedVideo = await cameraRef.current.recordAsync(options);
    setVideo(recordedVideo);
    setIsRecording(false);
  };

  let stopRecording = () => {
    setIsRecording(false);
    cameraRef.current.stopRecording();
  };


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

  let uploadToFirebaseStorage = async (videoUri) => {
    const response = await fetch(videoUri);
    const blob = await response.blob();

    const userId = auth.currentUser?.uid;
    const emailId = auth.currentUser?.email;
    const filename = `${emailId}/${userId}/${Date.now()}.mp4`;

    const storageRef = ref(storage, filename);
    const uploadTask = uploadBytesResumable(storageRef, blob);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      },
      (error) => {
        console.log('File upload error:', error);
      },
      async () => {
        const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
        sendDownloadUrl(downloadUrl);
        console.log('File uploaded successfully. Download URL:', downloadUrl);
        setIsUploadCompleted(true);
      }
    );
  };


  if (video) {
    let shareVideo = () => {
      shareAsync(video.uri).then(() => {
        setVideo(undefined);
      });
    };

    let saveVideo = async () => {
      MediaLibrary.saveToLibraryAsync(video.uri).then(() => {
        uploadToFirebaseStorage(video.uri);

      });
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

    return (
      <SafeAreaView style={styles.container}>
        <Video
          style={styles.video}
          source={{ uri: video.uri }}
          useNativeControls
          resizeMode='contain'
          isLooping
        />
        <Button title="Share" onPress={shareVideo} />
        {hasMediaLibraryPermission ? <Button title="Save" onPress={saveVideo} /> : undefined}
        <Button title="Discard" onPress={() => setVideo(undefined)} />
      </SafeAreaView>
    );
  }

  return (
    <Camera style={styles.container} ref={cameraRef}>
      <View style={styles.buttonContainer}>
        <Button title={isRecording ? "Stop Recording" : "Record Video"} onPress={isRecording ? stopRecording : recordVideo} />
      </View>
    </Camera>
  );
}

export default CameraPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContainer: {
    backgroundColor: "#fff",
    alignSelf: "flex-end"
  },
  video: {
    flex: 1,
    alignSelf: "stretch"
  }
});
