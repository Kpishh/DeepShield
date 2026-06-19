import torch
import timm
import torch.nn as nn
import os

# ── Model Architecture (must match training) ────────────────
class DeepShieldModel(nn.Module):
    def __init__(self, num_classes=2):
        super().__init__()
        self.backbone = timm.create_model(
            "efficientnet_b4",
            pretrained=False,      # no download needed, we load weights
            num_classes=0,
            global_pool="avg"
        )
        feature_dim = self.backbone.num_features
        self.classifier = nn.Sequential(
            nn.Dropout(0.4),
            nn.Linear(feature_dim, 256),
            nn.ReLU(),
            nn.Dropout(0.2),
            nn.Linear(256, num_classes)
        )

    def forward(self, x):
        return self.classifier(self.backbone(x))


# ── Singleton model instance ────────────────────────────────
_model  = None
_device = None

def load_model(model_path: str = None):
    """Load model once and cache it in memory."""
    global _model, _device

    if _model is not None:
        return _model, _device     # return cached model

    _device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

    if model_path is None:
        model_path = os.path.join(
            os.path.dirname(__file__),
            "..", "..", "..", "ml", "models", "saved", "efficientnet_b4_faces_best.pth"
        )

    if not os.path.exists(model_path):
        raise FileNotFoundError(f"Model not found at: {model_path}")

    # Load checkpoint
    checkpoint = torch.load(model_path, map_location=_device)
    
    _model = DeepShieldModel(num_classes=2)
    _model.load_state_dict(checkpoint["model_state_dict"])
    _model.to(_device)
    _model.eval()

    print(f"✅ Model loaded from  : {model_path}")
    print(f"✅ Running on device  : {_device}")
    print(f"✅ Best val accuracy  : {checkpoint.get('val_acc', 'N/A')}")
    print(f"✅ Classes            : {checkpoint.get('classes', ['FAKE', 'REAL'])}")

    return _model, _device


def get_model():
    """Get cached model (call load_model first)."""
    if _model is None:
        return load_model()
    return _model, _device