"""
Face Recognition API using Flask and face_recognition library
Install: pip install flask face_recognition opencv-python pillow numpy
"""

from flask import Flask, request, jsonify
import face_recognition
import numpy as np
import base64
import io
from PIL import Image
import cv2
import os
import json
from datetime import datetime

app = Flask(__name__)

# Thư mục lưu face data
FACE_DATA_DIR = "face_data"
os.makedirs(FACE_DATA_DIR, exist_ok=True)

# Ngưỡng confidence (0.6 = 60% giống)
# Giảm xuống 0.5 để dễ nhận diện hơn (có thể điều chỉnh)
RECOGNITION_THRESHOLD = 0.5


def base64_to_image(base64_string):
    """Convert base64 string to numpy array image"""
    # Remove header if exists
    if ',' in base64_string:
        base64_string = base64_string.split(',')[1]
    
    image_data = base64.b64decode(base64_string)
    image = Image.open(io.BytesIO(image_data))
    return np.array(image)


def save_face_encoding(user_id, encoding, photo_path):
    """Lưu face encoding vào file"""
    data = {
        'user_id': user_id,
        'encoding': encoding.tolist(),
        'photo_path': photo_path,
        'registered_at': datetime.now().isoformat()
    }
    
    file_path = os.path.join(FACE_DATA_DIR, f"user_{user_id}.json")
    with open(file_path, 'w') as f:
        json.dump(data, f)


def load_all_face_encodings():
    """Load tất cả face encodings từ database"""
    encodings = []
    user_ids = []
    
    for filename in os.listdir(FACE_DATA_DIR):
        if filename.endswith('.json'):
            file_path = os.path.join(FACE_DATA_DIR, filename)
            with open(file_path, 'r') as f:
                data = json.load(f)
                encodings.append(np.array(data['encoding']))
                user_ids.append(data['user_id'])
    
    return encodings, user_ids


@app.route('/api/face/register', methods=['POST'])
def register_face():
    """Đăng ký khuôn mặt mới"""
    try:
        data = request.json
        user_id = data.get('user_id')
        image_base64 = data.get('image')
        
        if not user_id or not image_base64:
            return jsonify({
                'success': False,
                'message': 'Missing user_id or image'
            }), 400
        
        # Convert base64 to image
        image = base64_to_image(image_base64)
        
        # Detect face locations
        face_locations = face_recognition.face_locations(image)
        
        if len(face_locations) == 0:
            return jsonify({
                'success': False,
                'message': 'No face detected in image'
            }), 400
        
        if len(face_locations) > 1:
            return jsonify({
                'success': False,
                'message': 'Multiple faces detected. Please use image with single face'
            }), 400
        
        # Get face encoding (128-d vector)
        face_encodings = face_recognition.face_encodings(image, face_locations)
        face_encoding = face_encodings[0]
        
        # Save photo
        photo_filename = f"user_{user_id}_{datetime.now().timestamp()}.jpg"
        photo_path = os.path.join(FACE_DATA_DIR, photo_filename)
        cv2.imwrite(photo_path, cv2.cvtColor(image, cv2.COLOR_RGB2BGR))
        
        # Save encoding
        save_face_encoding(user_id, face_encoding, photo_path)
        
        return jsonify({
            'success': True,
            'message': 'Face registered successfully',
            'user_id': user_id,
            'embedding': face_encoding.tolist(),
            'photo_url': photo_path
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500


@app.route('/api/face/recognize', methods=['POST'])
def recognize_face():
    """Nhận diện khuôn mặt"""
    try:
        data = request.json
        image_base64 = data.get('image')
        
        if not image_base64:
            return jsonify({
                'success': False,
                'message': 'Missing image'
            }), 400
        
        # Convert base64 to image
        image = base64_to_image(image_base64)
        
        # Detect faces
        face_locations = face_recognition.face_locations(image)
        
        print(f"🔍 Detected {len(face_locations)} face(s)")
        
        if len(face_locations) == 0:
            return jsonify({
                'success': False,
                'message': 'No face detected'
            })
        
        # Get face encoding
        face_encodings = face_recognition.face_encodings(image, face_locations)
        unknown_encoding = face_encodings[0]
        
        # Load all registered faces
        known_encodings, known_user_ids = load_all_face_encodings()
        
        if len(known_encodings) == 0:
            return jsonify({
                'success': False,
                'message': 'No registered faces in database'
            })
        
        print(f"📊 Comparing with {len(known_encodings)} registered face(s)")
        
        # Compare faces
        face_distances = face_recognition.face_distance(known_encodings, unknown_encoding)
        best_match_index = np.argmin(face_distances)
        best_distance = face_distances[best_match_index]
        
        # Calculate confidence (0-100%)
        confidence = (1 - best_distance) * 100
        
        print(f"🎯 Best match distance: {best_distance:.4f}")
        print(f"🎯 Confidence: {confidence:.2f}%")
        print(f"🎯 Threshold: {RECOGNITION_THRESHOLD}")
        
        if best_distance <= RECOGNITION_THRESHOLD:
            matched_user_id = known_user_ids[best_match_index]
            
            print(f"✅ Face recognized as user_id: {matched_user_id}")
            
            # Load matched photo
            file_path = os.path.join(FACE_DATA_DIR, f"user_{matched_user_id}.json")
            with open(file_path, 'r') as f:
                matched_data = json.load(f)
            
            return jsonify({
                'success': True,
                'message': 'Face recognized',
                'user_id': matched_user_id,
                'confidence': round(confidence, 2),
                'matched_photo': matched_data['photo_path'],
                'distance': float(best_distance)
            })
        else:
            print(f"❌ Face not recognized (confidence too low: {confidence:.2f}%)")
            return jsonify({
                'success': False,
                'message': f'Face not recognized (confidence: {round(confidence, 2)}%)',
                'confidence': round(confidence, 2),
                'best_distance': float(best_distance),
                'threshold': RECOGNITION_THRESHOLD
            })
        
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500


@app.route('/api/face/delete/<int:user_id>', methods=['DELETE'])
def delete_face(user_id):
    """Xóa face data của user"""
    try:
        file_path = os.path.join(FACE_DATA_DIR, f"user_{user_id}.json")
        
        if not os.path.exists(file_path):
            return jsonify({
                'success': False,
                'message': 'Face data not found'
            }), 404
        
        # Load và xóa photo
        with open(file_path, 'r') as f:
            data = json.load(f)
            if os.path.exists(data['photo_path']):
                os.remove(data['photo_path'])
        
        # Xóa json file
        os.remove(file_path)
        
        return jsonify({
            'success': True,
            'message': 'Face data deleted successfully'
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500


@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'service': 'Face Recognition API',
        'registered_users': len([f for f in os.listdir(FACE_DATA_DIR) if f.endswith('.json')])
    })


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)