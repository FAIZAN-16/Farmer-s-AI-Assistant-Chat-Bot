import os
import csv
import chardet
from flask import Flask, render_template, request, jsonify
from difflib import SequenceMatcher

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')
app.static_url_path = '\static\img.png'

@app.route('/classify', methods=['POST'])
def classify():
    try:
        user_input = request.json['user_input']
        response = classify_input(user_input)
        return jsonify({'response': response})
    except Exception as e:
        return jsonify({'error': str(e)})

def classify_input(user_input):
    print("Classifying input...")  # Print statement for debugging
    try:
        # Print current directory to verify script location
        print("Current directory:", os.getcwd())

        # Detect the encoding of the CSV file
        with open('test.csv', 'rb') as f:
            data = f.read()
            encoding = chardet.detect(data)['encoding']

        # Open the CSV file with the detected encoding
        with open('test.csv', 'r', newline='', encoding=encoding) as file:
            reader = csv.DictReader(file)
            responses = {row['user-input']: row['chat-box'] for row in reader}

        print("Responses:", responses)

        # Find best match
        best_match = get_best_match(user_input, responses.keys())

        # Check similarity threshold
        if best_match[1] > 0.5:
            return responses[best_match[0]]
        else:
            return "ಕ್ಷಮಿಸಿ, ನನಗೆ ಅರ್ಥವಾಗಲಿಲ್ಲ."  # Sorry, I didn't understand that.
    except Exception as e:
        # Print any errors for debugging
        print("Error:", e)
        return "An error occurred. Please try again later."

def get_best_match(user_input, responses):
    best_match = (None, 0)
    for response in responses:
        similarity = SequenceMatcher(None, user_input, response).ratio()
        if similarity > best_match[1]:
            best_match = (response, similarity)
    return best_match

if __name__ == '__main__':
    app.run(debug=True)
