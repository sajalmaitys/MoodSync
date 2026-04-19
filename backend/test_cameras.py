import cv2
import sys
import time

def test_cameras():
    print("Testing cameras...")
    is_windows = sys.platform.startswith("win")
    
    # Backends to try
    backends = [
        ("Default (None)", None),
        ("CAP_DSHOW", cv2.CAP_DSHOW),
        ("CAP_MSMF", cv2.CAP_MSMF),
    ]

    for idx in range(3):
        print(f"\n--- Testing Camera Index {idx} ---")
        for name, backend in backends:
            print(f"Trying backend {name} ...", end=" ")
            try:
                cap = cv2.VideoCapture(idx, backend) if backend is not None else cv2.VideoCapture(idx)
                if not cap.isOpened():
                    print("Failed to open.")
                    cap.release()
                    continue
                
                # Try grabbing a frame
                ret, frame = cap.read()
                if ret and frame is not None:
                    h, w, _ = frame.shape
                    print(f"SUCCESS! Read frame {w}x{h}.")
                else:
                    print("Opened, but failed to read frame.")
                cap.release()
            except Exception as e:
                print(f"Exception: {e}")

if __name__ == "__main__":
    test_cameras()
