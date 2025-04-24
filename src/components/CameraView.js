import React, { useEffect, useRef, useState } from 'react';

const CameraView = ({ onCountdownComplete, onError }) => {
  const [cameraPermission, setCameraPermission] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [errorMessage, setErrorMessage] = useState("");
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  
  // Initialize camera on component mount
  useEffect(() => {
    const setupCamera = async () => {
      try {
        console.log("Requesting camera access...");
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: "user" } 
        });
        streamRef.current = stream;
        console.log("Camera access granted");
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          // Ensure the video plays
          videoRef.current.onloadedmetadata = () => {
            videoRef.current.play().catch(e => {
              console.error("Video play error:", e);
              setErrorMessage("Could not play video stream: " + e.message);
            });
          };
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
        
        // Provide more specific error messages
        if (err.name === 'NotAllowedError') {
          setErrorMessage("Camera access was denied. Please allow camera access in your browser settings.");
        } else if (err.name === 'NotFoundError') {
          setErrorMessage("No camera detected on your device.");
        } else if (err.name === 'NotReadableError') {
          setErrorMessage("Camera is already in use by another application.");
        } else if (err.name === 'OverconstrainedError') {
          setErrorMessage("Camera constraints cannot be satisfied.");
        } else {
          setErrorMessage(`Camera error: ${err.message}`);
        }
        
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
        </div>
      )}
    </div>
  );
};

export default CameraView;
