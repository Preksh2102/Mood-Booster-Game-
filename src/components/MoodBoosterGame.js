import React, { useState, useEffect } from 'react';
import activities from '../data/activities';
import { loadModels, detectFacialExpressionAdvanced } from '../utils/faceDetectionUtils';
import StartScreen from './StartScreen';
import CameraView from './CameraView';
import ActivitySuggestion from './ActivitySuggestion';

const STORAGE_KEY = 'mood-booster-data';

const MoodBoosterGame = () => {
  const [gamePhase, setGamePhase] = useState('loading'); // loading, start, detecting, suggestion
  const [mood, setMood] = useState('neutral');
  const [activity, setActivity] = useState(null);
  const [error, setError] = useState(null);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [moodHistory, setMoodHistory] = useState([]);
  const [completedActivities, setCompletedActivities] = useState([]);

  // Load face detection models when component mounts
  useEffect(() => {
    const initializeFaceDetection = async () => {
      const loaded = await loadModels();
      setModelsLoaded(loaded);
      setGamePhase(loaded ? 'start' : 'error');
      if (!loaded) {
        setError("Failed to load facial detection models. Please refresh the page or try a different browser.");
      }
    };
    
    initializeFaceDetection();
    
    // Load saved data from localStorage
    const loadSavedData = () => {
      try {
        const savedData = localStorage.getItem(STORAGE_KEY);
        if (savedData) {
          const parsedData = JSON.parse(savedData);
          if (parsedData.moodHistory) {
            setMoodHistory(parsedData.moodHistory);
          }
          if (parsedData.completedActivities) {
            setCompletedActivities(parsedData.completedActivities);
          }
        }
      } catch (err) {
        console.error("Error loading saved data:", err);
      }
    };
    
    loadSavedData();
  }, []);
  
  // Save data to localStorage whenever it changes
  useEffect(() => {
    if (moodHistory.length > 0 || completedActivities.length > 0) {
      try {
        const dataToSave = {
          moodHistory,
          completedActivities
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
      } catch (err) {
        console.error("Error saving data:", err);
      }
    }
  }, [moodHistory, completedActivities]);
  
  // Start the detection process
  const startDetection = () => {
    setGamePhase('detecting');
    setError(null);
  };
  
  // Handle video element from CameraView when countdown completes
  const handleVideoReady = async (videoElement) => {
    // Wait a moment to ensure the video is fully initialized
    setTimeout(async () => {
      try {
        // Use the advanced detection with multiple samples
        const result = await detectFacialExpressionAdvanced(videoElement, 5);
        
        if (result && result.error) {
          // Handle detection errors
          setError(result.message);
          setGamePhase('start');
        } else if (result && result.mood) {
          // Process successful detection
          const newMood = result.mood;
          setMood(newMood);
          
          // Add timestamp and mood to history
          const newMoodEntry = { 
            mood: newMood, 
            timestamp: new Date().toISOString(),
            confidence: result.confidence || 0.5,
            rawExpression: result.rawExpression || newMood
          };
          
          // Safely update mood history with null check
          setMoodHistory(prev => {
            // Ensure prev is an array
            const prevArray = Array.isArray(prev) ? prev : [];
            return [...prevArray, newMoodEntry];
          });
          
          // Select a random activity based on detected mood - with safety checks
          const moodActivities = activities[newMood] || [];
          
          // Safety check for mood history
          const safeHistory = Array.isArray(moodHistory) ? moodHistory : [];
          
          // Get recent activity IDs with proper null checks
          const recentActivityIds = safeHistory.length > 0 ? 
            safeHistory
              .slice(-3)
              .filter(item => item && item.mood === newMood)
              .map(item => item && item.activityId)
              .filter(id => id !== undefined && id !== null)
            : [];
          
          // Safety checks for all arrays
          const availableActivities = Array.isArray(moodActivities) ? 
            moodActivities.filter(activity => 
              activity && !recentActivityIds.includes(activity.id)
            ) : [];
          
          const activityPool = availableActivities.length > 0 ? availableActivities : moodActivities;
          
          // Final safety check before random selection
          if (Array.isArray(activityPool) && activityPool.length > 0) {
            const randomActivity = activityPool[Math.floor(Math.random() * activityPool.length)];
            
            // Only update if we have a valid activity
            if (randomActivity) {
              // Update the mood entry with the activity ID
              newMoodEntry.activityId = randomActivity.id;
              setActivity(randomActivity);
            }
          }
          
          setGamePhase('suggestion');
        } else {
          // Fallback for unexpected issues
          setError("Something went wrong with mood detection. Please try again.");
          setGamePhase('start');
        }
      } catch (err) {
        console.error("Error in handleVideoReady:", err);
        setError("An unexpected error occurred. Please try again.");
        setGamePhase('start');
      }
    }, 500);
  };
  // Handle any errors during detection process
  const handleError = (errorMessage) => {
    setError(errorMessage);
    setGamePhase('start');
  };
  
  // Handle activity completion
  const handleActivityComplete = (completedActivity) => {
    setCompletedActivities(prev => [
      ...prev,
      {
        id: completedActivity.id,
        name: completedActivity.name,
        mood,
        timestamp: new Date().toISOString()
      }
    ]);
  };
  
  // Reset the game to try again
  const resetGame = () => {
    setGamePhase('start');
    setError(null);
  };
  
  // Render appropriate content based on game phase
  const renderGameContent = () => {
    switch (gamePhase) {
      case 'loading':
        return (
          <div className="flex flex-col items-center justify-center space-y-6">
            <h2 className="text-xl font-bold text-center">Loading Mood Detection...</h2>
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-600 text-center">Please wait while we initialize the facial recognition AI...</p>
          </div>
        );
        
      case 'error':
        return (
          <div className="flex flex-col items-center justify-center space-y-6">
            <h2 className="text-xl font-bold text-center text-red-500">Error</h2>
            <p className="text-center">{error || "An unexpected error occurred."}</p>
            <button 
              onClick={() => window.location.reload()}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-lg shadow-md transition-colors"
            >
              Reload Page
            </button>
          </div>
        );
        
      case 'start':
        return <StartScreen onStart={startDetection} />;
        
      case 'detecting':
        return <CameraView onCountdownComplete={handleVideoReady} onError={handleError} />;
        
      case 'suggestion':
        return (
          <ActivitySuggestion 
            mood={mood} 
            activity={activity} 
            onTryAgain={resetGame}
            moodHistory={moodHistory}
            onActivityComplete={handleActivityComplete}
          />
        );
        
      default:
        return <p>Something went wrong. Please refresh the page.</p>;
    }
  };

 // In MoodBoosterGame.js
return (
  <div className="min-h-screen mood-gradient-bg flex flex-col items-center justify-center p-4">
    <h1 className="text-3xl font-bold mb-8 text-center text-white drop-shadow-lg">
      Mood Booster Game
    </h1>
    
    <div className="mood-card w-full max-w-lg p-6">
      {renderGameContent()}
      
      {error && gamePhase !== 'error' && (
        <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg text-center">
          {error}
        </div>
      )}
    </div>
    
    <p className="mt-8 text-sm text-white text-center max-w-md">
      This app uses AI facial recognition to detect your mood.
      <br />All processing happens directly in your browser for privacy.
    </p>
  </div>
);
};

export default MoodBoosterGame;