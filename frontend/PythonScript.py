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
from flask_cors import CORS
from firebase_admin import credentials, initialize_app, storage, auth, firestore
import os
from ShotTracker.YoloBallTracker import yoloTrack



app = Flask(__name__)
load_dotenv()
CORS(app)

cred = credentials.Certificate('./orbital-app-proto-firebase-adminsdk-4agc7-e26b66be8d.json')  # Path to your service account key file
initialize_app(cred, {
    'storageBucket': "orbital-app-proto.appspot.com"  
})


model = YOLO("../Yoloweights/yolov8n.pt")

classNames = ['person', 'bicycle', 'car', 'motorcycle', 'airplane', 'bus', 'train', 'truck', 'boat', 'traffic light', 'fire hydrant', 'stop sign', 'parking meter', 'bench', 'bird', 'cat', 'dog', 'horse', 'sheep', 'cow', 'elephant', 'bear', 'zebra', 'giraffe', 'backpack', 'umbrella', 'handbag', 'tie', 'suitcase', 'frisbee', 'skis', 'snowboard', 'sports ball', 'kite', 'baseball bat', 'baseball glove', 'skateboard', 'surfboard', 'tennis racket', 'bottle', 'wine glass', 'cup', 'fork', 'knife', 'spoon', 'bowl', 'banana', 'apple', 'sandwich', 'orange', 'broccoli', 'carrot', 'hot dog', 'pizza', 'donut', 'cake', 'chair', 'couch', 'potted plant', 'bed', 'dining table', 'toilet', 'tv', 'laptop', 'mouse', 'remote', 'keyboard', 'cell phone', 'microwave', 'oven', 'toaster', 'sink', 'refrigerator', 'book', 'clock', 'vase', 'scissors', 'teddy bear', 'hair drier', 'toothbrush']

def perform_video_analysis(video_path):
    return yoloTrack(video_path)


@app.route('/api/video-analysis', methods=['GET'])
def video_analysis():
    try:
        # Retrieve the video file from Firebase Storage
        # Get the currently signed-in user's email
        #user_email = auth.current_user().email
        
        bucket = storage.bucket()
        blob = bucket.blob('manoj@hoopify.com/odU7tBWDnqhcWq8qd1Xvs9CEcrQ2/shotclip.mp4')
        temp_video_path = "/Users/manojnarender/Desktop/shotclip.mp4" # Replace with the desired path for the temporary video file
        blob.download_to_filename(temp_video_path)

        # Analyze the video
        score = perform_video_analysis(temp_video_path)
        
        ''' db = firestore.client()

        # Retrieve the user based on the email
        user = auth.get_user_by_email(user_email)

        # Retrieve the userID
        userID = user.uid
        
        # Create a document reference with the userID as the document ID
        doc_ref = db.collection('scores').document(userID)

        # Set the score value in the document
        doc_ref.set({'score': score}) '''
        
        # Delete the temporary video file
        os.remove(temp_video_path)
        
        # Return the score as a response
        return f"Video analysis score: {score}"
    except Exception as e:
        return str(e)

if __name__ == '__main__':
    app.run(debug=True, port=5001)
