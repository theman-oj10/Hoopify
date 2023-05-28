import cv2
from ultralytics import YOLO
import FindRim

def intersect(ballX, ballY, x1, x2, y1, y2, x3, y3, x4, y4):
    # equation of rim line
    m = (y2 - y1)/(x2 - x1)
    c = y2 - (m * x2)

    # check if ball intersects
    return ballY == m*ballX + c
def yoloTrack(path):
    model = YOLO('yolov8l.pt')
    # Filtering the classes: !Doesn't work still tracks everything
    model.classes = ['person', 'sports ball']

    # recording the rim-cordinates
    rim_coordinates = FindRim.find_rim(path)
    # checking shot attempts
    # in possesion => overlap between ball and person bbox

    #cv2.destroyAllWindows()
    print(f"rim coordinates: {rim_coordinates}")
    results = model.predict(source=path, show=True, device='mps', stream='True')
    crossed_rim = False
    crossed_net = False
    score = 0
    ball_coordinates = []
    for result in results:
        boxes = result.boxes
        frame = 0
        for box in boxes:
            if int(box.cls) == 32:  # '32' is the class index for 'ball'
                currbBox = box.xywh[0]
                x_center = currbBox[0]
                y_center = currbBox[1]
                ball_coordinates.append((x_center, y_center))
                #print(ball_coordinates)
                # checking if it crosses the rim
                # check for y value then x
                x1 = rim_coordinates[0][0] - 10
                y1 = rim_coordinates[0][1] + 10
                x2 = rim_coordinates[1][0] + 10
                y2 = rim_coordinates[1][1] + 10
                x3 = rim_coordinates[2][0] - 10
                y3 = rim_coordinates[2][1] - 10
                x4 = rim_coordinates[3][0] + 10
                y4 = rim_coordinates[3][1] - 10
                if min(y1, y2, y3, y4) < y_center < max(y1, y2, y3, y4) and min(x1, x2, x3, x4) < x_center < max(x1, x2, x3, x4):
                        print("crossed rim")
                        crossed_rim = True
                else:
                    if crossed_rim:
                        score +=1
                        print(f"score: {score}")
                        crossed_rim = False
                        frame = 0
                frame += 1
                # (x,y) of left end of rim, (x,y) of right of rim, (x,y) of left of net, (x,y) of right of net

    # returning the co-ordinates of the center of the ball
    print(f"Score: {score}")
    # print(results)
    return score

# need to have 2 checks
# pass through rim and the middle of the net
# first find the co-ordinates of the middle of the net
# checking if it crosses the rim

yoloTrack("TestFootage/shotclip.mp4")

