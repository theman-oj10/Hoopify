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
    cap = cv2.VideoCapture(video_path)

    myColorFinder = ColorFinder(False)
    hsvVals = {'hmin': 3, 'smin': 105, 'vmin': 42, 'hmax': 10, 'smax': 255, 'vmax': 255}
    cap.set(3, 1280)
    cap.set(4, 720)

    while True:
        success, img = cap.read()
        img = img[0:450, :]
        basketCounted = False

        results = model(img, stream=True)
        cv2.line(img, (limits[0], limits[1]), (limits[2], limits[3]), (0, 0, 255), 5)
        detections = np.empty((0, 5))
        newDetections = []

        for r in results:
            boxes = r.boxes
            for box in boxes:
                x1, y1, x2, y2 = box.xyxy[0]
                x1, y1, x2, y2 = int(x1), int(y1), int(x2), int(y2)
                w, h = x2 - x1, y2 - y1
                cv2.rectangle(img, (x1, y1), (x2, y2), (255, 0, 255), 3)
                conf = math.ceil((box.conf[0] * 100)) / 100
                cls = int(box.cls[0])
                currentClass = classNames[cls]

                if currentClass == "person" and conf > 0.3:
                    cvzone.cornerRect(img, (x1, y1, w, h), l=9, rt=5)
                    imgColor, mask = myColorFinder.update(img, hsvVals)
                    imgContours, contours = cvzone.findContours(img, mask, minArea=500)
                    currentArray = np.array([x1, y1, x2, y2, conf])
                    detections = np.vstack((detections, currentArray))

                    if contours:
                        cx, cy = contours[0]['center']
                        cv2.circle(img, (cx, cy), 5, (0, 255, 0), cv2.FILLED)
                        if limits[0] < cx < limits[2] and limits[1] - 40 < cy < limits[1] + 40:
                            if not basketCounted:
                                totalCount += 1
                                basketCounted = True
                    cvzone.putTextRect(img, f' Score: {totalCount}', (50, 50))

        resultsTracker = tracker.update(detections)

        for result in resultsTracker:
            x1, y1, x2, y2, id = result
            x1, y1, x2, y2 = int(x1), int(y1), int(x2), int(y2)
            w, h = x2 - x1, y2 - y1
            cvzone.cornerRect(img, (x1, y1, w, h), l=9, rt=2, colorR=(255, 0, 0))
            cvzone.putTextRect(img, f' {id}', (max(0, x1), max(35, y1)), scale=2, thickness=3, offset=10)

        imgContours = cv2.resize(imgContours, (0, 0), None, 0.7, 0.7)
        cv2.imshow("Image", img)
        cv2.waitKey(1)

        if cv2.waitKey(1) == ord('q'):
            break

    cap.release()
    cv2.destroyAllWindows()

    return totalCount

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
