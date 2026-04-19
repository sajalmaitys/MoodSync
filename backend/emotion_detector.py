"""
emotion_detector.py
──────────────────
Background thread that continuously captures webcam frames,
runs FER emotion analysis, stores the latest result for
the Flask API to serve, and stores annotated JPEG frames
for MJPEG live streaming.
"""

import sys
import threading
import time
import cv2

try:
    from fer import FER          # older fer versions (< 22.x)
except ImportError:
    from fer.fer import FER      # fer >= 22.x / 25.x

from datetime import datetime

# ── State shared between thread and API ──────────────────────────────────────
_lock = threading.Lock()
_state = {
    "emotion": "neutral",
    "confidence": 0.0,
    "all_emotions": {},
    "timestamp": None,
    "running": False,
    "error": None,
    "_frame": None,   # latest JPEG bytes for MJPEG stream
}

# ── Internal ──────────────────────────────────────────────────────────────────
_detector = None
_thread = None


def _sleep_interruptible(seconds: float) -> bool:
    """
    Sleep in small steps; return False if _state['running'] became False (stop requested).
    """
    end = time.time() + seconds
    while True:
        with _lock:
            if not _state["running"]:
                return False
        rem = end - time.time()
        if rem <= 0:
            return True
        time.sleep(min(0.15, rem))


def _open_camera(camera_index: int):
    """
    Try to open the camera robustly.
    On Windows, DirectShow (CAP_DSHOW) is the most reliable backend.
    MSMF is explicitly avoided because it can 'open' the camera but fail
    to grab frames with error -1072875772 (a known Windows issue).
    Falls back to scanning other indices if the specified one fails.
    """
    is_windows = sys.platform.startswith("win")

    def _try(idx, backend=None):
        """Open and verify with a test frame read."""
        try:
            cap = cv2.VideoCapture(idx, backend) if backend is not None else cv2.VideoCapture(idx)
            if not cap.isOpened():
                cap.release()
                return None
            # Read a test frame to confirm the stream works
            ret, frame = cap.read()
            if ret and frame is not None:
                return cap
            cap.release()
        except Exception as e:
            print(f"[CAM] Exception opening index {idx} backend {backend}: {e}")
        return None

    # Windows: try default first (often works for index 0), then DirectShow, then MSMF
    # as last resort — some laptops only work with one of these per device index.
    if is_windows:
        backends_to_try = [None, cv2.CAP_DSHOW, cv2.CAP_MSMF]
    else:
        backends_to_try = [None]

    # 1. Try requested index first
    for backend in backends_to_try:
        print(f"[CAM] Trying camera {camera_index} backend={backend} ...")
        cap = _try(camera_index, backend)
        if cap:
            print(f"[CAM] Opened camera {camera_index} (backend={backend})")
            return cap

    # 2. Scan other indices 0-4
    for idx in range(5):
        if idx == camera_index:
            continue
        for backend in backends_to_try:
            print(f"[CAM] Trying camera {idx} backend={backend} ...")
            cap = _try(idx, backend)
            if cap:
                print(f"[CAM] Found working camera at index {idx} (backend={backend})")
                return cap

    return None  # All attempts failed


def _make_detector():
    """
    Create FER detector. Try with MTCNN first (better accuracy),
    fall back to Haar cascade if MTCNN import/init fails.
    """
    try:
        det = FER(mtcnn=True)
        print("[FER] Loaded with MTCNN")
        return det
    except Exception as e:
        print(f"[FER] MTCNN failed ({e}), falling back to Haar cascade")
        return FER(mtcnn=False)


def _detect_loop(camera_index: int, fps_target: float = 5.0):
    """
    Runs in a daemon thread. Keeps trying while _state['running'] is True
    (set by start(), cleared only by stop()). Never sets running=False on
    camera failure — that used to kill the thread and strand the UI on a
    permanent 'Camera stream lost' until manual Flask restart.
    """
    global _detector

    print(f"[*] Initialising FER detector ...")
    _detector = _make_detector()

    cap = None
    fail_before_reopen = 30
    max_reopen_rounds = 12
    interval = 1.0 / fps_target

    try:
        while True:
            with _lock:
                if not _state["running"]:
                    print("[*] Detector stop requested, exiting thread")
                    _state["error"] = None
                    return

            if cap is None:
                print(f"[*] Opening camera (index={camera_index}) ...")
                with _lock:
                    _state["error"] = "Connecting to webcam…"
                cap = _open_camera(camera_index)
                if cap is None:
                    print("[ERR] No camera — will retry in 4s")
                    with _lock:
                        _state["error"] = (
                            "No camera available. Close other apps using the webcam. Retrying…"
                        )
                    if not _sleep_interruptible(4.0):
                        return
                    continue

                cap.set(cv2.CAP_PROP_FRAME_WIDTH, 640)
                cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 480)
                cap.set(cv2.CAP_PROP_FPS, 30)
                with _lock:
                    _state["error"] = None
                print("[*] Camera open, capture loop running")

            consecutive_failures = 0
            reopen_round = 0

            while True:
                with _lock:
                    if not _state["running"]:
                        _state["error"] = None
                        return

                t0 = time.time()
                ret, frame = cap.read()

                if not ret or frame is None:
                    consecutive_failures += 1
                    print(f"[WARN] Frame read failed (attempt {consecutive_failures})")
                    if consecutive_failures >= fail_before_reopen:
                        if reopen_round >= max_reopen_rounds:
                            print("[CAM] Re-open rounds exhausted — full reconnect")
                            try:
                                cap.release()
                            except Exception:
                                pass
                            cap = None
                            with _lock:
                                _state["error"] = "Webcam hiccup — reconnecting…"
                            if not _sleep_interruptible(2.0):
                                return
                            break  # outer: open camera again
                        reopen_round += 1
                        print(f"[CAM] Re-opening camera (round {reopen_round}/{max_reopen_rounds}) ...")
                        try:
                            cap.release()
                        except Exception:
                            pass
                        time.sleep(0.5)
                        cap = _open_camera(camera_index)
                        consecutive_failures = 0
                        if cap is None:
                            with _lock:
                                _state["error"] = "Webcam dropped — reconnecting…"
                            if not _sleep_interruptible(2.0):
                                return
                            break
                        cap.set(cv2.CAP_PROP_FRAME_WIDTH, 640)
                        cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 480)
                        cap.set(cv2.CAP_PROP_FPS, 30)
                        with _lock:
                            _state["error"] = None
                        print("[CAM] Camera re-opened, resuming capture")
                    else:
                        time.sleep(0.2)
                    continue

                consecutive_failures = 0
                reopen_round = 0

                # Run FER analysis
                try:
                    results = _detector.detect_emotions(frame)
                except Exception as e:
                    print(f"[WARN] FER error: {e}")
                    results = []

                if results:
                    result = max(results, key=lambda r: r["box"][2] * r["box"][3])
                    emotions = result["emotions"]
                    dominant = max(emotions, key=emotions.get)
                    confidence = emotions[dominant]

                    with _lock:
                        _state["emotion"] = dominant
                        _state["confidence"] = round(confidence, 4)
                        _state["all_emotions"] = {k: round(v, 4) for k, v in emotions.items()}
                        _state["timestamp"] = datetime.utcnow().isoformat() + "Z"
                        _state["error"] = None

                    x, y, w, h = result["box"]
                    annotated = frame.copy()
                    cv2.rectangle(annotated, (x, y), (x + w, y + h), (255, 255, 255), 2)
                    label = f"{dominant.upper()}  {round(confidence * 100)}%"
                    (tw, th), _ = cv2.getTextSize(label, cv2.FONT_HERSHEY_SIMPLEX, 0.7, 2)
                    cv2.rectangle(annotated, (x, y - th - 12), (x + tw + 8, y), (255, 255, 255), -1)
                    cv2.putText(annotated, label, (x + 4, y - 6),
                                cv2.FONT_HERSHEY_SIMPLEX, 0.7, (30, 30, 30), 2)
                else:
                    annotated = frame.copy()
                    cv2.putText(annotated, "No face detected", (10, 30),
                                cv2.FONT_HERSHEY_SIMPLEX, 0.8, (100, 100, 255), 2)
                    with _lock:
                        _state["error"] = "no_face"

                ok, jpeg = cv2.imencode(".jpg", annotated, [cv2.IMWRITE_JPEG_QUALITY, 75])
                if ok:
                    with _lock:
                        _state["_frame"] = jpeg.tobytes()

                elapsed = time.time() - t0
                sleep_time = max(0.0, interval - elapsed)
                time.sleep(sleep_time)
    finally:
        try:
            if cap is not None:
                cap.release()
        except Exception:
            pass
        print("[*] Camera released.")


# ── Public API ────────────────────────────────────────────────────────────────

def start(camera_index: int = 0):
    """Start the emotion detection background thread."""
    global _thread
    if _thread and _thread.is_alive():
        return  # Already running
    if _thread is not None:
        _thread.join(timeout=1.0)
    with _lock:
        _state["running"] = True
    _thread = threading.Thread(
        target=_detect_loop,
        args=(camera_index,),
        daemon=True,
        name="EmotionDetector",
    )
    _thread.start()


def stop():
    """Signal the detection thread to stop."""
    with _lock:
        _state["running"] = False


def get_state() -> dict:
    """Return a copy of the current detection state (thread-safe), without the raw frame bytes."""
    with _lock:
        s = dict(_state)
        s.pop("_frame", None)
        return s


def get_frame() -> bytes | None:
    """Return the latest JPEG frame bytes for MJPEG streaming."""
    with _lock:
        return _state.get("_frame")
