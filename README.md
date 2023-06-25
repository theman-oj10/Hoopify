The Readme:
https://docs.google.com/document/d/1S0BTIQ4QMQpytQ8v_hZvGcjbfrKoIT-vESrE1p1VEwA/edit
<h2>Milestone 2 Submission</h2>

Motivation

Hoopify is solving the problem of limited access to comprehensive basketball shooting statistics and analysis for players. Traditionally, players have sought out coaches to improve their basketball skills who rely on subjective assessments to evaluate their shooting performance. Hoopify aims to revolutionize this by providing a platform where players can upload their game videos and receive detailed insights and statistics. By leveraging computer vision and data analysis techniques, Hoopify analyzes the uploaded videos to extract relevant information such as shooting accuracy and shot locations. This allows players to gain a deeper understanding of their shooting performance, identify areas for improvement, and track their progress over time. Hoopify empowers players with data-driven insights, enabling them to make informed decisions, enhance their skills, and ultimately elevate their basketball game.

User Stories

As a basketball player, I want to use the app to track my shooting performance during practices, so that I can identify my strengths and weaknesses and focus my training efforts accordingly.
As a coach, I want to use the app to analyze my players' personal workout videos, so that I can track their shooting accuracy and provide personalized feedback and training recommendations.  
As a basketball enthusiast, I want to use the app to track my performance and compare it with that of other players around the world, so that I can improve my game and become a better player. 
As a fan of basketball, I want to use the app to compare my shooting skills with those of professional players, so that I can improve my game and learn from the best. 
As a basketball team manager, I want to use the app to track the progress of my team members, so that I can provide them with personalized training recommendations and improve their overall performance on the court. 

Scope of Project

Hoopify is a mobile and web application designed to provide comprehensive basketball shooting statistics and analysis for players. The project scope includes the use of technologies such as React Native to build the cross-platform front-end, Firebase for database management, and Python frameworks such as OpenCV and Ultralytics for shot detection and other analysis of the video.

To ensure a personalized experience and data management, Hoopify incorporates an authentication system that requires users to sign in. This allows users to securely access and manage their shooting statistics and progress.

On the home page users, have access to the following buttons:
Upload Video: Users can upload their basketball game videos to the app, which will serve as the basis for statistical analysis and tracking.
Show my Stats: Hoopify provides a user Profile that has the cumulative statistics of the user.

Share: Hoopify allows users to easily share their shooting clips and statistics with friends and teammates. This promotes social engagement, friendly competition, and collaboration among players.

Sign Out: Users can sign out of their accounts.

Features and Progress

Authentication System

Objective: Have users authenticated by email and password to secure their data and allow users to access and update their data.
Progress: It works as required.

Video Analysis

Objective: The app aims to analyze basketball game videos and track players' points and field goal percentages.
Progress and Problems faced: Since the previous milestone we have been able to develop the backend script such that now we can calculate the number of shot attempts. To do this we implemented an algorithm that checks if the bounding box of the ball overlaps with the bounding box of the person. When it no longer overlaps, we track it as a shot taken.


A problem we faced with this algorithm is that passing and even dribbling will lead to miscounting of shots attempted. While passing is not a big issue considering the fact that we are targeting single-person shooting workouts, the inaccuracy caused because of dribbling is an issue we cannot yet solve. One possible solution we have in mind is to only count shots if they reach the bounding box of the backboard behind the rim but this again is not a perfect solution because this won’t count airballs that completely miss the backboard.

Another problem we faced was finding a way to allow the user to select the coordinates of the rim. In our milestone 1 submission, we were able to do it in the backend using a Python interactive GUI where the user can click on the four corners of the rim. We tried to implement this in the frontend itself as we need user input for this feature.

The above code works as its own module but we are yet to integrate this into our main application. Once this is done we can already use the code used to extract the first frame of a video which is defined in the backend. After sending the first frame back to the frontend the user will select the rim coordinates, which we pass back to the backend to run the video analysis.

For another improvement, we hope to use a custom-trained model. We tried to do this but were unable to secure a computer with a high-end Nvidia graphics card. Training this on a regular computer could take unreasonable amounts of time. However, we believe performance will improve tremendously if we are able to do this.

Hotzones

Objective: Implement a detailed report which shows different shooting performances across the different regions of the court.

Progress and Problems: We also managed to implement the hot zones feature in the backend. Our current backend is able to track the position of the player in the video, translate it to a position on a 2D plane and then plot that on an image of a court. We also managed to implement a way to differentiate the circles that are plotted such that green circles represent makes and red circles represent misses.

To extract player positions from a 3D space and plot them on a 2D image of a court, we utilized the Hough transform for line detection. The process involves analyzing a video or series of frames captured from a 3D perspective, such as a basketball game recording. First, we processed each frame to make it more suitable for line detection and then we used the to detect the court boundaries and lines using edge detection algorithms. Then, by using the Hough transform, I identified the lines representing the court lines, including the key features like sidelines, baseline, and midcourt lines. Once the court lines were extracted, I mapped these lines onto the 2D image of the court using a homography matrix, essentially projecting the 3D court onto a 2D plane. By doing this, I obtained a top-down view of the court where I could determine the positions of players relative to the court lines. Using OpenCv’s built-in image 
manipulation tools it was then easy to plot these points and vary their colors.
The problem we faced was the accuracy of this approach and integrating this into the frontend. We were having trouble with writing this image to Firebase storage and retrieving it in the frontend. Once we figure this out, displaying it on the hotzones page (rendering it within a react native component) should be relatively easy. We also want to segment out the image of the court so that we can get more in-depth details about shooting efficiencies in different regions of the court and this is something we hope to achieve by milestone 3.

Leaderboard

Objective: The objective is to create a React Native component that fetches leaderboard data from a Firestore database and displays it in a leaderboard format, with the ability to filter the data based on the user's location.

Progress:
Database and Authentication Setup: The Firestore database is initialized using getFirestore with the Firebase app instance. Firebase Authentication is imported as auth for user authentication purposes.
Leaderboard Data Retrieval: Within the component's useEffect hook, the leaderboard data is fetched from the Firestore collection named 'scores'. The data is queried with filtering options to match the current user's email and location. The fetched data is stored in the component's state variable leaderboardData using setLeaderboardData.
Render Leaderboard Items: The component defines the renderLeaderboardItem function, which takes an item's properties (such as id, score, email, and location) and renders them in a leaderboard item format. Each leaderboard item is displayed with a rank, email, and score.
Filtering by Location: The component includes logic to filter the leaderboard data based on the user's location. This ensures that only scores from the specific location are displayed in the leaderboard.



By combining the Firebase integration, leaderboard data retrieval, filtering by location, and rendering of leaderboard items, this feature aims to provide a dynamic and customizable leaderboard experience for users.

Customizable Reports

Objective: The app should allow users to generate customizable reports based on data collected from personal workouts or pickup games. The reports should provide insights into an individual’s progress over time and give insightful statistics using the ‘hot zones’ as well.
Progress: The customizable reports feature has not been implemented. Further development and data such as shooting efficiency in different regions of the court is necessary to create a reporting system that analyzes the collected data and presents it in a customizable format that is downloadable. 

Share Feature

Objective: We want to be able to share customized reports and leaderboard positions.
Progress: We have implemented the share feature and we can currently share the workout score. Once we develop the customizable reports and fully develop the leaderboard we will integrate the share features into those as well.

Location Feature

Objective: Implement a feature to retrieve the user's current location and use it to fetch data from a Flask web app, store it in Firestore, and display the address.

Progress:
Permissions and Location Access: The function GetCurrentLocation starts by requesting foreground location permissions from the user using Location.requestForegroundPermissionsAsync. If the permission is not granted, an alert is displayed to the user.
Obtaining Current Location: After permission is granted, the function uses Location.getCurrentPositionAsync to retrieve the user's current coordinates. The latitude and longitude values are extracted from the response.
Reverse Geocoding: The Location.reverseGeocodeAsync function is used to obtain the address information based on the latitude and longitude values. The response is an array of address items.
Fetching Data from Flask Web App: The function then makes a request to a Flask web app to fetch data. The response is converted to JSON format, and the totalShotsMade and totalShotsTaken values are extracted.
Storing Data in Firestore: The function creates a document in the 'scores' collection of Firestore. The document ID is obtained from auth.currentUser?.uid, and the data to be stored includes the user's email, location (address), totalShotsMade, and totalShotsTaken. The setDoc function is used to add the document to Firestore.

Overall Progress

We have almost fully implemented all the features except the hotzones feature which just needs some work on the frontend and the customizable report feature. Furthermore, the algorithm used to analyze the videos needs significant improvements as the accuracy is still lacking and we do not want that to compromise users’ experience. From user testing, we have gained valuable insight on which direction we should be headed towards and it has pointed us in the right way. Hence, there is still work to be done regarding the features and overall deployment of the app before testing can be carried out.

Tech Stack

Frontend: 
React-Native: One of the most popular frameworks in the industry and with existing experience in react we decided to use this to build a cross-platform application
Backend: 
Open CV: OpenCV provides a comprehensive collection of computer vision algorithms and techniques, including image filtering, feature detection, object tracking, camera calibration, and more. It covers a broad range of tasks required in computer vision applications, making it a versatile library for a wide array of projects.

Ultralytics: Python package that allowed us to use the Yolo model with relative ease. It offered a plug-and-play-like experience which was helpful for us as we are beginners in computer vision.


Database: 
FireStore: 
Mobile and web support: Firebase is well-suited for both mobile and web applications. It provides SDKs and libraries for various platforms and frameworks, including Android, iOS, JavaScript, and Unity, making it easier to develop cross-platform applications. 

Security and authentication: Firebase offers built-in authentication and security rules to protect data and user access. It supports various authentication providers, such as email/password, social login (e.g., Google, Facebook), and custom authentication methods.
Others:
Github: Version Control as it is the industry standard.
 
Dependencies

    "@expo/webpack-config": "^18.0.1",
    "@react-native-firebase/app": "^18.0.0",
    "@react-native-firebase/auth": "^18.0.0",
    "@react-native-firebase/firestore": "^18.0.0",
    "@react-native-firebase/storage": "^18.0.0",
    "@react-navigation/native": "^6.1.6",
    "@react-navigation/native-stack": "^6.9.12",
    "axios": "^1.4.0",
    "expo": "~48.0.15",
    "expo-constants": "~14.2.1",
    "expo-document-picker": "~11.2.2",
    "expo-image-picker": "~14.1.1",
    "expo-location": "^15.1.1",
    "expo-status-bar": "~1.4.4",
    "firebase": "^9.22.2",
    "pyodide": "^0.23.2",
    "react": "18.2.0",
    "react-dom": "18.2.0",
    "react-native": "0.71.8",
    "react-native-safe-area-context": "4.5.0",
    "react-native-share": "^8.2.2",
    "react-native-web": "~0.18.11"

User Testing

Since we were unable to deploy our application, we gathered a few friends who are basketball enthusiasts and made them try out the application on our local machine. We managed to get 7 responses.

Based on our limited user testing, we learned that more than implementing a myriad of features we should really work on making our core features better for milestone 2 we were ambitious and attempted to implement many features which sacrificed the accuracy of the core computer vision algorithms we were using. We also learned that the user interface is intuitive but we need to add more modern styling to make it production ready. It was great to see that a lot of these users shared the same awe we had when we started this project as we thought this is a cool application we can build.

Development Plan

Tasks
Description
Date
Prepare Liftoff Poster and Video
Create Liftoff Poster and slides, record presentation pitch.
9 - 16 May 2023
Pick up necessary skills
Pick up necessary skills of:
React Native
Main framework that is used to build the application
Open CV and Ultralytics 
Python Packages used to implement the computer vision features
Firebase
Hosting, database and authentication method.
9 - 22 May 2023
Prototype Creation
Create a basic version of shot detection using Open CV and Ultralytics.
16 - 22 May 2023
Implement Authentication Method
Integrate Firebase authentication to the React Native application. Add an email and password authentication method for milestone 1.
23 - 29 May 2023
Create feature pages
Implement navigation and create a program flow of the application
Add application design
Implement React Native styling to the application pages
Milestone 1:
- Ideation (Readme)
- Proof of concept:
Authentication method with email and password
Navigation through different essential pages
Basic React Native design
Publish user video to Firestore database
Working Python Script.

29 May 2023
Build a functioning MVP
Integrate Python Backend with Frontend React Native application.
31 May - 5 June 2023
Implement Share Feature
There will be sharing feature of the different features like reports and statistics from the workout.
6 - 12 June 2023
Implement Location Features
Get location data so as to map the user's home court.
Implement Leaderboard features
Leaderboards based on the location of the court they practice at and their efficiency at different hot zones of the court.
13 - 19 June 2023


Build the Hotzones Feature
Tracks player position and maps it onto a 2d image of a basketball court to prove insights into shooting hot zones.
User Testing
User Testing done and feedback was gathered on how to improve the app.
20 - 26 June 2023
Deploy Application
Application was deployed but having some technical issues so to be fully deployed with no issues before milestone 3.
Milestone 2: First Working Prototype
26 June 2023
Implement new performance Metrics.
Integrate the hot zones feature into the statistics page to provide better performance metrics.
26 June - 3 July 2023
Improve accuracy of shot tracking
Use a model trained on custom data instead of the standard COCO Dataset.
4 - 10 July 2023
Polish application design
Enhance the previous design in Milestone 2 
11 - 17 July 2023
Improve UI/UX features
Provide more advanced features in improving user experience
Further testing and debugging
Perform in-depth unit, integration, and system tests for the MVP
18 - 24 July 2023
Milestone 3: Minimum Viable Product
24 July 2023
Fix any issues or bugs
Allocate time to fix any issues that arise during the deployment of the MVP
26 July - 23 August 2023
Splashdown
24 August 2023


Proof Of Concept

Updated poster:
https://www.canva.com/design/DAFm1hFHDtE/VSCNmLEeHQn9Vg4_0-86yg/edit?utm_content=DAFm1hFHDtE&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton

A walkthrough of our technical proof of concept is available through the following YouTube link:
https://youtu.be/c586yd6thO8

Our code for the technical proof of concept is also readily available in the following GitHub repository:
https://github.com/theman-oj10/Hoopify


Project Log

Our project log is accessible through the following Google Sheets link:
https://docs.google.com/spreadsheets/d/18b8qSRASHw2Y0e9sfyVT8wtEs0Cr7e72yYXiXN5Q5Z4/edit#gid=1299696737

