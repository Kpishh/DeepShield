import cv2
import os
import tempfile
from app.core.predictor import predict_image

def extract_frames(video_path: str, max_frames: int = 10) -> list:
    """Extract evenly spaced frames from a video."""
    cap    = cv2.VideoCapture(video_path)
    total  = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    step   = max(1, total // max_frames)
    frames = []

    for i in range(0, min(total, max_frames * step), step):
        cap.set(cv2.CAP_PROP_POS_FRAMES, i)
        ret, frame = cap.read()
        if ret:
            frames.append(frame)
        if len(frames) >= max_frames:
            break

    cap.release()
    return frames


def predict_video_frames(video_path: str, max_frames: int = 10) -> dict:
    """
    Extract frames, predict each one, return majority vote.
    """
    frames = extract_frames(video_path, max_frames)

    if not frames:
        raise ValueError("Could not extract frames from video")

    predictions = []
    confidences = []

    with tempfile.TemporaryDirectory() as tmpdir:
        for i, frame in enumerate(frames):
            # Save frame as temp image
            frame_path = os.path.join(tmpdir, f"frame_{i}.jpg")
            cv2.imwrite(frame_path, frame)

            # Predict on frame
            result = predict_image(frame_path)
            predictions.append(result["class_id"])
            confidences.append(result["confidence"])

    # Majority vote
    fake_votes = predictions.count(0)
    real_votes = predictions.count(1)
    final_class = 0 if fake_votes >= real_votes else 1
    final_label = "AI-Generated" if final_class == 0 else "Real"
    avg_confidence = sum(confidences) / len(confidences)

    return {
        "prediction"      : final_label,
        "confidence"      : round(avg_confidence, 4),
        "frames_analyzed" : len(frames),
        "fake_votes"      : fake_votes,
        "real_votes"      : real_votes,
    }