import torch
import numpy as np
from PIL import Image
from torchvision import transforms
from app.core.model_loader import get_model
from app.core.explainability import generate_heatmap_base64

# ── Preprocessing ───────────────────────────────────────────
preprocess = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize([0.485, 0.456, 0.406],
                         [0.229, 0.224, 0.225]),
])

CLASSES = ["FAKE", "REAL"]

def predict_image(image_path: str) -> dict:
    """
    Run inference on an image and return prediction + heatmap.
    
    Returns:
        {
            "prediction" : "AI-Generated" or "Real",
            "confidence" : 0.97,
            "class_id"   : 0 or 1,
            "heatmap"    : "data:image/jpeg;base64,..."
        }
    """
    model, device = get_model()

    # ── Load & preprocess ───────────────────────────────────
    image        = Image.open(image_path).convert("RGB")
    input_tensor = preprocess(image).unsqueeze(0).to(device)

    # ── Inference ───────────────────────────────────────────
    with torch.no_grad():
        output      = model(input_tensor)
        probs       = torch.softmax(output, dim=1)[0]
        class_id    = torch.argmax(probs).item()
        confidence  = probs[class_id].item()

    # ── Map to labels ───────────────────────────────────────
    label      = "AI-Generated" if class_id == 0 else "Real"
    
    # ── Generate Grad-CAM heatmap ───────────────────────────
    heatmap_b64 = generate_heatmap_base64(model, image_path, class_id)

    return {
        "prediction" : label,
        "confidence" : round(confidence, 4),
        "class_id"   : class_id,
        "heatmap"    : heatmap_b64,
        "all_probs"  : {
            "FAKE": round(probs[0].item(), 4),
            "REAL": round(probs[1].item(), 4),
        }
    }