#Milestone 1 Submission

Team Name

Hoopify

Proposed Level of Achievement

Apollo 11

Motivation

Hoopify is solving the problem of limited access to comprehensive basketball shooting statistics and analysis for players. Traditionally, players have sought out coaches to improve their basketball skills who rely on subjective assessments to evaluate their shooting performance. Hoopify aims to revolutionize this by providing a platform where players can upload their game videos and receive detailed insights and statistics. By leveraging computer vision and data analysis techniques, Hoopify analyzes the uploaded videos to extract relevant information such as shooting accuracy and shot locations. This allows players to gain a deeper understanding of their shooting performance, identify areas for improvement, and track their progress over time. Hoopify empowers players with data-driven insights, enabling them to make informed decisions, enhance their skills, and ultimately elevate their basketball game.

User Stories
As a basketball player, I want to use the app to track my shooting performance during games and practices, so that I can identify my strengths and weaknesses and focus my training efforts accordingly.
As a coach, I want to use the app to analyze my players' personal workout videos, so that I can track their shooting accuracy and provide personalized feedback and training recommendations.  
As a basketball enthusiast, I want to use the app to track my performance and compare it with that of other players around the world, so that I can improve my game and become a better player. 
As a fan of basketball, I want to use the app to compare my shooting skills with those of professional players, so that I can improve my game and learn from the best. 
As a basketball team manager, I want to use the app to track the progress of my team members, so that I can provide them with personalized training recommendations and improve their overall performance on the court. 

Scope of Project

Hoopify is a mobile and web application designed to provide comprehensive basketball shooting statistics and analysis for players. The project scope includes the use of technologies such as React Native to build the cross-platform front-end, Firebase for database management, and Python frameworks such as OpenCV and Ultralytics for shot detection and other analysis of the video.

To ensure a personalized experience and data management, Hoopify incorporates an authentication system that requires users to sign in. This allows users to securely access and manage their shooting statistics and progress.

In the home page users, have access to the following buttons:
Upload Video: Users can upload their basketball game videos to the app, which will serve as the basis for statistical analysis and tracking.
Show my Stats: Hoopify provides a user Profile that has the cumulative statistics of the user.

Share: Hoopify allows users to easily share their shooting clips and statistics with friends and teammates. This promotes social engagement, friendly competition, and collaboration among players.

Sign Out: Users can sign out of their accounts.

Features
Video Analysis
Objective: The app aims to analyze basketball game videos and track players' points, assists, and rebounds.
Progress: The video analysis feature has been developed as the backend feature of the application using Python, mainly making use of ComputerVision and other relevant packages. Basic tracking and identification algorithms are working and the counting of scores during personal workouts do work too. Further developments to the video analysis will be done by taking into account various edge cases and catering to them with more training of the model.

Game Visualization
Objective: The app should provide a visualization of the game, including a court diagram to display player positions and shot locations known as hotzone.
Progress: The game visualization (hotzones) has not been implemented. Mainly design work is needed to create a pleasant to view for the user

Customizable Reports
Objective: The app should allow users to generate customizable reports based on data collected from personal workouts or pickup games. The reports should provide insights into an individual’s progress over time and give insightful statistics using the ‘hot zones’ as well.
Progress: The customizable reports feature has not been implemented. Further development is necessary to create a reporting system that analyzes the collected data and presents it in a customizable format that is downloadable.


User-friendly Interface
Objective: The app should have an intuitive and user-friendly interface to facilitate easy navigation and usage.
Progress: The current user interface (UI) includes basic components such as the logo, title, email display, upload button, sign-out button, and stats button. Additional UI improvements are required to enhance the overall user experience and ensure a more intuitive design.

Overall Progress
The development of the app is currently focused on the authentication functionality, specifically the sign-in and sign-out features. The ability to upload videos to Firebase storage has been implemented. However, significant work remains to be done to fulfill the objectives of video analysis, game visualization, customizable reports, and UI improvements.



Proposed Program Flow


Development Plan

Tasks
Description
Date
Prepare Liftoff Poster and Video
Create Liftoff Poster and slides, record presentation pitch.
9 - 16 May 2022
Pick up necessary skills
Pick up necessary skills of:
React Native
Main framework that is used to build the application
Open CV and Ultralytics 
Python Packages used to implement the computer vision features
Firebase
Hosting, database and authentication method.
9 - 22 May 2022
Prototype Creation
Create a basic version of shot detection using Open CV and Ultralytics.
16 - 22 May 2022
Implement Authentication Method
Integrate Firebase authentication to the React Native application. Add an email and password authentication method for milestone 1.
23 - 29 May 2022
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

30 May 2022
Build a functioning MVP
Integrate Python Backend with Frontend React Native application.
31 May - 5 June 2022
Build the hot zones feature
Tracks player position and maps it onto a 2d image of a basketball court to prove insights into shooting hot zones.
6 - 12 June 2022
Implement Location Features
Get location data so as to map the user's home court.
Implement Leaderboard features
Leaderboards based on the location of the court they practice at and their efficiency at different hot zones of the court.
13 - 19 June 2022


Implement new performance Metrics.
Integrate the hot zones feature into the statistics page to provide better performance metrics.
Testing and Debugging
Provide basic testing in preparation for Milestone 2
20 - 26 June 2022
Deploy Application
Host the application to ensure its availability to the public
Milestone 2: First Working Prototype
27 June 2022
Implement Share Feature
Button to share your statistics to social media
28 June - 3 July 2022
Improve accuracy of shot tracking
Use a model trained on custom data instead of the standard COCO Dataset.
4 - 10 July 2022
Polish application design
Enhance the previous design in Milestone 2 
11 - 17 July 2022
Improve UI/UX features
Provide more advanced features in improving user experience
Further testing and debugging
Perform in-depth unit, integration and system tests for the MVP
18 - 24 July 2022
Milestone 3: Minimum Viable Product
25 July 2022
Fix any issues or bugs
Allocate time to fix any issues that arise during the deployment of the MVP
26 July - 23 August 2022
Splashdown
24 August 2022




Proof Of Concept

Updated poster:
https://www.canva.com/design/DAFiN0UdOxA/tNL6IklVD67tP9_bgCkIBA/edit?utm_content=DAFiN0UdOxA&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton

A walkthrough of our technical proof of concept is available through the following YouTube link:
https://youtu.be/2ubNL8UoxPM

Our code for the technical proof of concept is also readily available in the following github repository:
https://github.com/theman-oj10/Hoopify


Project Log

Our project log is accessible through the following Google Sheets link:
https://docs.google.com/spreadsheets/d/18b8qSRASHw2Y0e9sfyVT8wtEs0Cr7e72yYXiXN5Q5Z4/edit#gid=1299696737

