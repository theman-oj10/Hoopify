The Readme:
https://docs.google.com/document/d/1S0BTIQ4QMQpytQ8v_hZvGcjbfrKoIT-vESrE1p1VEwA/edit

<h1>Milestone 3 Submission</h1>

**Team Name**

Hoopify

**Proposed Level of Achievement**

Apollo 11

**Motivation**


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

Objective: Have users authenticated by email and password to secure their data and allow users to access and update their data. We used Firebase to perform this authentication. We used Firebase as it offered more than authentication services as they had a FireStore database as well and thus, it was the obvious choice to use it.


Video Analysis

Objective: The app aims to analyze basketball game videos and track players' points and field goal percentages.
Progress and Problems faced: Since the previous milestone, we completely redesigned the backend script as the previous solution was too inaccurate. We added user input where the user is required to select 14 additional points which are different points in the court. We used these points to then perform position tracking and received some splendid results. We also made the user select the 4 corners of the backboard and updated our algorithm to count a shot attempt only when it crosses into the backboard region. This helped with accuracy in counting shot attempts as it discounted passes for example. This also solved the issue we discussed in the previous milestone, which was user dribbling being counted as shot attempts.
In the previous milestone, we also talked about the issue of not having a way for users to select points, however, we managed to implement that and an instructions page to help users.

Hotzones

Objective: Implement a detailed report which shows different shooting performances across the different regions of the court.

Progress and Problems: We also managed to implement the hot zones feature in the backend. Our current backend is able to track the position of the player in the video, translate it to a position on a 2D plane and then plot that on an image of a court. We also managed to implement a way to differentiate the circles that are plotted such that green circles represent makes and red circles represent misses as shown below on a court that is customized based on our app.

We previously tried to use Hough Transform but we were unable to implement it and produce accurate results so we switched to a manual approach of making the user select point on the court and this improved our accuracy profusely. Using OpenCv’s built-in image 
manipulation tools it was then easy to plot these points and vary their colors.

The problem we faced was the accuracy of this approach and integrating this into the frontend. We were having trouble with writing this image to Firebase storage and retrieving it in the frontend. We deployed another backend server using Flask and fetched it from the frontend code. We also segmented out the image of the court so that we can get more in-depth details about shooting efficiencies in different regions of the court and the field goal percentages for the different regions are clearly segmented on the hotzones page.

Leaderboard
Objective: The objective is to create a React Native component that fetches leaderboard data from a Firestore database and displays it in a leaderboard format, with the ability to filter the data based on the user's location.

Progress:
Database and Authentication Setup: The Firestore database is initialized using getFirestore with the Firebase app instance. Firebase Authentication is imported as auth for user authentication purposes.
Leaderboard Data Retrieval: Within the component's useEffect hook, the leaderboard data is fetched from the Firestore collection named 'scores'. The data is queried with filtering options to match the current user's email and location. The fetched data is stored in the component's state variable leaderboardData using setLeaderboardData.
Render Leaderboard Items: The component defines the renderLeaderboardItem function, which takes an item's properties (such as id, score, email, and location) and renders them in a leaderboard item format. Each leaderboard item is displayed with a rank, email, and score.
Filtering by Location: The component includes logic to filter the leaderboard data based on the user's location. This ensures that only scores from the specific location are displayed in the leaderboard.
By combining the Firebase integration, leaderboard data retrieval, filtering by location, and rendering of leaderboard items, this feature aims to provide a dynamic and customizable leaderboard experience for users.

Customizable Reports

Objective: The app's primary objective is to allow users to generate customizable reports based on data collected from personal workouts or pickup games. These reports should provide insights into an individual's progress over time and offer statistics using 'hot zones' as well.

Progress: The app has successfully implemented the customizable reports feature, enabling users to generate reports based on their workout or pickup game data. These reports offer valuable insights into the user's progress and statistics, including shooting efficiency in different regions of the court ('hot zones'). Users can customize the content of the reports to focus on specific metrics and timeframes that are most relevant to them. However, one current limitation is that the report content is shared as text instead of being downloadable in a specific format (e.g., PDF or CSV). Despite this, the shared text-based reports serve the purpose of presenting the collected data and providing valuable insights to the users. Future development will focus on incorporating downloadable formats like PDF and CSV, data visualization, and cloud storage integration to further enhance the user experience and convenience.


Share Feature
Objective: We want to be able to share customized reports and leaderboard positions.

Progress: We have implemented the share feature and we can currently share the hotzones, report page, and stats page. They are available on all of these three pages.

Location Feature

Objective: Implement a feature to retrieve the user's current location and use it to fetch data from a Flask web app, store it in Firestore, and display the address.

Progress:

Permissions and Location Access: The function GetCurrentLocation starts by requesting foreground location permissions from the user using Location.requestForegroundPermissionsAsync. If the permission is not granted, an alert is displayed to the user.
Obtaining Current Location: After permission is granted, the function uses Location.getCurrentPositionAsync to retrieve the user's current coordinates. The latitude and longitude values are extracted from the response.
Reverse Geocoding: The Location.reverseGeocodeAsync function is used to obtain the address information based on the latitude and longitude values. The response is an array of address items.
Fetching Data from Flask Web App: The function then makes a request to a Flask web app to fetch data. The response is converted to JSON format, and the totalShotsMade and totalShotsTaken values are extracted.
Storing Data in Firestore: The function creates a document in the 'scores' collection of Firestore. The document ID is obtained from auth.currentUser?.uid, and the data to be stored includes the user's email, location (address), totalShotsMade, and totalShotsTaken. The setDoc function is used to add the document to Firestore.

Biggest Weaknesses and Possible Solutions
We have been able to implement an app that is effective in analyzing basketball videos but can be improved in the following ways.

Currently, the model we are using is a model trained on a default COCO dataset. While we found models online specialized to track basketballs and hoops, we were unable to train them because of hardware limitations on our personal machines. This model would improve accuracy and allow us to redesign our algorithm so that we no longer need to make the user select the rim and the backboard. It will also accommodate non-stationary videos. In terms of position tracking, we also discovered an Edge Detection algorithm which along with a Hough Transform can be implemented to automatically detect the lines on the court. If we combine this with a new model, the user will no longer have to select any points which will make our user experience far better. We can also look to add GPU support on the Google Cloud Server that we deployed our backend in as that would improve loading times to a much larger extent.

Tech Stack

Frontend: 
React-Native: One of the most popular frameworks in the industry and with existing experience in react we decided to use this to build a cross-platform application


Backend: 
Open CV: OpenCV provides a comprehensive collection of computer vision algorithms and techniques, including image filtering, feature detection, object tracking, camera calibration, and more. It covers a broad range of tasks required in computer vision applications, making it a versatile library for a wide array of projects. OpenCV has been around for a long time and is widely used in the computer vision community. If you're working on a project that relies heavily on legacy code or requires integration with existing OpenCV-based systems, sticking with OpenCV made the most sense for us as there were also Youtube tutorials that made us learn in the limited time that we had since it was more beginner friendly. However, for future developments to improve our algorithm, we hope to indulge in other models such as TensorFlow. TensorFlow and other deep learning frameworks are well-suited for complex deep learning tasks, especially those involving large-scale datasets and sophisticated neural network architectures. If you're working on advanced computer vision projects, such as image classification with deep CNNs or semantic segmentation with complex models like Mask R-CNN, TensorFlow would be a more appropriate choice due to its extensive support for deep learning.

Ultralytics: Python package that allowed us to use the Yolo model with relative ease. It offered a plug-and-play-like experience which was helpful for us as we are beginners in computer vision. It is built on top of PyTorch, and provides an easier and more beginner-friendly experience for using YOLO (You Only Look Once) models for object detection. YOLO is a popular real-time object detection algorithm known for its speed and accuracy. If you're new to computer vision and want to get started quickly with object detection using YOLO, Ultralytics offers a more straightforward implementation compared to setting up and training models from scratch using TensorFlow.

Database: 
FireStore: 
Mobile and web support: Firebase is well-suited for both mobile and web applications. It provides SDKs and libraries for various platforms and frameworks, including Android, iOS, JavaScript, and Unity, making it easier to develop cross-platform applications. 

Security and authentication: Firebase offers built-in authentication and security rules to protect data and user access. It supports various authentication providers, such as email/password, social login (e.g., Google, Facebook), and custom authentication methods.

Serverless Architecture: Firebase supports serverless architecture, meaning developers can focus more on building the front-end and user experience without worrying about server management and infrastructure.

Overall, firebase's ease of use, real-time capabilities, and extensive feature set made it an easy choice for us to work on to develop Hoopify.

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
    "child-process-promise": "^2.2.1",
    "expo": "~48.0.15",
    "expo-2d-context": "^0.0.3",
    "expo-av": "~13.2.1",
    "expo-camera": "~13.2.1",
    "expo-constants": "~14.2.1",
    "expo-document-picker": "~11.2.2",
    "expo-image-picker": "~14.1.1",
    "expo-location": "^15.1.1",
    "expo-media-library": "~15.2.3",
    "expo-sharing": "~11.2.2",
    "expo-status-bar": "~1.4.4",
    "expo-updates": "~0.16.4",
    "firebase": "^9.22.2",
    "lottie-react-native": "^5.1.4",
    "lottie-web": "^5.12.2",
    "pyodide": "^0.23.2",
    "react": "18.2.0",
    "react-dom": "18.2.0",
    "react-native": "0.71.8",
    "react-native-chart-kit": "^6.12.0",
    "react-native-fs": "^2.20.0",
    "react-native-image-size": "^1.1.3",
    "react-native-safe-area-context": "4.5.0",
    "react-native-share": "^8.2.2",
    "react-native-svg": "13.4.0",
    "react-native-view-shot": "^3.5.0",
    "react-native-web": "~0.18.11",
    "react-native-webview": "11.26.0"
  },

System Testing
We performed extensive manual unit and integration testing and recorded the results in a spreadsheet. The link is at the end of the ReadMe file.
We also performed end-to-end testing with multiple videos, which are attached at the end of the ReadMe file, and received mostly accurate results. In the first two videos, we tested we got near-perfect results both in terms of shot tracking and position tracking. In the last video, among the two shots taken, position tracking was near perfect but shot tracking was unable to track one of the shot makes as a shot make.

User Testing
We gathered a few friends who are basketball enthusiasts and made them try out the application on our local machine. We asked them the following questions:


User Testing

Since we were unable to deploy our application, we gathered a few friends who are basketball enthusiasts and made them try out the application on our local machine. We managed to get 7 responses.

Based on our limited user testing, we learned that more than implementing a myriad of features we should really work on making our core features better for milestone 2 we were ambitious and attempted to implement many features which sacrificed the accuracy of the core computer vision algorithms we were using. We also learned that the user interface is intuitive but we need to add more modern styling to make it production ready. It was great to see that a lot of these users shared the same awe we had when we started this project as we thought this is a cool application we can build.

Future Developments
Build upon the Computer Vision Technology:
Through further development, we hope to be able to analyze pickup basketball games and allow users to track each player's points, assists, rebounds, and other statistics similar to the NBA. We can also provide auto-generated highlight reels which they can share with friends and family.

Transforming Hoopify into a Basketball Social Media App:
Implement features for users to share basketball-related content, such as photos, videos, and short clips of their gameplay or favorite moments, basically taking inspiration from the popular fitness and well-being app named Strava, which is a running platform but it also developed into this community of runners who can connect through the app. We could allow users to follow each other, like, and comment on posts, fostering a sense of community and engagement among basketball enthusiasts. Implementing a tagging system to categorize posts based on basketball-related topics, teams, players, or specific skills, making it easier for users to discover content they're interested in and we can also consider adding messaging or chat functionality, so users can have private conversations and connect on a more personal level.


Development Plan

| Tasks                           | Description                                                                                                      | Date                           |
|---------------------------------|------------------------------------------------------------------------------------------------------------------|--------------------------------|
| Prepare Liftoff Poster and Video| Create Liftoff Poster and slides, record presentation pitch.                                                     | 9 - 16 May 2023                |
| Pick up necessary skills        | Pick up necessary skills of:                                                                                     | 9 - 22 May 2023                |
|                                 | - React Native: Main framework that is used to build the application                                            |                                |
|                                 | - OpenCV and Ultralytics: Python Packages used to implement the computer vision features                      |                                |
|                                 | - Firebase: Hosting, database, and authentication method                                                       |                                |
| Prototype Creation              | Create a basic version of shot detection using OpenCV and Ultralytics                                            | 16 - 22 May 2023               |
| Implement Authentication Method | Integrate Firebase authentication to the React Native application. Add an email and password authentication method for milestone 1 | 23 - 29 May 2023               |
| Create feature pages            | - Implement navigation and create a program flow of the application                                              |                                |
|                                 | - Add application design                                                                                        |                                |
|                                 | - Implement React Native styling to the application pages                                                       |                                |
| Milestone 1                     | - Ideation (Readme)                                                                                              | 29 May 2023                    |
|                                 | - Proof of concept:                                                                                             |                                |
|                                 |   - Authentication method with email and password                                                               |                                |
|                                 |   - Navigation through different essential pages                                                                |                                |
|                                 |   - Basic React Native design                                                                                    |                                |
|                                 |   - Publish user video to Firestore database                                                                    |                                |
|                                 |   - Working Python Script                                                                                       |                                |
| Build a functioning MVP         | Integrate Python Backend with Frontend React Native application                                                 | 31 May - 5 June 2023           |
| Implement Share Feature         | There will be sharing feature of the different features like reports and statistics from the workout             | 6 - 12 June 2023               |
| Implement Location Features     | - Get location data so as to map the user's home court                                                           | 13 - 19 June 2023              |
|                                 | - Implement Leaderboard features                                                                                |                                |
| Build the Hotzones Feature      | Tracks player position and maps it onto a 2D image of a basketball court to provide insights into shooting hot zones | 20 - 26 June 2023              |
| User Testing                    | User Testing done and feedback was gathered on how to improve the app                                            |                                |
| Deploy Application              | Application was deployed but having some technical issues, to be fully deployed with no issues before milestone 3  | Milestone 2: First Working Prototype (26 June 2023) |
| Implement new performance Metrics| Integrate the hot zones feature into the statistics page to provide better performance metrics                   | 26 June - 3 July 2023          |
| Improve accuracy of shot tracking| Use a model trained on custom data instead of the standard COCO Dataset                                         | 4 - 10 July 2023               |
| Polish application design       | Enhance the previous design in Milestone 2                                                                       | 11 - 17 July 2023              |
| Improve UI/UX features          | Provide more advanced features to improve user experience                                                       |                                |
| Further testing and debugging    | Perform in-depth unit, integration, and system tests for the MVP                                                 | 18 - 24 July 2023              |
| Milestone 3                     | Minimum Viable Product (24 July 2023)                                                                            |                                |
| Fix any issues or bugs          | Allocate time to fix any issues that arise during the deployment of the MVP                                      | 26 July - 23 August 2023       |
| Splashdown                      | 24 August 2023                                                                                                   |                                |


Proof Of Concept

Updated poster:
https://www.canva.com/design/DAFm1hFHDtE/VSCNmLEeHQn9Vg4_0-86yg/edit?utm_content=DAFm1hFHDtE&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton

A walkthrough of our technical proof of concept is available through the following YouTube link:
https://youtu.be/0AsMlBGDdNY

Our Application:
exp://exp.host/@adarsh1310/android-test?release-channel=default
APK build of the app: https://drive.google.com/file/d/1qxi2E68FHO2K8Xcc4n4TzCTJPF_dQ5mK/view?usp=drive_link

Project Log
Our project log is accessible through the following Google Sheets link:
https://docs.google.com/spreadsheets/d/18b8qSRASHw2Y0e9sfyVT8wtEs0Cr7e72yYXiXN5Q5Z4/edit#gid=1299696737

Testing Log
Our testing log is accessible through the following Google Sheets link:
https://docs.google.com/spreadsheets/d/1wl86yRsxOhZUhuUw8adHsaCjXWl6mPQjqestK1C8vXY/edit#gid=0

For Testing
Sample Video: https://drive.google.com/file/d/1iTuGorntEi5UNsbQeP9ovZoTd6vfJ26i/view?usp=sharing
Test Account: 
Email: manoj123@hoopify.com
Password: manoj123


