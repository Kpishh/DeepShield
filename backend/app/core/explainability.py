import torch
import numpy as np
import cv2
import os
from PIL import Image
from torchvision import transforms

# We use grad-cam library
from pytorch_grad_cam import GradCAM
from pytorch_grad_cam.utils.image import show_cam_on_image
from pytorch_grad_cam.utils.model_targets import ClassifierOutputTarget

# ── Constants ───────────────────────────────────────────────
IMG_SIZE    = 224
HEATMAP_DIR = os.path.join(os.path.dirname(__file__), "..", "..", "static", "heatmaps")
os.makedirs(HEATMAP_DIR, exist_ok=True)

# ── Preprocessing ───────────────────────────────────────────
preprocess = transforms.Compose([
    transforms.Resize((IMG_SIZE, IMG_SIZE)),
    transforms.ToTensor(),
    transforms.Normalize([0.485, 0.456, 0.406],
                         [0.229, 0.224, 0.225]),
])

def denormalize(tensor):
    """Convert normalized tensor back to 0-1 range for visualization."""
    mean = torch.tensor([0.485, 0.456, 0.406]).view(3, 1, 1)
    std  = torch.tensor([0.229, 0.224, 0.225]).view(3, 1, 1)
    return torch.clamp(tensor * std + mean, 0, 1)


def generate_heatmap(model, image_path: str, predicted_class: int, filename: str) -> str:
    """
    Generate Grad-CAM heatmap for a given image.
    
    Args:
        model          : trained DeepShield model
        image_path     : path to the uploaded image
        predicted_class: 0=FAKE, 1=REAL
        filename       : output filename for heatmap
    
    Returns:
        Path to saved heatmap image
    """
    model.eval()

    # ── Load & preprocess image ─────────────────────────────
    pil_image = Image.open(image_path).convert("RGB")
    pil_image = pil_image.resize((IMG_SIZE, IMG_SIZE))
    
    input_tensor = preprocess(pil_image).unsqueeze(0)  # [1, 3, 224, 224]

    # ── Original image as numpy for overlay ─────────────────
    rgb_image = np.array(pil_image, dtype=np.float32) / 255.0

    # ── Select target layer (last conv block of EfficientNet-B4) ──
    # This is the layer Grad-CAM hooks into
    target_layer = [model.backbone.conv_head]

    # ── Run Grad-CAM ────────────────────────────────────────
    with GradCAM(model=model, target_layers=target_layer) as cam:
        targets     = [ClassifierOutputTarget(predicted_class)]
        grayscale   = cam(input_tensor=input_tensor, targets=targets)
        grayscale   = grayscale[0]  # shape: [224, 224]

    # ── Overlay heatmap on original image ───────────────────
    visualization = show_cam_on_image(
        rgb_image,
        grayscale,
        use_rgb=True,
        colormap=cv2.COLORMAP_JET,
        image_weight=0.5
    )

    # ── Save heatmap ────────────────────────────────────────
    save_path = os.path.join(HEATMAP_DIR, f"heatmap_{filename}.jpg")
    cv2.imwrite(save_path, cv2.cvtColor(visualization, cv2.COLOR_RGB2BGR))

    print(f"✅ Heatmap saved: {save_path}")
    return save_path


def generate_heatmap_base64(model, image_path: str, predicted_class: int) -> str:
    """
    Generate Grad-CAM heatmap and return as base64 string.
    Used for direct API response without file storage.
    """
    import base64
    import io

    model.eval()

    pil_image    = Image.open(image_path).convert("RGB")
    pil_image    = pil_image.resize((IMG_SIZE, IMG_SIZE))
    input_tensor = preprocess(pil_image).unsqueeze(0)
    rgb_image    = np.array(pil_image, dtype=np.float32) / 255.0

    target_layer = [model.backbone.conv_head]

    with GradCAM(model=model, target_layers=target_layer) as cam:
        targets   = [ClassifierOutputTarget(predicted_class)]
        grayscale = cam(input_tensor=input_tensor, targets=targets)[0]

    visualization = show_cam_on_image(
        rgb_image,
        grayscale,
        use_rgb=True,
        colormap=cv2.COLORMAP_JET,
        image_weight=0.5
    )

    # Convert to base64
    pil_result = Image.fromarray(visualization)
    buffer     = io.BytesIO()
    pil_result.save(buffer, format="JPEG", quality=90)
    buffer.seek(0)
    b64 = base64.b64encode(buffer.read()).decode("utf-8")

    return f"data:image/jpeg;base64,{b64}"