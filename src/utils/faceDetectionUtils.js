import * as faceapi from 'face-api.js';

/**
 * Load all required face-api.js models from the public directory
 * Models to download from: https://github.com/justadudewhohacks/face-api.js/tree/master/weights
 * Required files:
 * - tiny_face_detector_model-weights_manifest.json
 * - tiny_face_detector_model-shard1
 * - face_expression_model-weights_manifest.json
 * - face_expression_model-shard1
 */
export const loadModels = async () => {
  const MODEL_URL = '/models';
  
  try {
    await Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
      faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL)
    ]);
    console.log("Face detection models loaded successfully");
    return true;
  } catch (error) {
    console.error("Failed to load face detection models:", error);
    return false;
  }
};

/**
 * Check if lighting conditions are adequate for face detection
 * @param {HTMLVideoElement} videoElement - Video element to analyze
 * @returns {boolean} - Whether lighting is adequate
 */
export const checkLighting = (videoElement) => {
  if (!videoElement) return true;
  
  const canvas = document.createElement('canvas');
  canvas.width = videoElement.videoWidth;
  canvas.height = videoElement.videoHeight;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(videoElement, 0, 0);
  
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  
  // Calculate average brightness
  let sum = 0;
  for (let i = 0; i < data.length; i += 4) {
    // Convert RGB to brightness (0-255)
    sum += (data[i] * 0.299 + data[i+1] * 0.587 + data[i+2] * 0.114);
  }
  const brightness = sum / (data.length / 4);
  
  return brightness > 40; // Return true if brightness is adequate
};

/**
 * Detect facial expression from video element using face-api.js
 * @param {HTMLVideoElement} videoElement - Video element to analyze
 * @returns {Object} - Object containing mood data or error information
 */
export const detectFacialExpression = async (videoElement) => {
  if (!videoElement) return null;
  
  try {
    // First check if there's adequate lighting
    const isLightingGood = checkLighting(videoElement);
    if (!isLightingGood) {
      return { 
        error: 'lighting', 
        message: "It's too dark. Please find better lighting for accurate detection." 
      };
    }
    
    // Detect face with expressions
    const detections = await faceapi.detectAllFaces(
      videoElement, 
      new faceapi.TinyFaceDetectorOptions({ inputSize: 224, scoreThreshold: 0.5 })
    ).withFaceExpressions();
    
    // If no face was detected
    if (!detections || detections.length === 0) {
      return { 
        error: 'noface', 
        message: "No face detected. Please make sure your face is visible in the camera." 
      };
    }
    
    const expressions = detections[0].expressions;
    console.log("Expression data:", expressions);
    
    // Find the strongest expression
    let highestExpression = 'neutral';
    let highestScore = 0;
    
    Object.entries(expressions).forEach(([expression, score]) => {
      if (score > highestScore) {
        highestScore = score;
        highestExpression = expression;
      }
    });
    
    // If confidence is too low
    if (highestScore < 0.4) {
      return { 
        error: 'confidence', 
        message: "Couldn't clearly detect your expression. Please try with better lighting or a clearer expression." 
      };
    }
    
    console.log("Detected expression:", highestExpression, "with score:", highestScore);
    
    // Map the detailed expression to our simplified mood categories
    let detectedMood = 'neutral';
    if (['happy', 'surprised'].includes(highestExpression)) {
      detectedMood = 'happy';
    } else if (['sad', 'angry', 'fearful', 'disgusted'].includes(highestExpression)) {
      detectedMood = 'sad';
    }
    
    return {
      mood: detectedMood,
      rawExpression: highestExpression,
      confidence: highestScore,
      allExpressions: expressions
    };
  } catch (error) {
    console.error("Error during facial expression detection:", error);
    return { 
      error: 'technical', 
      message: "An error occurred during mood detection." 
    };
  }
};

/**
 * Enhanced facial expression detection with multiple samples for better accuracy
 * @param {HTMLVideoElement} videoElement - Video element to analyze
 * @param {number} samples - Number of samples to take
 * @returns {Object} - Object containing mood data or error information
 */
export const detectFacialExpressionAdvanced = async (videoElement, samples = 3) => {
  if (!videoElement) return null;
  
  try {
    // Take multiple samples for better accuracy
    let moodCounts = { happy: 0, sad: 0, neutral: 0 };
    let allExpressions = {};
    let errors = [];
    
    for (let i = 0; i < samples; i++) {
      // Wait a short time between samples
      if (i > 0) {
        await new Promise(resolve => setTimeout(resolve, 300));
      }
      
      const result = await detectFacialExpression(videoElement);
      
      if (result && result.mood) {
        moodCounts[result.mood] += 1;
        
        // Aggregate all expression data
        if (result.allExpressions) {
          Object.entries(result.allExpressions).forEach(([expr, score]) => {
            allExpressions[expr] = (allExpressions[expr] || 0) + score;
          });
        }
      } else if (result && result.error) {
        errors.push(result.error);
      }
    }
    
    // Find the most frequently detected mood
    let dominantMood = 'neutral';
    let highestCount = 0;
    
    Object.entries(moodCounts).forEach(([mood, count]) => {
      if (count > highestCount) {
        highestCount = count;
        dominantMood = mood;
      }
    });
    
    // Calculate average scores for expressions
    if (Object.keys(allExpressions).length > 0) {
      Object.keys(allExpressions).forEach(key => {
        allExpressions[key] /= samples;
      });
    }
    
    // Only return a valid result if we got at least one valid detection
    if (highestCount > 0) {
      return {
        mood: dominantMood,
        confidence: highestCount / samples,
        allExpressions: allExpressions
      };
    } else {
      // Return the most common error
      const errorCounts = {};
      errors.forEach(error => {
        errorCounts[error] = (errorCounts[error] || 0) + 1;
      });
      
      let mostCommonError = 'technical';
      let highestErrorCount = 0;
      
      Object.entries(errorCounts).forEach(([error, count]) => {
        if (count > highestErrorCount) {
          highestErrorCount = count;
          mostCommonError = error;
        }
      });
      
      let errorMessage = "Couldn't detect facial expressions clearly. Please try again.";
      if (mostCommonError === 'lighting') {
        errorMessage = "The lighting is too dark. Please move to a brighter area.";
      } else if (mostCommonError === 'noface') {
        errorMessage = "No face detected. Please make sure your face is visible in the camera.";
      }
      
      return { 
        error: mostCommonError, 
        message: errorMessage 
      };
    }
    
  } catch (error) {
    console.error("Error during advanced facial expression detection:", error);
    return { 
      error: 'technical', 
      message: "An error occurred during mood detection." 
    };
  }
};

/**
 * Draw face detection results on a canvas for visualization (optional feature)
 * @param {HTMLVideoElement} videoElement - Video element with the face
 * @param {HTMLCanvasElement} canvasElement - Canvas to draw on
 */
export const drawFaceDetectionResults = async (videoElement, canvasElement) => {
  if (!videoElement || !canvasElement) return;
  
  const displaySize = { 
    width: videoElement.width, 
    height: videoElement.height 
  };
  
  // Match canvas size to video
  faceapi.matchDimensions(canvasElement, displaySize);
  
  // Detect faces with expressions
  const detections = await faceapi.detectAllFaces(
    videoElement,
    new faceapi.TinyFaceDetectorOptions()
  ).withFaceExpressions();
  
  // Resize detections to match display size
  const resizedDetections = faceapi.resizeResults(detections, displaySize);
  
  // Clear canvas
  const ctx = canvasElement.getContext('2d');
  ctx.clearRect(0, 0, canvasElement.width, canvasElement.height);
  
  // Draw detections
  faceapi.draw.drawDetections(canvasElement, resizedDetections);
  faceapi.draw.drawFaceExpressions(canvasElement, resizedDetections);
};

/**
 * Get the color associated with a mood
 * @param {string} mood - The mood (happy, sad, neutral)
 * @returns {string} - CSS color string
 */
export const getMoodColor = (mood) => {
  switch (mood) {
    case 'happy': return '#fbbf24'; // yellow-400
    case 'sad': return '#60a5fa';   // blue-400
    case 'neutral': return '#9ca3af'; // gray-400
    default: return '#9ca3af';
  }
};

/**
 * Check if browser supports required features for face detection
 * @returns {Object} - Object containing support information
 */
export const checkBrowserSupport = () => {
  const support = {
    camera: 'mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices,
    webgl: false,
    warnings: []
  };
  
  // Check WebGL support
  try {
    const canvas = document.createElement('canvas');
    support.webgl = !!(window.WebGLRenderingContext && 
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
  } catch (e) {
    support.webgl = false;
  }
  
  // Add warnings for missing features
  if (!support.camera) {
    support.warnings.push("Your browser doesn't support camera access. Try using Chrome, Firefox, or Edge.");
  }
  
  if (!support.webgl) {
    support.warnings.push("Your browser doesn't support WebGL, which is required for face detection. Try updating your browser.");
  }
  
  return support;
};