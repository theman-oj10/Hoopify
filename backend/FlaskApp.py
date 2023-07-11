from flask import Flask, request, jsonify, send_file, make_response
from flask_socketio import SocketIO, emit
from dotenv import load_dotenv
from ultralytics import YOLO
import cv2
import math
import numpy as np
from flask_cors import CORS
from PythonScripts.YoloBallTracker import yoloTrack
import requests
from PythonScripts.FindRim import getFirstFrame
import os
from firebase_admin import credentials, initialize_app
cred = credentials.Certificate("firebase_admin")
initialize_app(cred)
firebaseConfig = {
    'apiKey': "AIzaSyCHLyLBe7Bh5Q48rUK2-x8-A6A2vxk0hdI",
    'authDomain': "orbital-app-proto.firebaseapp.com",
    'projectId': "orbital-app-proto",
    'storageBucket': "orbital-app-proto.appspot.com",
    'messagingSenderId': "965591983424",
    'appId': "1:965591983424:web:759b1b999d60cfd6e6c6a5",
    'measurementId': "G-JV5TKFE1BX"
}
# Flask Setup
app = Flask(__name__)
load_dotenv()
CORS(app, resources={r"/*": {"origins": "*"}})
socketio = SocketIO(app, transports='websocket') # configuring websocket
@socketio.on('connect', namespace="/")
def handle_connect():
    try:
        print('WebSocket Client connected')
    except Exception as e:
        print(str(e))

@socketio.on('disconnect')
def handle_disconnect():
    try:
        print('WebSocket Client disconnected')
    except Exception as e:
        print(str(e))
@socketio.on_error()        # Handles the default namespace
def error_handler(e):
    print(e)
# NOTE RUN after you CD into backend
# Setting up Key directories
current_dir = os.getcwd()
parent_dir = os.path.dirname(current_dir)
resources_dir = os.path.join(parent_dir, "resources")

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
        #os.remove("hotzones.png") # remove prev hotzones check if you need
        coordinates = request.json.get('coordinates')
        print(coordinates)
        print("Analyzing video!")
        emit('message', 'Analyzing video!', broadcast=True)
        temp_video_path = os.path.join(resources_dir, "temp_video.mp4")
        first_frame_path = os.path.join(resources_dir, "firstFrame.png")
        # Analyze the video
        finalScore = yoloTrack(temp_video_path, coordinates)
        #finalScore = [0, 0]
        print("Video analyzed!")
        emit('message', 'Video Analyzed!!', broadcast=True)
        
        # Delete the temporary video file and first frame
        os.remove(temp_video_path)
        os.remove(first_frame_path)
        # Update the global variable
        total_shots_made, total_shots_taken = finalScore[0][0], finalScore[0][1]
        paint_made, paint_attempt = finalScore[1][0], finalScore[1][1]
        free_throw_made, free_throw_attempt = finalScore[2][0], finalScore[2][1]
        mid_range_made, mid_range_attempt = finalScore[3][0], finalScore[3][1]
        three_point_made, three_point_attempt = finalScore[4][0], finalScore[4][1]
        
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
        emit('message', 'Collecting Your Shooting Data!', broadcast=True)
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
        emit('message', 'Almost Done!', broadcast=True)
        return jsonify(data)
    except Exception as e:
        return jsonify(str(e)) 
    
@app.route('/api/first_frame', methods=['POST'])
def post_first_frame():
    global data  # Use the global variable
    try:
        download_url = request.json.get('downloadUrl')
        
        # Download the video file
        response = requests.get(download_url)
        response.raise_for_status()
        print("Downloaded!")
        # Replace with the desired path for the temporary video file
        temp_video_path = os.path.join(resources_dir, 'temp_video.mp4')
        with open(temp_video_path, 'wb') as file:
            file.write(response.content)
        print("Getting First Frame!")  
        # Getting First frame
        cap = cv2.VideoCapture(temp_video_path)
        success, img = cap.read()
        firstFramePath = os.path.join(resources_dir, "firstFrame.png")
        cv2.imwrite(firstFramePath, img)
        cap.release()
        
        print("First Frame Found!")
        response = jsonify("firstFrame")
        response.headers.add("Access-Control-Allow-Origin", "*")
        return response, 200
    except Exception as e:
        return jsonify(str(e))

@app.route('/api/first_frame', methods=['GET'])
def get_first_frame():
    # Handle the GET request
    file_path = "firstFrame.png"
    file_path = os.path.join(resources_dir, file_path)
    return send_file(file_path)

@app.route('/api/hotzones', methods=['GET'])
def get_hotzones():
    # Handle the GET request
    file_path = "hotzones.png"
    file_path = os.path.join(resources_dir, file_path)
    return send_file(file_path)

if __name__ == '__main__':
    socketio.run(app, debug=True)
    #app.run(debug=True)
    
