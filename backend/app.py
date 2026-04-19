from flask import Flask, Response, jsonify, send_from_directory
from flask_cors import CORS
import cv2
import numpy as np
from datetime import datetime
import os
import random

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend communication

# Music directory
MUSIC_DIR = os.path.join(os.path.dirname(__file__), 'music')

# Load face cascade
cascade_path = cv2.data.haarcascades + 'haarcascade_frontalface_default.xml'
face_cascade = cv2.CascadeClassifier(cascade_path)

# Global variable to store current emotion
current_emotion = {"emotion": "neutral", "timestamp": None, "demo_mode": True}

# Note: For production emotion detection, install deepface:
# pip install deepface
# Then use: from deepface import DeepFace
# result = DeepFace.analyze(frame, actions=['emotion'], enforce_detection=False)

# Emotion configuration
EMOTION_CONFIG = {
    "happy": {
        "color": "#FFD700",
        "bg_gradient": "linear-gradient(135deg, #FFD700 0%, #FFA500 100%)",
        "message": "You're looking happy! 🌟",
        "music": "/music/happy.mp3"
    },
    "sad": {
        "color": "#4169E1",
        "bg_gradient": "linear-gradient(135deg, #4169E1 0%, #1E3A8A 100%)",
        "message": "Feeling a bit down? Here's some calm music 🎵",
        "music": "/music/sad.mp3"
    },
    "angry": {
        "color": "#DC143C",
        "bg_gradient": "linear-gradient(135deg, #DC143C 0%, #8B0000 100%)",
        "message": "Take a deep breath... try to relax 🧘",
        "music": "/music/calm.mp3"
    },
    "surprise": {
        "color": "#9370DB",
        "bg_gradient": "linear-gradient(135deg, #9370DB 0%, #4B0082 100%)",
        "message": "Wow! Something surprising? 🎉",
        "music": "/music/happy.mp3"
    },
    "fear": {
        "color": "#2F4F4F",
        "bg_gradient": "linear-gradient(135deg, #2F4F4F 0%, #000000 100%)",
        "message": "Don't worry, you're safe here 💙",
        "music": "/music/calm.mp3"
    },
    "disgust": {
        "color": "#8B4513",
        "bg_gradient": "linear-gradient(135deg, #8B4513 0%, #654321 100%)",
        "message": "Let's change the mood! 🌈",
        "music": "/music/calm.mp3"
    },
    "neutral": {
        "color": "#6B7280",
        "bg_gradient": "linear-gradient(135deg, #6B7280 0%, #374151 100%)",
        "message": "You seem calm and focused 🎯",
        "music": "/music/calm.mp3"
    }
}


def detect_emotion_from_frame(frame):
    """Detect emotion from a single frame using DeepFace (recommended)"""
    try:
        # For now, we'll use demo mode with random emotions
        # In production, uncomment the DeepFace code below
        
        emotions = ["happy", "sad", "angry", "surprise", "neutral"]
        return random.choice(emotions)
        
        # Production code with DeepFace:
        # from deepface import DeepFace
        # result = DeepFace.analyze(frame, actions=['emotion'], enforce_detection=False)
        # if result and len(result) > 0:
        #     dominant_emotion = result[0]['dominant_emotion']
        #     return dominant_emotion
        # return None
        
    except Exception as e:
        print(f"Error detecting emotion: {e}")
        return None


def generate_frames():
    """Generator function to yield video frames with emotion detection"""
    global current_emotion
    
    # Open camera
    camera = cv2.VideoCapture(0)
    
    if not camera.isOpened():
        print("Error: Could not open camera")
        return
    
    frame_count = 0
    
    while True:
        success, frame = camera.read()
        if not success:
            break
        
        # Detect faces for visualization
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        faces = face_cascade.detectMultiScale(gray, 1.1, 4)
        
        # Draw rectangles around faces
        for (x, y, w, h) in faces:
            cv2.rectangle(frame, (x, y), (x+w, y+h), (255, 0, 0), 2)
        
        # Process emotion every 60 frames (approx every 2 seconds)
        frame_count += 1
        if frame_count % 60 == 0:
            emotion = detect_emotion_from_frame(frame)
            
            if emotion:
                current_emotion = {
                    "emotion": emotion,
                    "timestamp": datetime.now().isoformat(),
                    "demo_mode": True
                }
                print(f"🎭 Detected emotion: {emotion}")
            
            frame_count = 0  # Reset counter
        
        # Add emotion text to frame
        cv2.putText(frame, 
                   f"Emotion: {current_emotion['emotion']}", 
                   (10, 30), 
                   cv2.FONT_HERSHEY_SIMPLEX, 
                   1, 
                   (0, 255, 0), 
                   2)
        
        # Convert frame to JPEG
        ret, buffer = cv2.imencode('.jpg', frame)
        frame_bytes = buffer.tobytes()
        
        # Yield frame in MJPEG format
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n')
    
    camera.release()


@app.route('/')
def index():
    """Home endpoint"""
    return jsonify({
        "message": "Emotion Detection API is running",
        "status": "active"
    })


@app.route('/video_feed')
def video_feed():
    """Video streaming endpoint"""
    return Response(generate_frames(),
                    mimetype='multipart/x-mixed-replace; boundary=frame')


@app.route('/get_emotion')
def get_emotion():
    """Get current detected emotion"""
    return jsonify(current_emotion)


@app.route('/get_emotion_config/<emotion>')
def get_emotion_config(emotion):
    """Get UI configuration for a specific emotion"""
    config = EMOTION_CONFIG.get(emotion, EMOTION_CONFIG["neutral"])
    return jsonify(config)


@app.route('/all_emotions_config')
def all_emotions_config():
    """Get all emotion configurations"""
    return jsonify(EMOTION_CONFIG)


@app.route('/health')
def health():
    """Health check endpoint"""
    return jsonify({"status": "healthy", "timestamp": datetime.now().isoformat()})


@app.route('/music/<filename>')
def serve_music(filename):
    """Serve music files"""
    return send_from_directory(MUSIC_DIR, filename)


if __name__ == '__main__':
    print("🎬 Starting Emotion Detection API...")
    print("📷 Camera will activate when you connect to the video feed")
    print("🌐 API running on: http://localhost:5000")
    
    # Create music directory if it doesn't exist
    if not os.path.exists(MUSIC_DIR):
        os.makedirs(MUSIC_DIR)
        print(f"🎵 Created music directory at: {MUSIC_DIR}")
        print("🎵 Please add your music files (happy.mp3, sad.mp3, calm.mp3) to this directory")
    
    app.run(debug=True, host='0.0.0.0', port=5000, threaded=True)
