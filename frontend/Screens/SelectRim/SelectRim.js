import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import LoadingScreen from '../LoadingScreen/LoadingScreen';

function SelectRim() {
  const [imageUrl, setImageUrl] = useState("");
  const [coordinates, setCoordinates] = useState([]);
  const [loading, setLoading] = useState(false); // Track loading state
  const [messages, setMessages] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const socket = new WebSocket('ws://127.0.0.1:5000/');

    socket.onopen = () => {
      console.log('WebSocket connection established');
    };

    socket.onmessage = (event) => {
      const message = event.data;
      console.log('Received message:', message);
      setMessages((prevMessages) => [message, ...prevMessages]);
    };

    socket.onclose = () => {
      console.log('WebSocket connection closed');
    };

    // Clean up the WebSocket connection
    return () => {
      socket.close();
    };
  }, []);

  useEffect(() => {
    fetchImage();
  }, []);

  const handleClick = (event) => {
    const { offsetX, offsetY } = event.nativeEvent;
    console.log(offsetX);
    console.log(offsetY);
    const newCoord = [...coordinates, [offsetX, offsetY]];
    setCoordinates(newCoord);
  };

  console.log(coordinates);

  const fetchImage = async () => {
    try {
      console.log("Image Fetching");
      const response = await fetch('http://127.0.0.1:5000/api/first_frame');
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setImageUrl(url);
    } catch (error) {
      console.log('Error fetching Image:', error);
    }
  };

  const handleSubmit = async () => {
    // send coordinates to backend
    try {
      if (coordinates.length < 18) {
        alert("You haven't chosen enough points!");
        return;
      }

      setLoading(true); // Start loading state

      const response = await fetch('http://127.0.0.1:5000/api/video-analysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ coordinates }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data);
        // navigate to stats page after video analysis is done
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

  if (!imageUrl || loading) {
    return (
      <>
        <LoadingScreen>Loading...</LoadingScreen>
        <h3>{messages[0]}</h3>
      </>
    ); // Placeholder for the loading state
  }

  return (
    <div>
      <img src={imageUrl} alt="firstFrame" onClick={handleClick} />
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
}

export default SelectRim;
