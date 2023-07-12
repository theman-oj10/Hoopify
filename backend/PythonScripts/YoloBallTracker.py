import cv2
from ultralytics import YOLO
import numpy as np
from . import FindRim
from . import PositionTracker as pt
import os
#import tets as pex
#import test as t
left_corner_three = [0, 0]
right_corner_three = [0, 0]
left_corner = [0, 0]
right_corner = [0, 0]
left_low_post = [0, 0]
right_low_post = [0, 0]
left_high_post = [0, 0]
right_high_post = [0, 0]
top_key = [0, 0]
top_key_three = [0, 0]
left_wing_three = [0, 0]
right_wing_three = [0, 0]

paint = [0, 0]
three_point = [0, 0]
mid_range = [0, 0]
free_throw = [0, 0]


def updateHotzones(ballX, ballY, isMake):
    def handleMakeOrMiss(isMake, hotzone):
        if isMake:
            hotzone[0] += 1
            hotzone[1] += 1
        else:
            hotzone[1] += 1

    if isPaint(ballX, ballY):
        handleMakeOrMiss(isMake, paint)
    if isFreeThrow(ballX, ballY):
        handleMakeOrMiss(isMake, free_throw)
    if isMidRange(ballX, ballY):
        handleMakeOrMiss(isMake, mid_range)
        if isLeftCorner(ballX, ballY):
            handleMakeOrMiss(isMake, left_corner)
        elif isRightCorner(ballX, ballY):
            handleMakeOrMiss(isMake, right_corner)
        elif isLeftLowPost(ballX, ballY):
            handleMakeOrMiss(isMake, left_low_post)
        elif isRightLowPost(ballX, ballY):
            handleMakeOrMiss(isMake, right_low_post)
        elif isLeftHighPost(ballX, ballY):
            handleMakeOrMiss(isMake, left_high_post)
        elif isRightHighPost(ballX, ballY):
            handleMakeOrMiss(isMake, right_high_post)
        elif isTopKey(ballX, ballY):
            handleMakeOrMiss(isMake, top_key)
        else:
            return "Error"
    if isThreePoint(ballX, ballY):
        handleMakeOrMiss(isMake, three_point)
        if isLeftCornerThree(ballX, ballY):
            handleMakeOrMiss(isMake, left_corner_three)
        elif isRightCornerThree(ballX, ballY):
            handleMakeOrMiss(isMake, right_corner_three)
        elif isLeftWingThree(ballX, ballY):
            handleMakeOrMiss(isMake, left_wing_three)
        elif isRightWingThree(ballX, ballY):
            handleMakeOrMiss(isMake, right_wing_three)
        elif isTopKeyThree(ballX, ballY):
            handleMakeOrMiss(isMake, top_key_three)
        else:
            return "Error"


def isPaint(ballX, ballY):
    #paint = [[249, 0], [410, 0], [249, 252], [410, 252]]
    paint = [[226, 0], [373, 0], [226, 74], [373, 74]]
    return intersect(ballX, ballY, paint[0][0], paint[0][1], paint[1][0], paint[1][1], paint[2][0], paint[2][1],
                     paint[3][0], paint[3][1])
 

def isMidRange(ballX, ballY):
    if isPaint(ballX, ballY) or isFreeThrow(ballX, ballY):
        return False
    #lower_rectangle = [(69, 0), (591, 0), (69, 71), (591, 71)]
    #lower_rectangle = [[62, 0], [538, 0], [62, 45], [538, 45]]
    lower_rectangle = [[62, 0], [538, 0], [62, 56], [538, 56]]
    # is in lower rectangle
    if intersect(ballX, ballY, lower_rectangle[0][0], lower_rectangle[0][1], lower_rectangle[1][0],
                 lower_rectangle[1][1], lower_rectangle[2][0], lower_rectangle[2][1], lower_rectangle[3][0],
                 lower_rectangle[3][1]):
        return True
    # or in semicircle
    if ballY > lower_rectangle[2][1]:
        #return (ballX ** 2) - (661 * ballX) + 43846 <= (142 * ballY) - (ballY ** 2)
        #return (ballX ** 2) - (602 * ballX) + 63042 <= (90 * ballY)- (ballY ** 2)
        return ((ballX - 300)**2)/55696 + ((ballY - 48)**2)/26896 <= 1
    return False


def isLeftCorner(ballX, ballY):
    if not isMidRange(ballX, ballY):
        return False
    #return ballY <= 146 and ballX >= 187
    return ballY <= 94 and ballX >= 170


def isRightCorner(ballX, ballY):
    if not isMidRange(ballX, ballY):
        return False
    #return ballY <= 146 and ballX >= 477
    return ballY <= 94 and ballX >= 434


def isLeftLowPost(ballX, ballY):
    if not isMidRange(ballX, ballY):
        return False
    #return ballY <= 146 and ballX < 187
    return ballY <= 94 and ballX < 170


def isRightLowPost(ballX, ballY):
    if not isMidRange(ballX, ballY):
        return False
    #return ballY <= 146 and ballX < 477 
    return ballY <= 94 and ballX < 434


def isLeftHighPost(ballX, ballY):
    if not isMidRange(ballX, ballY):
        return False
    #return ballY > 146 and ballX <= 249
    return ballY > 94 and ballX <= 226


def isRightHighPost(ballX, ballY):
    if not isMidRange(ballX, ballY):
        return False
    #return ballY > 146 and ballX >= 410
    return ballY > 94 and ballX >= 373


def isTopKey(ballX, ballY):
    if not isMidRange(ballX, ballY) and isFreeThrow(ballX, ballY):
        return False
    if isLeftCorner(ballX, ballY) or isRightCorner(ballX, ballY) or isLeftLowPost(ballX, ballY) or isRightLowPost(ballX,ballY):
        return False
    if isLeftHighPost(ballX, ballY) or isRightHighPost(ballX, ballY):
        return False
    #return ballY > 252
    return ballY > 229


def isFreeThrow(ballX, ballY):
    #free_throw = [(249, 252), (410, 252), (249, 274), (410, 274)]
    free_throw = [[226, 162], [373, 162], [226, 176], [373, 176]]
    return intersect(ballX, ballY, free_throw[0][0], free_throw[0][1], free_throw[1][0], free_throw[1][1],free_throw[2][0], free_throw[2][1], free_throw[3][0], free_throw[3][1])

# Three Pointers
def isThreePoint(ballX, ballY):
    return not isPaint(ballX, ballY) and not isMidRange(ballX, ballY)


def isLeftCornerThree(ballX, ballY):
    if not isThreePoint(ballX, ballY):
        return False
    #return ballY >= 0 and ballY <= 146 and ballX < 80
    return ballY >= 0 and ballY <= 94 and ballX < 72


def isRightCornerThree(ballX, ballY):
    if not isThreePoint(ballX, ballY):
        return False
    #return ballY >= 0 and ballY <= 146 and ballX > 579
    return ballY >= 0 and ballY <= 94 and ballX > 527


def isLeftWingThree(ballX, ballY):
    if not isThreePoint(ballX, ballY) or isLeftCornerThree(ballX, ballY) or isRightCornerThree(ballX, ballY):
        return False
    #return ballY <= ((-141 / 109) * ballX) + (71981 / 109)
    return ballY <= ((-32 / 33) * ballX) + (6176 / 11)


def isRightWingThree(ballX, ballY):
    if not isThreePoint(ballX, ballY) or isLeftCornerThree(ballX, ballY) or isRightCornerThree(ballX, ballY):
        return False
    #return ballY <= ((298 / 217) * ballX) - (52740 / 217)
    return ballY <= ((192 / 197) * ballX) - 157.5329949


def isTopKeyThree(ballX, ballY):
    if not isThreePoint(ballX, ballY) or isLeftCornerThree(ballX, ballY) or isRightCornerThree(ballX,ballY) or isLeftWingThree(
            ballX, ballY) or isRightWingThree(ballX, ballY):
        return False
    return True


def intersect(ballX, ballY, x1, y1, x2, y2, x3, y3, x4, y4):
    # equation of rim line
    m = (y2 - y1) / (x2 - x1)
    c = y2 - (m * x2)

    minX = min(x1, x2, x3, x4)
    maxX = max(x1, x2, x3, x4)
    minY = min(y1, y2, y3, y4)
    maxY = max(y1, y2, y3, y4)
    # check if ball intersects
    # return ballY == m*ballX + c
    return minX <= ballX <= maxX and minY <= ballY <= maxY



def yoloTrack(path_to_video, coordinates, path_to_court_img):
#def yoloTrack(path_to_video):
    root_dir = os.getcwd()
    parent_dir = os.path.join(root_dir, "backend")
    current_dir = os.path.join(parent_dir, "PythonScripts")
    resources_dir = os.path.join(root_dir, "resources")
    #path_to_court_img = os.path.join(resources_dir,"court_invert.png")
    
    global left_corner_three, right_corner_three, left_corner, right_corner, left_low_post, right_low_post, left_high_post, right_high_post, top_key, top_key_three, left_wing_three, right_wing_three, paint, three_point, mid_range, free_throw
    # reset everything to (0, 0)
    left_corner_three = [0, 0]
    right_corner_three = [0, 0]
    left_corner = [0, 0]
    right_corner = [0, 0]
    left_low_post = [0, 0]
    right_low_post = [0, 0]
    left_high_post = [0, 0]
    right_high_post = [0, 0]
    top_key = [0, 0]
    top_key_three = [0, 0]
    left_wing_three = [0, 0]
    right_wing_three = [0, 0]
    paint = [0, 0]
    three_point = [0, 0]
    mid_range = [0, 0]
    free_throw = [0, 0]
    # check if paint => midrange, if yes check if free throw, or else check other midrange, => otherwise its 3 pointer
    model_path = os.path.join(current_dir, "yolov8l.pt")
    model = YOLO(model_path)
    # Filtering the classes: !Doesn't work still tracks everything
    model.classes = ['person', 'sports ball']
    # recording the rim-cordinates
    #coordinates = FindRim.find_rim(path_to_video)
    video_points = coordinates[:10]
    board_coordinates = coordinates[10:14]
    rim_coordinates = coordinates[14:]
    #board_coordinates = [(671, 104), (877, 104), (670, 227), (875, 228)]
    #rim_coordinates = [(741, 207), (806, 207), (743, 268), (806, 268)]
    def get_video_size(video_path):
        cap = cv2.VideoCapture(video_path)
        width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
        height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
        cap.release()
        return width, height
    video_width, video_height = get_video_size(path_to_video)
    width_ratio = 600 / video_width
    height_ratio = 400 / video_height
    # print(video_height)
    # print(video_width)
    # cv2.destroyAllWindows()
    print(f"board coordinates: {board_coordinates}")
    print(f"rim coordinates: {rim_coordinates}")
    results = model.predict(source=path_to_video, show=False, stream='True')
    print("results collected!")
    shots_taken = 0

    score = 0
    ball_coordinates = []
    shot_attempts = []
    made_shots = []
    def map_coordinate(x, y, width_ratio, height_ratio, vpoints):
        # Top left, Top right, Free Throw line, 3 point line centre, base line 4 coordinates left to right, high ppost left to right
        # Top left, base line 4 coordinates left to right, Top right, high post left, Free Throw line, high post right, 3 point line centre
        # video_points = np.array(
        #     [[15, 509], [187, 507], [598, 504], [951, 501], [1365, 497], [1530, 496], [511, 679],[767, 677],
        #     [1038, 672],[765, 776]], dtype=np.float32)

        video_points = np.array(vpoints, dtype=np.float32)
    
        video_points[:, 0] *= width_ratio
        video_points[:, 1] *= height_ratio
    
        court_points = np.array(
            [[0, 0], [69, 0], [249, 0], [410, 0], [591, 0], [658, 0], [249, 252], [331, 252], [410, 252], [331, 337]],
            dtype=np.float32)
    
        court_points[:, 0] *= (600 / 659)
        court_points[:, 1] *= (400 / 621)
    
        transform_matrix, _ = cv2.findHomography(video_points, court_points)
    
        # Step 5: Map the coordinate
        coordinate = np.array([[x], [y], [1]], dtype=np.float32)
        mapped_coordinate = np.dot(transform_matrix, coordinate)
        mapped_coordinate /= mapped_coordinate[2]
    
        return mapped_coordinate[0][0], mapped_coordinate[1][0]

    def check_overlap(ball_bbox, ball_x, ball_y, person_bbox, person_x, person_y):
        def get_hundredTenPercent(value):
            return value + ((1/10) * (value))
        ball_w = ball_bbox[2]
        ball_h = ball_bbox[3]
        person_w = person_bbox[2]
        person_h = person_bbox[3]
        ball_rightTop = (ball_x + ball_w / 2, ball_y + ball_h / 2)
        ball_leftTop = (ball_x - ball_w / 2, ball_y + ball_h / 2)
        ball_rightBottom = (ball_x + ball_w / 2, ball_y - ball_h / 2)
        ball_leftBottom = (ball_x - ball_w / 2, ball_y - ball_h / 2)
        person_rightTop = (person_x + person_w / 2, person_y + person_h / 2)
        person_leftTop = (person_x - person_w / 2, person_y + person_h / 2)
        person_rightBottom = (person_x + person_w / 2, person_y - person_h / 2)
        person_leftBottom = (person_x - person_w / 2, person_y - person_h / 2)

        return intersect(ball_x, ball_y, person_leftTop[0], person_leftTop[1], person_rightTop[0], person_rightTop[1],
                         person_leftBottom[0],
                         person_leftBottom[1], person_rightBottom[0], person_rightBottom[1])

    person_exists = False
    crossed_rim = False
    shot_tobeTaken = False
    shot_attempted = False
    # finding homography matrix:
    matrix = pt.find_homography_matrix(path_to_video, path_to_court_img)
    print("Homography matrix found!")
    # each result is a frame
    for result in results:
        boxes = result.boxes
        frame = 0
        # boxes contains all the bboxes in a frame
        # if a frame contains both a person and a ball
        # check if frame and ball overlap
        for box in boxes:
            if int(box.cls) == 0:  # '0' is the class index for 'person'
                personbBox = box.xywh[0]
                x_person = personbBox[0]
                height = personbBox[3]
                y_person = personbBox[1]
                # player position tracking
                # apply homography transformation
                original_coord = np.array([[x_person * width_ratio, (y_person+ height/2) * height_ratio, 1]])
                transformed_coord = np.dot(matrix, original_coord.T)
                # Normalize the transformed coordinate
                normalized_coord = transformed_coord / transformed_coord[2]
                # Extract the x and y values of the normalized coordinate
                transformed_x = normalized_coord[0, 0] * (600 / 659)
                transformed_y = normalized_coord[1, 0] * (400 / 621)
                real_x, real_y = map_coordinate(x_person * width_ratio, (y_person+ height/2) * height_ratio, width_ratio, height_ratio, video_points)
                person_exists = True
            if int(box.cls) == 32:  # '32' is the class index for 'ball'
                currbBox = box.xywh[0]
                x_center = currbBox[0]
                y_center = currbBox[1]
                # checking for # shots taken
                # check if bbox of person and ball overlap => shots to be taken
                if person_exists:
                    if check_overlap(currbBox, x_center, y_center, personbBox, x_person, y_person):
                        #print(x_person)
                        print(y_person)
                        # print('Shot to be Taken')
                        # print(f"x: {transformed_x}")
                        # print(f"y: {transformed_y}")
                        # print(f"Rx: {real_x}")
                        # print(f"Ry: {real_y}")
                        # curr_X = transformed_x
                        # curr_Y = transformed_y
                        curr_X = real_x
                        curr_Y = real_y
                        shot_tobeTaken = True
                        # bbox of person and ball no longer overlap => shot taken
                # if shot_tobeTaken and not check_overlap(currbBox, x_center, y_center, personbBox, x_person, y_person):
                #     shot_tobeTaken = False
                #     print("Shot Taken")
                #     shots_taken += 1
                #     curr_shot = (transformed_x, transformed_y)
                #     shot_attempts.append(curr_shot)
                #     print(f"x-player: {transformed_x}")
                #     print(f"y-player: {transformed_y}")
                #     person_exists = False
                if shot_tobeTaken and intersect(x_center, y_center, board_coordinates[0][0], board_coordinates[0][1], board_coordinates[1][0], board_coordinates[1][1], board_coordinates[2][0], board_coordinates[2][1], board_coordinates[3][0], board_coordinates[3][1]):
                    shot_tobeTaken = False
                    shot_attempted = True
                    print("Shot Taken")
                    shots_taken += 1
                    curr_shot = (curr_X, curr_Y)
                    shot_attempts.append(curr_shot)
                    print(f"x-player: {curr_X}")
                    print(f"y-player: {curr_Y}")
                    print(f"Rx: {real_x}")
                    print(f"Ry: {real_y}")
                    person_exists = False
                ball_coordinates.append((x_center, y_center))
                # print(ball_coordinates)
                # checking if it crosses the rim
                # check for y value then x
                # Processing rim coordinates
                leftX = min(rim_coordinates[0][0], rim_coordinates[2][0]) - 50 # Can finetune the value of 50
                rightX = max(rim_coordinates[1][0], rim_coordinates[3][0]) + 50
                topY = min(rim_coordinates[0][1], rim_coordinates[1][1]) - 50
                bottomY = max(rim_coordinates[2][1], rim_coordinates[3][1]) + 50

                if not crossed_rim and shot_attempted and intersect(x_center, y_center, leftX, topY, rightX, topY, leftX, bottomY, rightX, bottomY):
                    print("crossed rim")
                    crossed_rim = True

                if crossed_rim and not intersect(x_center, y_center, leftX, topY, rightX, topY, leftX, bottomY, rightX, bottomY):
                    score += 1
                    made_shots.append(curr_shot)
                    print(f"score: {score}")
                    crossed_rim = False
                    shot_attempted = False
                    frame = 0
                frame += 1
                # (x,y) of left end of rim, (x,y) of right of rim, (x,y) of left of net, (x,y) of right of net
    court = cv2.imread(path_to_court_img)
    court = cv2.resize(court, (600, 400))
    print(f"shots : {shot_attempts}")
    # hotzones
    for i in shot_attempts:
        currX = i[0]
        currY = i[1]
        if i in made_shots:
            made_shots.remove(i)
            cv2.circle(img=court, center=(int(currX), int(currY)), radius=5, color=(0, 255, 0), thickness=5)
            updateHotzones(currX, currY, True)
        else:
            cv2.circle(img=court, center=(int(currX), int(currY)), radius=5, color=(0, 0, 255), thickness=5)
            updateHotzones(currX, currY, False)
    #cv2.imshow("Hotzones", court)
    
    hotzones_path = os.path.join(resources_dir, "hotzones.png")
    cv2.imwrite(hotzones_path, court)
    #cv2.waitKey(0)
    # returning the co-ordinates of the center of the ball
    # zones
    zones = [[score, shots_taken], paint, free_throw, mid_range, three_point, left_corner_three, right_corner_three,
             left_corner, right_corner, left_low_post, right_low_post, left_high_post, right_high_post, top_key,
             top_key_three, left_wing_three, right_wing_three]
    fg = ['left_corner_three', 'right_corner_three', 'left_corner', 'right_corner', 'left_low_post', 'right_low_post',
          'left_high_post', 'right_high_post', 'top_key', 'top_key_three', 'left_wing_three', 'right_wing_three']
    # finding the best and worst zones (TBC)
    best_zone = 0
    #for i in range(len(zones)):
    #   curr_zone = zones[i]
    #   curr_fg = (curr_zone[0] / curr_zone[1]) * 100
    print(f"Score: {score}")
    print(f"Shots: {shots_taken}")
    # print(results)
    return zones

# need to have 2 checks
# pass through rim and the middle of the net
# first find the co-ordinates of the middle of the net
# checking if it crosses the rim

#yoloTrack("TestFootage/MAIN_TEST.mov")


