import React, { useState, useEffect } from 'react';
import { X, Clock, CheckCircle, Smile } from 'lucide-react';

const ActivityDetail = ({ activity, onClose, onComplete }) => {
  // State variables to track activity status and timer
  const [isCompleted, setIsCompleted] = useState(false);
  const [timer, setTimer] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  
  // Extract time duration from the activity's duration text
  // For example, converts "5 min" to the number 5
  const parseDuration = () => {
    const match = activity.duration.match(/(\d+)/);
    return match ? parseInt(match[0], 10) : 5; // Default to 5 minutes if parsing fails
  };
  
  // Function to start the activity timer
  const startTimer = () => {
    const minutes = parseDuration();
    const seconds = minutes * 60;
    setTimeLeft(seconds);
    
    // Create an interval that decreases timeLeft by 1 every second
    const intervalId = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(intervalId);
          setIsCompleted(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    setTimer(intervalId);
  };
  
  // Format seconds to mm:ss display format
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  // Function to cancel the timer
  const cancelTimer = () => {
    if (timer) {
      clearInterval(timer);
      setTimer(null);
    }
  };
  
  // Function to mark the activity as completed
  const completeActivity = () => {
    cancelTimer();
    setIsCompleted(true);
    if (onComplete) {
      onComplete(activity);
    }
  };
  
  // Clean up on component unmount to prevent memory leaks
  useEffect(() => {
    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [timer]);
  
 // In ActivityDetail.js
return (
  <div className="mood-modal show">
    <div className="mood-modal-content p-0">
      {/* Header section with activity name and close button */}
      <div className="flex justify-between items-center p-4 border-b">
        <h3 className="text-xl font-bold flex items-center">
          {activity.icon}
          <span className="ml-2">{activity.name}</span>
        </h3>
        <button 
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700"
        >
          <X size={20} />
        </button>
      </div>
      
      {/* Content section - changes based on activity state */}
      <div className="p-6">
        <p className="mb-4">{activity.description}</p>
        
        <div className="flex items-center text-gray-600 mb-6">
          <Clock size={18} />
          <span className="ml-2">Duration: {activity.duration}</span>
        </div>
        
        {isCompleted ? (
          // Completed state UI
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
            <CheckCircle size={48} className="text-green-500 mx-auto mb-2" />
            <h4 className="text-lg font-semibold text-green-700 mb-1">
              Activity Completed!
            </h4>
            <p className="text-green-600">
              Great job! How do you feel now?
            </p>
            
            <div className="flex justify-center space-x-4 mt-4">
              <button className="p-2 hover:bg-green-100 rounded-full transition-colors">
                <Smile size={32} className="mood-icon mood-icon-happy" />
              </button>
            </div>
          </div>
        ) : (
          <>
            {timer ? (
              // Timer running state UI
              <div className="text-center">
                <div className="activity-timer mb-4">{formatTime(timeLeft)}</div>
                <button
                  onClick={cancelTimer}
                  className="mood-button mood-button-secondary mr-2"
                >
                  Cancel
                </button>
                <button
                  onClick={completeActivity}
                  className="mood-button mood-button-primary"
                >
                  Complete Early
                </button>
              </div>
            ) : (
              // Initial state UI with options to start or complete
              <div className="flex justify-center space-x-4">
                <button
                  onClick={startTimer}
                  className="mood-button mood-button-primary"
                >
                  Start Timer
                </button>
                <button
                  onClick={completeActivity}
                  className="mood-button mood-button-secondary"
                >
                  Mark as Done
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  </div>
);
}

export default ActivityDetail;