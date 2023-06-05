from flask import Flask, request, jsonify
from werkzeug.utils import secure_filename
from dotenv import load_dotenv
from ultralytics import YOLO
import cv2
import cvzone
from cvzone.ColorModule import ColorFinder
import math
from sort import *
import numpy as np
import pyrebase
from ShotTracker import YoloBallTracker


app = Flask(__name__)
load_dotenv()

firebaseConfig = {
  'apiKey': "AIzaSyCHLyLBe7Bh5Q48rUK2-x8-A6A2vxk0hdI",
  'authDomain': "orbital-app-proto.firebaseapp.com",
  'projectId': "orbital-app-proto",
  'storageBucket': "orbital-app-proto.appspot.com",
  'messagingSenderId': "965591983424",
  'appId': "1:965591983424:web:759b1b999d60cfd6e6c6a5",
  'measurementId': "G-JV5TKFE1BX"
}

firebase = pyrebase.initialize_app(firebaseConfig)
storage = firebase.storage()

model = YOLO("../Yoloweights/yolov8n.pt")

classNames = ['person', 'bicycle', 'car', 'motorcycle', 'airplane', 'bus', 'train', 'truck', 'boat', 'traffic light', 'fire hydrant', 'stop sign', 'parking meter', 'bench', 'bird', 'cat', 'dog', 'horse', 'sheep', 'cow', 'elephant', 'bear', 'zebra', 'giraffe', 'backpack', 'umbrella', 'handbag', 'tie', 'suitcase', 'frisbee', 'skis', 'snowboard', 'sports ball', 'kite', 'baseball bat', 'baseball glove', 'skateboard', 'surfboard', 'tennis racket', 'bottle', 'wine glass', 'cup', 'fork', 'knife', 'spoon', 'bowl', 'banana', 'apple', 'sandwich', 'orange', 'broccoli', 'carrot', 'hot dog', 'pizza', 'donut', 'cake', 'chair', 'couch', 'potted plant', 'bed', 'dining table', 'toilet', 'tv', 'laptop', 'mouse', 'remote', 'keyboard', 'cell phone', 'microwave', 'oven', 'toaster', 'sink', 'refrigerator', 'book', 'clock', 'vase', 'scissors', 'teddy bear', 'hair drier', 'toothbrush']

limits = [580, 160, 650, 160]
totalCount = 0
tracker = Sort(max_age=20, min_hits=3, iou_threshold=0.3)
detections = np.empty((0, 5))
basketCounted = False
previousDetections = []

def perform_video_analysis(video_path):
    return YoloBallTracker.yoloTrack(video_path)

@app.route('/api/video-analysis', methods=['POST'])
def video_analysis():
    # Check if the request contains a file
    if 'video' not in request.files:
        return jsonify({'error': 'No video file found'})

    video_file = request.files['video']

    # Save the video file
    filename = secure_filename(video_file.filename)
    video_path = f'uploads/{filename}'
    video_file.save(video_path)

    # Perform video analysis using your Python code
    score = perform_video_analysis(video_path)

    # Delete the local video file after analysis
    os.remove(video_path)

    # Return the analysis score
    return jsonify({'score': score})

if __name__ == '__main__':
    app.run(debug=True)
