from google import genai
from google.genai import types
from PIL import Image
import json

client = genai.Client()



def analyze_food_image(image_path: str):
    # Load and resize image
    im = Image.open(image_path)
    im.thumbnail([1024, 1024], Image.Resampling.LANCZOS)

    # Prompt
    prompt = """
    Identify all food items in this image.
    For each item, return a JSON object with:
    - "label": the name of the food (e.g., 'burger', 'orange juice')
    - "calories": estimated calories (numeric, per portion)

    After listing all items, also return:
    - "total_calories": the sum of all estimated item calories
    - "reasoning": a short explanation of how the total was estimated

    Respond with a single JSON object with 'items', 'total_calories', and 'reasoning' keys.
    """

    config = types.GenerateContentConfig(
        thinking_config=types.ThinkingConfig(thinking_budget=0)
    )

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=[prompt, im],
        config=config
    )

    # Inline JSON cleaning: strip markdown if wrapped
    text = response.text
    if "```json" in text:
        text = "\n".join(text.split("```json")[1].split("```")[0].splitlines()[1:])

    # Parse JSON and print
    results = json.loads(text)
    print(json.dumps(results, indent=2))
    return results