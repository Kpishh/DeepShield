import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'backend'))

from app.core.model_loader import load_model
from app.core.explainability import generate_heatmap_base64
from PIL import Image
import requests
from io import BytesIO

# Load model
model, device = load_model()

# Download a test image
image_path = r"C:\Users\sahne\Documents\Study\deepshield\ml\data\raw\test\FAKE"

# Pick the first image from test/FAKE folder
first_image = os.listdir(image_path)[0]
full_path   = os.path.join(image_path, first_image)

print(f"Testing with image: {first_image}")
# url   = "https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/PNG_transparency_demonstration_1.png/280px-PNG_transparency_demonstration_1.png"
# resp  = requests.get(url)
# image = Image.open(BytesIO(resp.content)).convert("RGB")
# image.save("test_image.jpg")

# Generate heatmap
print("Generating heatmap...")
b64 = generate_heatmap_base64(model, full_path, predicted_class=0)
print(f"✅ Heatmap generated! Length: {len(b64)} chars")
print("✅ Grad-CAM working correctly!")