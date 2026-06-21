#  DeepShield — AI-Generated Media Detection System



> A production-grade AI system that detects whether images are AI-generated or authentic, with visual explainability via Grad-CAM heatmaps.

<!-- [![Live Demo](https://img.shields.io/badge/Live%20Demo-Vercel-black)](https://your-app.vercel.app)
[![Backend](https://img.shields.io/badge/Backend-Render-blue)](https://your-backend.onrender.com/docs)
[![Accuracy](https://img.shields.io/badge/Accuracy-99.91%25-brightgreen)]()
[![License](https://img.shields.io/badge/License-MIT-yellow)]() -->

---

## Problem Statement

With the rapid rise of generative AI (GANs, diffusion models, deepfakes), distinguishing real from AI-generated media has become critical for digital trust, journalism, and identity verification.

---

##  Features

-  **AI Detection** — Classifies images as AI-Generated or Authentic
-  **Confidence Score** — Probability breakdown for each prediction
-  **Grad-CAM Explainability** — Visual heatmaps showing why the model made its decision
-  **History Dashboard** — All past predictions stored in database
-  **Video Support** — Frame-by-frame analysis with majority voting
-  **Fast Inference** — Model cached in memory for low latency

---

##  Architecture
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐

│   React Frontend │────▶│  FastAPI Backend  │────▶│ EfficientNet-B4 │

│   (Vercel)       │◀────│  (Render)         │◀────│ + Grad-CAM      │

└─────────────────┘     └──────────────────┘     └─────────────────┘

│

┌────────▼────────┐

│  SQLite Database │
└─────────────────┘

---

##  Model Performance

| Metric | Score |
|--------|-------|
| Test Accuracy | **99.91%** |
| Precision (Fake) | 1.00 |
| Recall (Fake) | 1.00 |
| F1-Score | 1.00 |
| Training Dataset | 140k Real vs Fake Faces |
| Architecture | EfficientNet-B4 |

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| ML Model | PyTorch + EfficientNet-B4 |
| Explainability | Grad-CAM |
| Backend | FastAPI + SQLAlchemy |
| Database | SQLite |
| Frontend | React + Vite + TailwindCSS |
| Deployment | Render + Vercel |
| CI/CD | GitHub Actions |

---

##  Local Setup

### Prerequisites
- Python 3.11+
- Node.js 18+
- Git

### 1. Clone the repo
```bash
git clone https://github.com/Kpishh/deepshield.git
cd deepshield
```

### 2. Backend setup
```bash
python -m venv venv
venv\Scripts\activate  # Windows
source venv/bin/activate  # Mac/Linux

cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

### 3. Frontend setup
```bash
cd frontend
npm install
npm run dev
```

### 4. Open in browser
http://localhost:5173

---

##  Project Structure
deepshield/

├── backend/          # FastAPI backend

│   ├── app/

│   │   ├── api/      # Route handlers

│   │   ├── core/     # ML inference + Grad-CAM

│   │   └── db/       # Database models

│   └── Dockerfile

├── frontend/         # React frontend

│   ├── src/

│   │   ├── components/

│   │   └── pages/

│   └── Dockerfile

├── ml/               # ML training

│   ├── models/

│   └── data/

└── .github/          # CI/CD workflows

---

##  Limitations

- Optimized for GAN-generated face detection (StyleGAN)
- Diffusion model images (Midjourney, DALL-E 3) remain challenging — an active research problem across the industry
- Video analysis uses frame sampling (not full temporal analysis)

---

---

## 📄 License

MIT License — feel free to use this project!