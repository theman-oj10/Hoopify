import { StyleSheet, Text, View } from 'react-native'
import React from 'react';
import { loadPyodide } from 'pyodide';

export const initializePython = async () => {
  await loadPyodide({
    indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.18.1/full/',
  });
};

export const runVideoAnalysis = async () => {
    const result = await window.pyodide.runPython(`
      from your_custom_python_module import video_analysis
  
      # Call the video analysis function
      analysis_result = video_analysis(videoFilePath)
  
      # Return the result
      analysis_result
    `);
  
    return result;
  };

export default PythonScript

const styles = StyleSheet.create({})