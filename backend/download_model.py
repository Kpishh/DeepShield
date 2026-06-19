import os
import gdown

MODEL_DIR  = "ml/models/saved"
MODEL_PATH = f"{MODEL_DIR}/efficientnet_b4_faces_best.pth"
FILE_ID    = "1NO6_a7z5Mglky1Xin8JuoIuflZETr-5s" 

os.makedirs(MODEL_DIR, exist_ok=True)

if not os.path.exists(MODEL_PATH):
    print("📥 Downloading model from Google Drive...")
    url = f"https://drive.google.com/uc?id={FILE_ID}"
    gdown.download(url, MODEL_PATH, quiet=False)
    print("✅ Model downloaded!")
else:
    print("✅ Model already exists!")