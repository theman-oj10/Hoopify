from flask import Flask, request, jsonify, send_file, make_response
#from flask_socketio import SocketIO, emit
from dotenv import load_dotenv
from ultralytics import YOLO
import cv2
import math
import numpy as np
from flask_cors import CORS
from PythonScripts.YoloBallTracker import yoloTrack
#from backend.PythonScripts.YoloBallTracker import yoloTrack
import requests
import os
# from firebase_admin import credentials, initialize_app
# cred = credentials.Certificate("firebase_admin")
# initialize_app(cred)
# Flask Setup
app = Flask(__name__)
load_dotenv()
CORS(app, resources={r"/*": {"origins": "*"}})
# socketio = SocketIO(app, transports='websocket') # configuring websocket
# @socketio.on('connect', namespace="/")
# def handle_connect():
#     try:
#         print('WebSocket Client connected')
#     except Exception as e:
#         print(str(e))

# @socketio.on('disconnect')
# def handle_disconnect():
#     try:
#         print('WebSocket Client disconnected')
#     except Exception as e:
#         print(str(e))
# @socketio.on_error()        # Handles the default namespace
# def error_handler(e):
#     print(e)

# Setting up Key directories
parent_dir = os.getcwd()
current_dir = os.path.join(parent_dir,"backend")
resources_dir = os.path.join(parent_dir, "resources")
court_img = os.path.join(resources_dir, "court_invert.png")
path_to_select_rim = os.path.join(resources_dir, "select_rim.png")
select_rim = cv2.imread(path_to_select_rim)
data = None  # Initialize the global variable
# {1: [38,28], 2:[91,28], 3: [216, 28], 4: [384, 28], 5: [507, 28],
# 6: [561, 28], 7: [216, 168], 8: [300, 168], 9: [384,168], 10: [300, 214] }
path_to_updated_rim = os.path.join(resources_dir, "updated_rim.png") 
cv2.imwrite(path_to_updated_rim, select_rim)
rim_selected = False
@app.route('/api/selectRim', methods=['GET'])
def get_select_rim():
    if not rim_selected:
        return send_file(path_to_select_rim)
    return send_file(path_to_updated_rim)    
# problem: the page is initialised with the old updated rim pic, 
# any changes is not being reflected bcos frontend is not fetching
@app.route('/api/selectRim', methods=['POST'])
def post_select_rim():
    global rim_selected
    rim_selected = True
    positions = [[38,28], [91,28], [216, 28], [384, 28], [507, 28], [561, 28], [216, 168], [300, 168], [384,168], [300, 214]]
    select_rim = cv2.imread(path_to_select_rim)
    cv2.imwrite(path_to_updated_rim, select_rim)
    try:
        index = request.json.get('coordinatesLen')
        print(f"Number of points selected: {index}")
        # index will be length of coordinates array
        for i in range(len(positions)):
            if i == index:
                break
            currPos = positions[i]
            cv2.circle(img=select_rim, center=(currPos[0], currPos[1]), radius=5, color=(0, 255, 0), thickness=5)
        #path_to_updated_rim = os.path.join(resources_dir, "updated_rim.png")
        cv2.imwrite(path_to_updated_rim, select_rim)
        return jsonify("Updated Select Rim")
    except Exception as e:
        return jsonify(str(e)) 
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
        #emit('message', 'Analyzing video!', broadcast=True)
        temp_video_path = os.path.join(resources_dir, "temp_video.mp4")
        first_frame_path = os.path.join(resources_dir, "firstFrame.png")
        # Analyze the video
        finalScore = yoloTrack(temp_video_path, coordinates, court_img)
        #finalScore = [0, 0]
        print("Video analyzed!")
        #emit('message', 'Video Analyzed!!', broadcast=True)
        
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
        #emit('message', 'Collecting Your Shooting Data!', broadcast=True)
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
        #emit('message', 'Almost Done!', broadcast=True)
        response = jsonify(data)
        response.headers.add("Access-Control-Allow-Origin", "*")
        return response, 200
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
    #socketio.run(app, debug=True)
    #app.run(host='0.0.0.0', port=8080)
    app.run(port=int(os.environ.get("PORT", 8080)),host='0.0.0.0',debug=True)

    
