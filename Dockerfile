FROM python:3.11

COPY requirements.txt .
RUN pip3 install --no-cache-dir -r requirements.txt

COPY . .
ENV FLASK_APP=/backend/FlaskApp.py 
ENV FLASK_RUN_HOST=0.0.0.0

# Expose the port on which the Flask app will run
EXPOSE 5000

CMD ["flask", "run"]
