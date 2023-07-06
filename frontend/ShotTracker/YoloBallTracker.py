import cv2
from ultralytics import YOLO
import numpy as np
from . import FindRim
from . import PositionTracker as pt

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
            hotzone[0] +=1
            hotzone[1] +=1
        else:
            hotzone[1] +=1
            
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
    paint = [(249, 0), (410, 0), (249, 252), (410, 252)]
    return intersect(ballX, ballY, paint[0][0], paint[0][1], paint[1][0], paint[1][1], paint[2][0], paint[2][1], paint[3][0], paint[3][1])
    
def isMidRange(ballX, ballY):
    if isPaint(ballX, ballY) or isFreeThrow(ballX, ballY):
        return False
    lower_rectangle = [(69,0), (591,0), (69,71), (591, 71)]
    # is in lower rectangle
    if intersect(ballX, ballY, lower_rectangle[0][0], lower_rectangle[0][1],lower_rectangle[1][0], lower_rectangle[1][1], lower_rectangle[2][0], lower_rectangle[2][1], lower_rectangle[3][0], lower_rectangle[3][1]):
        return True
    # or in semicircle
    if ballY > lower_rectangle[2][1]:
        return (ballX**2) + (ballY**2) - (661 * ballX) - (142 * ballY) == -43846
    return False

def isLeftCorner(ballX, ballY):
    if not isMidRange(ballX, ballY):
        return False
    return ballY <= 146 and ballX >= 187 

def isRightCorner(ballX, ballY):
    if not isMidRange(ballX, ballY):
        return False
    return ballY <= 146 and ballX >= 477 

def isLeftLowPost(ballX, ballY):
    if not isMidRange(ballX, ballY):
        return False
    return ballY <= 146 and ballX < 187

def isRightLowPost(ballX, ballY):
    if not isMidRange(ballX, ballY):
        return False 
    return ballY <= 146 and ballX < 477 

def isLeftHighPost(ballX, ballY):
    if not isMidRange(ballX, ballY):
        return False
    return ballY > 146 and ballX <= 249

def isRightHighPost(ballX, ballY):
    if not isMidRange(ballX, ballY):
        return False
    return ballY > 146 and ballX >= 410

def isTopKey(ballX, ballY):
    if not isMidRange(ballX, ballY) and isFreeThrow(ballX, ballY):
        return False
    if isLeftCorner(ballX, ballY) or isRightCorner(ballX, ballY) or isLeftLowPost(ballX, ballY) or isRightLowPost(ballX, ballY):
        return False
    if isLeftHighPost(ballX, ballY) or isRightHighPost(ballX, ballY):
        return False
    return ballY > 146 and ballX >= 410

def isFreeThrow(ballX, ballY):
    free_throw = [(249, 252), (410, 252), (249, 274), (410, 274)]
    return intersect(ballX, ballY, free_throw[0][0], free_throw[0][1],free_throw[1][0], free_throw[1][1], free_throw[2][0], free_throw[2][1], free_throw[3][0], free_throw[3][1]) 

# Three Pointers
def isThreePoint(ballX, ballY):
    return not isPaint(ballX, ballY) and not isMidRange(ballX, ballY)

def isLeftCornerThree(ballX, ballY):
    if not isThreePoint(ballX, ballY):
        return False
    return ballY >= 0 and ballY <= 146 and ballX < 80

def isRightCornerThree(ballX, ballY):
    if not isThreePoint(ballX, ballY):
        return False
    return ballY >= 0 and ballY <= 146 and ballX > 579

def isLeftWingThree(ballX, ballY):
    if not isThreePoint(ballX, ballY) or isLeftCornerThree(ballX, ballY) or isRightCornerThree(ballX, ballY):
        return False
    return ballY <= ((-141/109)*ballX) + (71981/109)

def isRightWingThree(ballX, ballY):
    if not isThreePoint(ballX, ballY) or isLeftCornerThree(ballX, ballY) or isRightCornerThree(ballX, ballY):
        return False
    return ballY <= ((298/217)*ballX) - (52740/217)

def isTopKeyThree(ballX, ballY):
    if not isThreePoint(ballX, ballY) or isLeftCornerThree(ballX, ballY) or isRightCornerThree(ballX, ballY) or isLeftWingThree(ballX, ballY) or isRightWingThree(ballX, ballY):
        return False
    return True
    
def intersect(ballX, ballY, x1, y1, x2, y2, x3, y3, x4, y4):
    # equation of rim line
    m = (y2 - y1)/(x2 - x1)
    c = y2 - (m * x2)

    minX = min(x1, x2, x3, x4)
    maxX = max(x1, x2, x3, x4)
    minY = min(y1, y2, y3, y4)
    maxY = max(y1, y2, y3, y4)
    # check if ball intersects
    #return ballY == m*ballX + c
    return minX <= ballX <= maxX and minY <= ballY <= maxY
def yoloTrack(path_to_video, coordinates):
    path_to_court_img = '/Users/manojnarender/Documents/Hoopify/frontend/ShotTracker/TestFootage/court_invert.png'
    global left_corner_three, right_corner_three,left_corner, right_corner, left_low_post, right_low_post, left_high_post, right_high_post, top_key, top_key_three, left_wing_three, right_wing_three, paint, three_point, mid_range, free_throw
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
    #check if paint => midrange, if yes check if free throw, or else check other midrange, => otherwise its 3 pointer
    
    model = YOLO('yolov8l.pt')
    # Filtering the classes: !Doesn't work still tracks everything
    model.classes = ['person', 'sports ball']
    # recording the rim-cordinates
    #rim_coordinates = FindRim.find_rim(path_to_video)
    #rim_coordinates = [(737, 205), (813, 206), (744, 268), (804, 265)]
    rim_coordinates = coordinates 
    # checking shot attempts
    # in possesion => overlap between ball and person bbox

    #cv2.destroyAllWindows()
    print(f"rim coordinates: {rim_coordinates}")
    results = model.predict(source=path_to_video, show=False, stream='True')
    print("results collected!")
    shots_taken = 0
    crossed_rim = False
    score = 0
    ball_coordinates = []
    shot_attempts = []
    made_shots = []
    def check_overlap(ball_bbox, ball_x, ball_y, person_bbox, person_x, person_y):
        ball_w = ball_bbox[2]
        ball_h = ball_bbox[3]
        person_w = person_bbox[2]
        person_h = person_bbox[3]
        ball_rightTop = (ball_x + ball_w/2, ball_y + ball_h/2)
        ball_leftTop = (ball_x - ball_w/2, ball_y + ball_h/2)
        ball_rightBottom = (ball_x + ball_w / 2, ball_y - ball_h / 2)
        ball_leftBottom = (ball_x - ball_w / 2, ball_y - ball_h / 2)
        person_rightTop = (person_x + person_w / 2, person_y + person_h / 2)
        person_leftTop = (person_x - person_w / 2, person_y + person_h / 2)
        person_rightBottom = (person_x + person_w / 2, person_y - person_h / 2)
        person_leftBottom =(person_x - person_w / 2, person_y - person_h / 2)

        return intersect(ball_x, ball_y, person_leftTop[0], person_leftTop[1], person_rightTop[0], person_rightTop[1], person_leftBottom[0],
                         person_leftBottom[1], person_rightBottom[0], person_rightBottom[1])
    person_exists = False
    shot_tobeTaken = False
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
            if int(box.cls) == 0: # '0' is the class index for 'person'
                personbBox = box.xywh[0]
                x_person = personbBox[0]
                y_person = personbBox[1]
                # player position tracking
                # apply homography transformation
                original_coord = np.array([[x_person, y_person, 1]])
                transformed_coord = np.dot(matrix, original_coord.T)
                # Normalize the transformed coordinate
                normalized_coord = transformed_coord / transformed_coord[2]
                # Extract the x and y values of the normalized coordinate
                transformed_x = normalized_coord[0, 0]
                transformed_y = normalized_coord[1, 0]
                person_exists = True
            if int(box.cls) == 32:  # '32' is the class index for 'ball'
                currbBox = box.xywh[0]
                x_center = currbBox[0]
                y_center = currbBox[1]
                # checking for # shots taken
                # check if bbox of person and ball overlap => shots to be taken
                if person_exists:
                    if check_overlap(currbBox, x_center, y_center, personbBox, x_person, y_person):
                        print('Shot to be Taken')
                        shot_tobeTaken = True
                        # bbox of person and ball no longer overlap => shot taken
                if shot_tobeTaken and not check_overlap(currbBox, x_center, y_center, personbBox, x_person, y_person):
                    shot_tobeTaken = False
                    print("Shot Taken")
                    shots_taken += 1
                    curr_shot = (transformed_x, transformed_y)
                    shot_attempts.append(curr_shot)
                    print(f"x-player: {transformed_x}")
                    print(f"y-player: {transformed_y}")
                    person_exists = False
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
                        made_shots.append(curr_shot)
                        print(f"score: {score}")
                        crossed_rim = False
                        frame = 0
                frame += 1
                    # (x,y) of left end of rim, (x,y) of right of rim, (x,y) of left of net, (x,y) of right of net
    court = cv2.imread(path_to_court_img)
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
    cv2.imwrite("frontend/hotzones.png", court)
    #cv2.waitKey(0)
    # returning the co-ordinates of the center of the ball
    print(f"Score: {score}")
    print(f"Shots: {shots_taken}")
    # print(results)
    return [[score, shots_taken], paint, free_throw, mid_range, three_point, left_corner_three, right_corner_three,left_corner, right_corner, left_low_post, right_low_post, left_high_post, right_high_post, top_key, top_key_three, left_wing_three, right_wing_three]

# need to have 2 checks
# pass through rim and the middle of the net
# first find the co-ordinates of the middle of the net
# checking if it crosses the rim

# yoloTrack("TestFootage/MAIN_TEST.mov", "TestFootage/court_invert.png")

