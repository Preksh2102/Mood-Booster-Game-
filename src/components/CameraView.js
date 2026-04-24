import React, { useCallback, useEffect, useRef, useState } from 'react';

const CameraView = ({ onCountdownComplete, onBack }) => {
  const [cameraPermission, setCameraPermission] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [errorMessage, setErrorMessage] = useState("");
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const timerRef = useRef(null);

  const stopCurrentStream = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  }, []);

  const setupCamera = useCallback(async () => {
    stopCurrentStream();
    setCameraPermission(false);

    try {
      // Basic capability + security checks (hosted sites commonly fail here)
      if (!window.isSecureContext) {
        setErrorMessage("Camera requires a secure context (HTTPS). Open the site over HTTPS (not HTTP) and try again.");
        return;
      }

      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setErrorMessage("Your browser doesn't support camera access (getUserMedia). Try Chrome/Edge on desktop or a modern mobile browser.");
        return;
      }

      console.log("Requesting camera access...");
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" }
      });
      streamRef.current = stream;
      console.log("Camera access granted");

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play().catch(e => {
            console.error("Video play error:", e);
            setErrorMessage("Could not play video stream: " + e.message);
          });
        };
      }

      setErrorMessage("");
      setCameraPermission(true);

      // Start countdown
      timerRef.current = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            timerRef.current = null;
            if (videoRef.current && videoRef.current.readyState >= 2) {
              onCountdownComplete(videoRef.current);
            } else {
              setErrorMessage("Camera is not ready yet. Please try again.");
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (err) {
      console.error("Error accessing camera:", err);
      setCameraPermission(false);

      if (err?.name === 'NotAllowedError') {
        setErrorMessage("Camera access was denied. Please allow camera access in your browser settings.");
      } else if (err?.name === 'NotFoundError') {
        setErrorMessage("No camera detected on your device.");
      } else if (err?.name === 'NotReadableError') {
        setErrorMessage("Camera is already in use by another application.");
      } else if (err?.name === 'OverconstrainedError') {
        setErrorMessage("Camera constraints cannot be satisfied.");
      } else {
        setErrorMessage(`Camera error: ${err?.message || String(err)}`);
      }
    }
  }, [onCountdownComplete, stopCurrentStream]);
  
  // Initialize camera on component mount
  useEffect(() => {
    setupCamera();
    return () => {
      stopCurrentStream();
    };
  }, [setupCamera, stopCurrentStream]);
  
  return (
    <div className="flex flex-col items-center justify-center space-y-6">
      <h2 className="text-2xl font-bold text-center">Detecting Your Mood...</h2>
      
      {cameraPermission ? (
        <>
          <div className="relative w-64 h-64 rounded-full overflow-hidden border-4 border-blue-500">
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline
              muted
              className="absolute inset-0 min-w-full min-h-full object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40">
              <span className="text-6xl font-bold text-white">{countdown}</span>
            </div>
          </div>
          <p className="text-center text-gray-600">
            Please look at the camera with your natural expression.
          </p>
        </>
      ) : (
        <div className="text-center p-4 bg-red-50 rounded-lg max-w-md">
          <p className="text-red-600 font-bold mb-2">Camera access is needed for mood detection.</p>
          <p className="text-red-500">{errorMessage || "Please allow camera access in your browser settings."}</p>
          <div className="mt-4 flex items-center justify-center gap-3">
            <button
              onClick={() => {
                setCountdown(3);
                setErrorMessage("");
                setupCamera();
              }}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-colors"
            >
              Try again
            </button>
            {typeof onBack === 'function' && (
              <button
                onClick={onBack}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-lg shadow-md transition-colors"
              >
                Back
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CameraView;
