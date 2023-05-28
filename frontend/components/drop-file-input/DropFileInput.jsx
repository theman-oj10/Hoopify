import React, { useRef, useState } from 'react';
import { View, Text, Image, StyleSheet, TextInput, KeyboardAvoidingView, ScrollView, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';

import { ImageConfig } from '../../config/ImageConfig.js'; 
import uploadImg from '../../assets/cloud-upload-regular-240.png';

const DropFileInput = props => {

    const wrapperRef = useRef(null);

    const [fileList, setFileList] = useState([]);

    const onDragEnter = () => wrapperRef.current.classList.add('dragover');

    const onDragLeave = () => wrapperRef.current.classList.remove('dragover');

    const onDrop = () => wrapperRef.current.classList.remove('dragover');

    const onFileDrop = (e) => {
        const newFile = e.target.files[0];
        if (newFile) {
            const updatedList = [newFile];
            setFileList(updatedList);
            props.onFileChange(updatedList);
        }
    }

    const fileRemove = (file) => {
        const updatedList = [...fileList];
        updatedList.splice(fileList.indexOf(file), 1);
        setFileList(updatedList);
        props.onFileChange(updatedList);
    }

    return (
    <>
        <View
        ref={wrapperRef}
        style={styles.dropFileInput}
        onDragEnter={onDragEnter}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        >
        <View style={styles.dropFileInputLabel}>
            <Image style={styles.dropFileInputLabelImg} source={uploadImg} />
        </View>
        <TouchableOpacity style={styles.dropFileInputInput} onPress={onFileDrop} />
        </View>
        {fileList.length > 0 ? (
        <View style={styles.dropFilePreview}>
            <Text style={styles.dropFilePreviewTitle}>Ready to upload</Text>
            {fileList.map((item, index) => (
            <View key={index} style={styles.dropFilePreviewItem}>
                <Image style={styles.dropFilePreviewItemImg} source={ImageConfig[item.type.split('/')[1]] || ImageConfig['default']} />
                <View style={styles.dropFilePreviewItemInfo}>
                <Text>{item.name}</Text>
                <Text>{item.size}B</Text>
                </View>
                <TouchableOpacity style={styles.dropFilePreviewItemDel} onPress={() => fileRemove(item)}>
                <Text>x</Text>
                </TouchableOpacity>
            </View>
            ))}
        </View>
        ) : null}
    </>
    );   
};

const styles = StyleSheet.create({
    dropFileInput: {
      position: 'relative',
      width: '100%', // Adjusted to fit within the screen width
      height: 200,
      borderWidth: 2,
      borderColor: 'var(--border-color)', // Replace with actual border color
      borderRadius: 20,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'var(--input-bg)', // Replace with actual background color
      marginBottom: 20, // Added margin at the bottom
    },
    dropFileInputLabel: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    dropFileInputLabelImg: {
      width: '50%', // Adjusted to fit within the parent container
      aspectRatio: 1, // Maintain aspect ratio
    },
    dropFileInputInput: {
      opacity: 0,
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      cursor: 'pointer',
    },
    dropFilePreview: {
      marginTop: 30,
    },
    dropFilePreviewTitle: {
      marginBottom: 20,
    },
    dropFilePreviewItem: {
      position: 'relative',
      flexDirection: 'row',
      marginBottom: 10,
      backgroundColor: 'var(--input-bg)', // Replace with actual background color
      padding: 15,
      borderRadius: 20,
    },
    dropFilePreviewItemImg: {
      width: 50,
      height: 50, // Adjusted width and height for better visibility
      marginRight: 20,
    },
    dropFilePreviewItemInfo: {
      flex: 1,
      justifyContent: 'center',
    },
    dropFilePreviewItemDel: {
      backgroundColor: 'var(--box-bg)', // Replace with actual background color
      width: 40,
      height: 40,
      borderRadius: 50,
      alignItems: 'center',
      justifyContent: 'center',
      position: 'absolute',
      right: 10,
      top: '50%',
      transform: [{ translateY: -50 }],
      shadowColor: 'var(--box-shadow)', // Replace with actual shadow color
      cursor: 'pointer',
      opacity: 0,
      transition: 'opacity 0.3s ease',
    },
  });
  
  

DropFileInput.propTypes = {
    onFileChange: PropTypes.func
}

export default DropFileInput;