from google import genai
from google.genai import types
from PIL import Image
import json
from calorie_counter import analyze_food_image

client = genai.Client()




if __name__ == "__main__":
    image_path = input("Upload image path (drag & drop or type path): ").strip()
    analyze_food_image(image_path)
