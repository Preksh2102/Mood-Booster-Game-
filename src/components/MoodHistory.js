import React, { useState } from 'react';
import { Smile, Frown, Meh, ChevronDown, ChevronUp } from 'lucide-react';

const MoodHistory = ({ history }) => {
  const [expanded, setExpanded] = useState(false);
  
  if (!history || history.length === 0) {
    return null;
  }
  
  const getMoodIcon = (mood) => {
    switch (mood) {
      case 'happy': return <Smile size={16} className="mood-icon mood-icon-happy" />;
      case 'sad': return <Frown size={16} className="mood-icon mood-icon-sad" />;
      case 'neutral': return <Meh size={16} className="mood-icon mood-icon-neutral" />;
      default: return null;
    }
  };
  
  const formatTime = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleDateString();
  };
  
  // Count occurrences of each mood
  const moodCounts = history.reduce((counts, item) => {
    counts[item.mood] = (counts[item.mood] || 0) + 1;
    return counts;
  }, {});
  
  // Calculate percentages
  const totalMoods = history.length;
  const moodPercentages = Object.entries(moodCounts).map(([mood, count]) => ({
    mood,
    count,
    percentage: Math.round((count / totalMoods) * 100)
  }));
  
  // Sort by count, descending
  moodPercentages.sort((a, b) => b.count - a.count);
  
  // Get mood for today only
  const today = new Date().toLocaleDateString();
  const todayMoods = history.filter(item => {
    const itemDate = new Date(item.timestamp).toLocaleDateString();
    return itemDate === today;
  });
  
  return (
    <div className="mt-6 border-t pt-4">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold">Your Mood History</h3>
        <button 
          onClick={() => setExpanded(!expanded)}
          className="text-blue-500 flex items-center text-sm mood-button"
        >
          {expanded ? (
            <>Less <ChevronUp size={16} /></>
          ) : (
            <>More <ChevronDown size={16} /></>
          )}
        </button>
      </div>
      
      {/* Recent moods */}
      <div className="flex flex-wrap gap-2 mb-3">
        {history.slice(-5).map((item, index) => (
          <div key={index} className="flex items-center bg-gray-100 rounded-full px-3 py-1 hover:bg-gray-200 transition-colors">
            {getMoodIcon(item.mood)}
            <span className="ml-1 capitalize text-sm">{item.mood}</span>
            <span className="ml-1 text-xs text-gray-500">({formatTime(item.timestamp)})</span>
          </div>
        ))}
      </div>
      
      {/* Expanded stats */}
      {expanded && (
        <div className="mt-4 bg-gray-50 p-4 rounded-lg slide-up">
          <h4 className="font-medium mb-2">Mood Distribution</h4>
          
          {/* Mood percentages */}
          <div className="space-y-2 mb-4">
            {moodPercentages.map(({ mood, count, percentage }) => (
              <div key={mood} className="flex items-center">
                <div className="w-24 flex items-center">
                  {getMoodIcon(mood)}
                  <span className="ml-1 capitalize">{mood}</span>
                </div>
                <div className="mood-bar-container flex-1">
                  <div 
                    className={`mood-bar mood-bar-${mood}`}
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
                <span className="ml-2 text-sm w-16">{count} ({percentage}%)</span>
              </div>
            ))}
          </div>
          
          {/* Today's summary */}
          {todayMoods.length > 0 && (
            <>
              <h4 className="font-medium mb-2">Today's Mood</h4>
              <p className="text-sm">
                Today you've tracked {todayMoods.length} mood{todayMoods.length !== 1 ? 's' : ''}.
                {' '}Most frequently you've felt{' '}
                <span className="font-medium capitalize">
                  {Object.entries(
                    todayMoods.reduce((acc, { mood }) => {
                      acc[mood] = (acc[mood] || 0) + 1;
                      return acc;
                    }, {})
                  ).sort((a, b) => b[1] - a[1])[0][0]}
                </span>.
              </p>
            </>
          )}
          
          {/* History timestamps */}
          <div className="mt-4">
            <h4 className="font-medium mb-2">Recent History</h4>
            <div className="max-h-32 overflow-y-auto text-sm space-y-1">
              {[...history].reverse().map((item, index) => (
                <div key={index} className="flex justify-between text-gray-600 hover:bg-gray-100 p-1 rounded">
                  <div className="flex items-center">
                    {getMoodIcon(item.mood)}
                    <span className="ml-1 capitalize">{item.mood}</span>
                  </div>
                  <span>
                    {formatDate(item.timestamp)} at {formatTime(item.timestamp)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MoodHistory;