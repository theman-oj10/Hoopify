from flask import Flask, request, jsonify
from dotenv import load_dotenv
from ultralytics import YOLO
import cv2
import math
from sort import *
import numpy as np
from flask_cors import CORS
from ShotTracker.YoloBallTracker import yoloTrack
import requests

firebaseConfig = {
    'apiKey': "AIzaSyCHLyLBe7Bh5Q48rUK2-x8-A6A2vxk0hdI",
    'authDomain': "orbital-app-proto.firebaseapp.com",
    'projectId': "orbital-app-proto",
    'storageBucket': "orbital-app-proto.appspot.com",
    'messagingSenderId': "965591983424",
    'appId': "1:965591983424:web:759b1b999d60cfd6e6c6a5",
    'measurementId': "G-JV5TKFE1BX"
}

app = Flask(__name__)
load_dotenv()
CORS(app)

model = YOLO("../Yoloweights/yolov8n.pt")

classNames = ['person', 'bicycle', 'car', 'motorcycle', 'airplane', 'bus', 'train', 'truck', 'boat', 'traffic light', 'fire hydrant', 'stop sign', 'parking meter', 'bench', 'bird', 'cat', 'dog', 'horse', 'sheep', 'cow', 'elephant', 'bear', 'zebra', 'giraffe', 'backpack', 'umbrella', 'handbag', 'tie', 'suitcase', 'frisbee', 'skis', 'snowboard', 'sports ball', 'kite', 'baseball bat', 'baseball glove', 'skateboard', 'surfboard',
              'tennis racket', 'bottle', 'wine glass', 'cup', 'fork', 'knife', 'spoon', 'bowl', 'banana', 'apple', 'sandwich', 'orange', 'broccoli', 'carrot', 'hot dog', 'pizza', 'donut', 'cake', 'chair', 'couch', 'potted plant', 'bed', 'dining table', 'toilet', 'tv', 'laptop', 'mouse', 'remote', 'keyboard', 'cell phone', 'microwave', 'oven', 'toaster', 'sink', 'refrigerator', 'book', 'clock', 'vase', 'scissors', 'teddy bear', 'hair drier', 'toothbrush']


def perform_video_analysis(video_path):
    return yoloTrack(video_path, '/Users/manojnarender/Documents/Hoopify/frontend/ShotTracker/TestFootage/court_invert.png')


data = None  # Initialize the global variable

@app.route('/api/video-analysis', methods=['GET'])
def get_video_analysis():
    # Handle the GET request
    return jsonify(data)

@app.route('/api/video-analysis', methods=['POST'])
def post_video_analysis():
    global data  # Use the global variable
    try:
        download_url = request.json.get('downloadUrl')
        print("Downloaded!")
        # Download the video file
        response = requests.get(download_url)
        response.raise_for_status()

        # Replace with the desired path for the temporary video file
        temp_video_path = 'temp_video.mp4'

        with open(temp_video_path, 'wb') as file:
            file.write(response.content)
        print("Analyzing video!")
        # Analyze the video
        try:
            finalScore = perform_video_analysis(temp_video_path)
            #finalScore = [21, 21]
        except Exception as e:
            return "NOT WORKING"
        print("Video analyzed!")
        # Delete the temporary video file
        os.remove(temp_video_path)

        # Update the global variable
        total_shots_made = finalScore[0]
        total_shots_taken = finalScore[1]
        data = {
            'totalShotsMade': total_shots_made,
            'totalShotsTaken': total_shots_taken
        }
        return jsonify(data)
    except Exception as e:
        return str(e)


if __name__ == '__main__':
    app.run(debug=True)
