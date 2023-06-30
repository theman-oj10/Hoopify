from flask import Flask, request, jsonify, send_file, make_response
from dotenv import load_dotenv
from ultralytics import YOLO
import cv2
import math
from sort import *
import numpy as np
from flask_cors import CORS
from ShotTracker.YoloBallTracker import yoloTrack
import requests
from ShotTracker.FindRim import getFirstFrame

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

data = None  # Initialize the global variable

@app.route('/', methods=['GET'])
def home():
    # Handle the GET request
    return "Hello Backend"

@app.route('/api/video-analysis', methods=['GET'])
def get_video_analysis():
    # Handle the GET request
    return jsonify(data)

@app.route('/api/video-analysis', methods=['POST'])
def post_video_analysis():
    global data  # Use the global variable
    try:
        coordinates = request.json.get('coordinates')
        print(coordinates)
        print("Analyzing video!")
        # Analyze the video
        try:
            finalScore = yoloTrack('frontend/temp_video.mp4', coordinates)
            #finalScore = [0, 0]
        except Exception as e:
            print(str(e))
            return jsonify(str(e))
        print("Video analyzed!")
        # Delete the temporary video file and first frame
        os.remove('frontend/temp_video.mp4')
        os.remove('frontend/firstFrame.png')
        # Update the global variable
        total_shots_made, total_shots_taken = finalScore[0][0], finalScore[0][1]
        paint_made, paint_attempt = finalScore[1][0], finalScore[1][1]
        mid_range_made, mid_range_attempt = finalScore[2][0], finalScore[2][1]
        three_point_made, three_point_attempt = finalScore[3][0], finalScore[3][1]
        free_throw_made, free_throw_attempt = finalScore[4][0], finalScore[4][1]
        left_corner_three_made, left_corner_three_attempt = finalScore[5][0], finalScore[5][1] 
        right_corner_three_made, right_corner_three_attempt = finalScore[6][0], finalScore[6][1]
        left_corner_made, left_corner_attempt = finalScore[7][0], finalScore[7][1]
        right_corner_made, right_corner_attempt = finalScore[8][0], finalScore[8][1]
        left_low_post_made, left_low_post_attempt = finalScore[9][0], finalScore[9][1]
        right_low_post_made,right_low_post_attempt = finalScore[10][0], finalScore[10][1]
        left_high_post_made,left_high_post_attempt = finalScore[11][0], finalScore[11][1]
        right_high_post_made,right_high_post_attempt = finalScore[12][0], finalScore[12][1]
        top_key_made,top_key_attempt = finalScore[13][0], finalScore[13][1]
        top_key_three_made,top_key_three_attempt = finalScore[14][0], finalScore[14][1]
        left_wing_three_made,left_wing_three_attempt = finalScore[15][0], finalScore[15][1]
        right_wing_three_made,right_wing_three_attempt = finalScore[16][0], finalScore[16][1]
        
        data = {
            "total": { "shotsMade" : total_shots_made, "shotsTaken": total_shots_taken},
            "paint": { "shotsMade" : paint_made, "shotsTaken": paint_attempt},
            "free_throw": { "shotsMade" : free_throw_made, "shotsTaken": free_throw_attempt},
            "mid_range" : { "shotsMade" : mid_range_made, "shotsTaken": mid_range_attempt},
            "three_point": { "shotsMade" : three_point_made, "shotsTaken": three_point_attempt},
            "left_corner_three": { "shotsMade" : left_corner_three_made, "shotsTaken": left_corner_three_attempt},
            "right_corner_three": { "shotsMade" : right_corner_three_made, "shotsTaken": right_corner_three_attempt},
            "left_corner": { "shotsMade" : left_corner_made, "shotsTaken": left_corner_attempt},
            "right_corner": { "shotsMade" : right_corner_made, "shotsTaken": right_corner_attempt},
            "left_low_post": { "shotsMade" : left_low_post_made, "shotsTaken": left_low_post_attempt},
            "right_low_post": { "shotsMade" : right_low_post_made, "shotsTaken": right_low_post_attempt},
            "left_high_post": { "shotsMade" : left_high_post_made, "shotsTaken": left_high_post_attempt},
            "right_high_post": { "shotsMade" : right_high_post_made, "shotsTaken": right_high_post_attempt},
            "top_key": { "shotsMade" : top_key_made, "shotsTaken": top_key_attempt},
            "top_key_three": { "shotsMade" : top_key_three_made, "shotsTaken": top_key_three_attempt},
            "left_wing_three": { "shotsMade" : left_wing_three_made, "shotsTaken": left_wing_three_attempt},
            "right_wing_three": { "shotsMade" : right_wing_three_made, "shotsTaken": right_wing_three_attempt}
        }
        print(data)
        return jsonify(data)
    except Exception as e:
        return str(e) 
    
@app.route('/api/first_frame', methods=['POST'])
def post_first_frame():
    global data  # Use the global variable
    try:
        download_url = request.json.get('downloadUrl')
        print("Downloaded!")
        # Download the video file
        response = requests.get(download_url)
        response.raise_for_status()

        # Replace with the desired path for the temporary video file
        temp_video_path = 'frontend/temp_video.mp4'

        with open(temp_video_path, 'wb') as file:
            file.write(response.content)
        print("Getting First Frame!")  
        # Getting First frame
        cap = cv2.VideoCapture(temp_video_path)
        success, img = cap.read()
        cv2.imwrite("frontend/firstFrame.png", img)
        cap.release()
        
        print("First Frame Found!")
        response = jsonify("firstFrame")
        #response.headers.add("Access-Control-Allow-Origin")
        return response, 201
    except Exception as e:
        return str(e)

@app.route('/api/first_frame', methods=['GET'])
def get_first_frame():
    # Handle the GET request
    file_path = "firstFrame.png"
    return send_file(file_path)

@app.route('/api/hotzones', methods=['GET'])
def get_hotzones():
    # Handle the GET request
    file_path = "hotzones.png"
    return send_file(file_path)

if __name__ == '__main__':
    app.run(debug=True)
