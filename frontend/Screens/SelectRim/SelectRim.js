import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';

function SelectRim() {
    const [imageUrl, setImageUrl] = useState("")
    const [coordinates, setCoordinates] = useState([])
    const navigation = useNavigation();
    useEffect(() => {
        fetchImage(); 
    }, []);
    const handleClick = (event) => {
        const { offsetX, offsetY } = event.nativeEvent;
        console.log(offsetX)
        console.log(offsetY)
        const new_coord = [...coordinates,[offsetX, offsetY]]
        setCoordinates(new_coord);
    }
    console.log(coordinates)
    const fetchImage = async () => {
        try {
            console.log("Image Fetching")
            const response = await fetch('http://127.0.0.1:5000/api/first_frame')
            const blob = await response.blob()
            const url = URL.createObjectURL(blob)
            setImageUrl(url)
        }
        catch (error) {
            console.log('Error fetching Image:', error);
        }
        if (!imageUrl) {
            return <div>Loading...</div>; // Placeholder for the loading state
        }   
    }

    const handleSubmit = async (event) =>  {
        // send coordinates to backend
        try {
            if (coordinates.length < 18){
                alert("You haven't chosen enough points!")
                return ;
            }

            const response = await fetch('http://127.0.0.1:5000/api/video-analysis', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify({"coordinates" : coordinates}),
            });
  
        if (response.ok) {
            const data = await response.json();
            // Handle the response data from the Flask server
            console.log(data);
            // navigate to stats page after video analysis is done
            navigation.navigate('StatsPage')
        } else {
            console.log('ResponseError:', response.status);
            }
        } catch (error) {
            console.log('Error:', error);
        }
        
    }
  return (
    <div>
        <img
            src = {imageUrl}
            alt = "firstFrame"
            onClick={handleClick}
        />
        <button onClick={handleSubmit}>Submit</button>
    </div>
  )
}


export default SelectRim