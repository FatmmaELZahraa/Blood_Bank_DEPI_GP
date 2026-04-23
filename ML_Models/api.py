from flask import Flask, request, jsonify
import joblib
import numpy as np

api = Flask(__name__)

model = joblib.load("blood_shortage_model.pkl")

@api.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.json["data"]   

        input_data = np.array(data).reshape(1, -1)

        prediction = model.predict(input_data)

        return jsonify({
            "prediction": int(prediction[0])
        })

    except Exception as e:
        return jsonify({"error": str(e)})

if __name__ == "__main__":
    api.run(debug=True)