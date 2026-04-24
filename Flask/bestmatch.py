from flask import Flask, request, jsonify
import joblib
from flask_cors import CORS
app = Flask(__name__)
CORS(app)
model = joblib.load('smart_blood_model.pkl')

@app.route('/bestmatch')
def home():
    return "API is working 🚀"

@app.route('/predict-donor', methods=['POST'])
def predict_donor():
    data = request.json

    input_data = [[
        data['Is_Compatible'],
        data['Age'],
        data['Distance_KM'],
        data['Last_Donation_Days'],
        data['Historical_Response_Rate'],
        data['Blood_Quality_Score']
    ]]

    prediction = model.predict(input_data)[0]
    probability = model.predict_proba(input_data)[0][1]

    return jsonify({
        "prediction": int(prediction),
        "probability": float(probability)
    })

if __name__ == '__main__':
    app.run(debug=True)