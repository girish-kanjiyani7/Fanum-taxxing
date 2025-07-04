from flask import Flask, render_template, request, jsonify
from werkzeug.utils import secure_filename
import os
from calorie_counter import analyze_food_image

app = Flask(__name__)

# Upload folder setup
UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

@app.route("/")
def index():
    return render_template("index.html")  # Render an HTML page where users upload files

@app.route("/upload", methods=["POST"])
def upload():
    # Check if the 'image' part is in the request files
    if "image" not in request.files:
        return jsonify({"error": "No image part"}), 400

    file = request.files["image"]
    if file.filename == "":
        return jsonify({"error": "No selected file"}), 400

    # Secure the filename
    filename = secure_filename(file.filename)
    filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    file.save(filepath)  # Save the uploaded file to the 'uploads' directory

    # Analyze the image with the Gemini AI
    try:
        result = analyze_food_image(filepath)  # Call your function for analysis
        return jsonify(result)  # Return the analysis as JSON
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    import os
    port = int(os.environ.get("PORT", 5001))  # Railway assigns a dynamic port
    app.run(host="0.0.0.0", port=port)
