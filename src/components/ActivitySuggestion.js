import React, { useState } from 'react';
import { Smile, Frown, Meh } from 'lucide-react';
import ActivityDetail from './ActivityDetail';
import MoodHistory from './MoodHistory';
import MoodStats from './MoodStats';

const ActivitySuggestion = ({ mood, activity, onTryAgain, moodHistory, onActivityComplete }) => {
  const [showDetail, setShowDetail] = useState(false);
  const [completedActivity, setCompletedActivity] = useState(false);
  
  // Render appropriate emoji based on mood
 // In ActivitySuggestion.js
// Render appropriate emoji based on mood
const renderMoodEmoji = () => {
  switch (mood) {
    case 'happy':
      return <Smile size={48} className="mood-icon mood-icon-happy mood-icon-large" />;
    case 'sad':
      return <Frown size={48} className="mood-icon mood-icon-sad mood-icon-large" />;
    case 'neutral':
    default:
      return <Meh size={48} className="mood-icon mood-icon-neutral mood-icon-large" />;
  }
};


  
  // Handle activity completion
  const handleActivityComplete = (completedActivity) => {
    setCompletedActivity(true);
    setShowDetail(false);
    if (onActivityComplete) {
      onActivityComplete(completedActivity);
    }
  };
  
  return (
    <div className="flex flex-col items-center justify-center space-y-6">
      <h2 className="text-2xl font-bold text-center">Your Mood Result</h2>
      
      <div className="flex items-center justify-center text-4xl">
        {renderMoodEmoji()}
        <span className="ml-3 capitalize">{mood}</span>
      </div>
      
      {activity && (
        <div className={`activity-card p-6 rounded-lg shadow-md max-w-md w-full activity-card-${mood}`}>
          <h3 className="text-xl font-bold flex items-center">
            {activity.icon}
            <span className="ml-2">{activity.name}</span>
          </h3>
          <p className="mt-2">{activity.description}</p>
          <p className="mt-2 text-sm text-gray-600">Duration: {activity.duration}</p>
          
          <div className="mt-4 flex justify-center">
            <button
              onClick={() => setShowDetail(true)}
              className="mood-button mood-button-primary py-2 px-6 rounded-lg shadow-md"
            >
              Start Activity
            </button>
          </div>
          
          {completedActivity && (
            <div className="mt-4 bg-green-50 border border-green-100 rounded-lg p-3 text-center fade-in">
              <p className="text-green-700">Activity completed! Great job!</p>
            </div>
          )}
        </div>
      )}
      
      <div className="flex space-x-4">
        <button 
          onClick={onTryAgain}
          className="mood-button mood-button-primary bg-green-500 hover:bg-green-600 py-2 px-6 rounded-lg shadow-md"
        >
          Try Again
        </button>
      </div>
      
      {moodHistory && moodHistory.length > 0 && (
        <div className="w-full fade-in">
          <MoodHistory history={moodHistory} />
          {moodHistory.length >= 3 && <MoodStats history={moodHistory} />}
        </div>
      )}
      
      {showDetail && (
        <ActivityDetail 
          activity={activity} 
          onClose={() => setShowDetail(false)}
          onComplete={handleActivityComplete}
        />
      )}
    </div>
  );}

export default ActivitySuggestion;