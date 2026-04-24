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
    <div
      className="camera-view"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '24px'
      }}
    >
      <h2 style={{ fontSize: '1.5rem', fontWeight: 700, textAlign: 'center' }}>
        Detecting Your Mood...
      </h2>
      
      {cameraPermission ? (
        <>
          <div className="camera-container">
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline
              muted
              className="camera-video"
            />
            <div className="countdown-overlay">
              {countdown}
            </div>
          </div>
          <p style={{ textAlign: 'center', color: '#4b5563' }}>
            Please look at the camera with your natural expression.
          </p>
        </>
      ) : (
        <div
          style={{
            textAlign: 'center',
            padding: '16px',
            background: '#fef2f2',
            borderRadius: '12px',
            maxWidth: '28rem'
          }}
        >
          <p style={{ color: '#dc2626', fontWeight: 700, marginBottom: '8px' }}>
            Camera access is needed for mood detection.
          </p>
          <p style={{ color: '#ef4444' }}>
            {errorMessage || "Please allow camera access in your browser settings."}
          </p>
          <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'center', gap: '12px' }}>
            <button
              onClick={() => {
                setCountdown(3);
                setErrorMessage("");
                setupCamera();
              }}
              style={{
                background: '#3b82f6',
                color: 'white',
                fontWeight: 700,
                padding: '10px 16px',
                borderRadius: '10px',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              Try again
            </button>
            {typeof onBack === 'function' && (
              <button
                onClick={onBack}
                style={{
                  background: '#e5e7eb',
                  color: '#1f2937',
                  fontWeight: 700,
                  padding: '10px 16px',
                  borderRadius: '10px',
                  border: 'none',
                  cursor: 'pointer'
                }}
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
