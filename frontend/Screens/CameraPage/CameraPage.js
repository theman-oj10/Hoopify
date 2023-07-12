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
        navigation.navigate("StatsPage");
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
        GetCurrentLocation();
      });
    };

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
