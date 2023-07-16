import React, { useEffect, useState } from 'react';

function Instructions(coordinates) {
    const [step1, setStep1] = useState(false)
    const [step2, setStep2] = useState(false)
    const [boardSelect, setBoardSelect] = useState(false)
    const [rimSelect, setRimSelect] = useState(false)

    coordinates.length <= 4 ? setStep1(true) : setStep1(false)
    !step1 && coordinates.length <= 8 ? setStep2(true) : setStep2(false)
    !step2 && coordinates.length <= 12 ? setBoardSelect(true) : setBoardSelect(false)
    !boardSelect && coordinates.length <= 12 ? setRimSelect(true) : setRimSelect(false)

    if (step1) {
        return (
        <div>
            {coordinates.map((value, index) => (
            <div
                key={index}
                style={{
                width: 50,
                height: 50,
                borderRadius: '50%',
                margin: 10,
                backgroundColor: index < values.length ? 'green' : 'red',
                }}
            ></div>
            ))}
        </div>
    )}
    
    if (step2) {
        return (
        <div>
            {values.map((value, index) => (
            <div
                key={index}
                style={{
                width: 50,
                height: 50,
                borderRadius: '50%',
                margin: 10,
                backgroundColor: index < coordinates.length-4 ? 'green' : 'red',
                }}
            ></div>
            ))}
        </div>
    )}   
}

export default Instructions

