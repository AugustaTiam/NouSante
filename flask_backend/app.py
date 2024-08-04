from flask import Flask, jsonify
from flask_cors import CORS
import json

app = Flask(__name__)
CORS(app)

@app.route('/patients')
def get_patient_records():
    with open('patient_records.json') as f:
        patient_records = json.load(f)
    print(patient_records)
    return jsonify(patient_records)

@app.route('/health_tips')
def get_health_tips():
    with open('health_tips.json') as f:
        health_tips = json.load(f)
    print(health_tips)
    return jsonify(health_tips)

if __name__ == '__main__':
    app.run(debug=True)
