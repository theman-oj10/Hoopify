import React, { useState } from 'react';


function SelectRim() {
    const ImageComponent = () => {
        const [coordinates, setCoordinates] = useState([])

        const handleClick = (event) => {
            const { offsetX, offsetY } = event.nativeEvent;
            const temp = coordinates.splice()
            temp = [...temp,[offsetX, offsetY]]
            setCoordinates(temp);
        }
    console.log(coordinates)
    }
  return (
    <div>
        <img
            src = "./firstFrame.png"
            alt = "firstFrame"
            onClick={handleClick}
        />
    </div>
  )
}

export default SelectRim