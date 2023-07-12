FROM python:3.11

# Set the working directory
WORKDIR /app

# Install necessary dependencies
RUN apt-get update && apt-get install -y libgl1-mesa-glx

# Copy requirements file and install dependencies
COPY requirements.txt .
RUN pip3 install --no-cache-dir -r requirements.txt

# Copy the app files
COPY backend /app/backend
COPY resources /app/resources

# Set the environment variable for Flask app
#ENV FLASK_RUN_HOST=0.0.0.0
#ENV FLASK_RUN_PORT=8080

# Expose the port on which the Flask app will run
#EXPOSE $FLASK_RUN_PORT

# Specify the command to run the Flask app
CMD ["python3", "-m", "backend.FlaskApp"]
