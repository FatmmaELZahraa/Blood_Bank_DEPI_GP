from flask import Flask, request, jsonify
from ultralytics import YOLO
import os
import uuid
app = Flask(__name__)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
model_path = os.path.join(BASE_DIR, 'models', 'best.pt')
model = YOLO(model_path)

upload_folder = os.path.join(BASE_DIR, 'uploads')
os.makedirs(upload_folder, exist_ok=True)

def check_health_status(counts):
    """
    ملاحظة: هذه النسب تقريبية لأغراض المشروع البرمجي فقط.
    في الواقع، تعتمد النسب على حجم العينة المجهرية.
    """
    status = "Normal"
    reasons = []

   
    if counts['RBC'] < 20: 
        status = "Abnormal"
        reasons.append("Low RBC count (Possible Anemia)")
    
    if counts['WBC'] > 10: 
        status = "Abnormal"
        reasons.append("High WBC count (Possible Infection)")

    if counts['Platelets'] < 5:
        status = "Abnormal"
        reasons.append("Low Platelets count")

    return status, reasons
@app.route('/')
def home():
    return "Blood Analysis API is running 🚀"

@app.route('/analyze-blood', methods=['POST'])
def analyze_blood():
    if 'image' not in request.files:
        return jsonify({'error': 'No image provided'}), 400
    
    file = request.files['image']
    filename = str(uuid.uuid4()) + ".jpg"
    img_path = os.path.join(upload_folder, filename)
    file.save(img_path)

    # تشغيل YOLOv8 للتوقع
    results = model(img_path)
    
    counts = {"RBC": 0, "WBC": 0, "Platelets": 0}
    class_names = {0: 'RBC', 1: 'WBC', 2: 'Platelets'}

    for r in results:
        for c in r.boxes.cls:
            label = class_names[int(c)]
            counts[label] += 1

    health_status, observations = check_health_status(counts)

    if os.path.exists(img_path):
        os.remove(img_path)

    return jsonify({
        'status': 'success',
        'analysis': counts,
        'overall_health': health_status,
        'observations': observations,
        'message': 'Medical report generated successfully'
    })

if __name__ == '__main__':
   app.run(host='0.0.0.0', port=5000, debug=True)