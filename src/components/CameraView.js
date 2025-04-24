import React, { useEffect, useRef, useState } from 'react';

const CameraView = ({ onCountdownComplete, onError }) => {
  const [cameraPermission, setCameraPermission] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  
  // Initialize camera on component mount
  useEffect(() => {
    const setupCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: "user" } 
        });
        streamRef.current = stream;
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        
        setCameraPermission(true);
        
        // Start countdown
        const timer = setInterval(() => {
          setCountdown(prev => {
            if (prev <= 1) {
              clearInterval(timer);
              // When countdown completes, pass video element to parent
              if (videoRef.current) {
                onCountdownComplete(videoRef.current);
              }
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
        
        return () => clearInterval(timer);
        
      } catch (err) {
        console.error("Error accessing camera:", err);
        setCameraPermission(false);
        onError("Camera access is needed. Please allow camera access and try again.");
      }
    };
    
    setupCamera();
    
    // Clean up - stop camera when component unmounts
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, [onCountdownComplete, onError]);
  
 // In CameraView.js
return (
  <div className="flex flex-col items-center justify-center space-y-6">
    <h2 className="text-2xl font-bold text-center">Detecting Your Mood...</h2>
    
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
            <span>{countdown}</span>
          </div>
        </div>
        <p className="text-center text-gray-600">
          Please look at the camera with your natural expression.
        </p>
      </>
    ) : (
      <div className="text-center text-red-500">
        Camera access is needed for mood detection. 
        Please allow camera access and try again.
      </div>
    )}
  </div>
);
};

export default CameraView;