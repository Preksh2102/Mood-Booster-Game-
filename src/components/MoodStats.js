import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Smile, Frown, Meh } from 'lucide-react';

const MoodStats = ({ history }) => {
  if (!history || history.length < 3) {
    return null;
  }
  
  // Group moods by date
  const moodsByDate = history.reduce((acc, item) => {
    const date = new Date(item.timestamp).toLocaleDateString();
    if (!acc[date]) {
      acc[date] = { happy: 0, sad: 0, neutral: 0, date };
    }
    acc[date][item.mood] += 1;
    return acc;
  }, {});
  
  // Convert to array and sort by date
  const chartData = Object.values(moodsByDate).sort((a, b) => 
    new Date(a.date) - new Date(b.date)
  );
  
  // Only show last 7 days if we have more data
  const displayData = chartData.length > 7 ? chartData.slice(-7) : chartData;
  
  // Format date labels
  displayData.forEach(item => {
    const date = new Date(item.date);
    item.shortDate = `${date.getMonth() + 1}/${date.getDate()}`;
  });
  
  // Calculate dominant mood
  const totalMoods = { happy: 0, sad: 0, neutral: 0 };
  history.forEach(item => {
    totalMoods[item.mood] += 1;
  });
  
  let dominantMood = 'neutral';
  let highestCount = 0;
  
  Object.entries(totalMoods).forEach(([mood, count]) => {
    if (count > highestCount) {
      highestCount = count;
      dominantMood = mood;
    }
  });
  
  const getMoodIcon = (mood, size = 24) => {
    switch (mood) {
      case 'happy': return <Smile size={size} className="text-yellow-500" />;
      case 'sad': return <Frown size={size} className="text-blue-500" />;
      case 'neutral': return <Meh size={size} className="text-gray-500" />;
      default: return null;
    }
  };
  
  const getMoodMessage = (mood) => {
    switch (mood) {
      case 'happy':
        return "You've been mostly happy! Keep up the positive energy and remember to share your joy with others.";
      case 'sad':
        return "You've been feeling down lately. Remember that it's okay to feel this way, and consider trying some of our mood-boosting activities.";
      case 'neutral':
        return "Your mood has been mostly neutral. This is a great opportunity to try new activities that could bring more joy to your day.";
      default:
        return "Keep tracking your mood to see patterns and get personalized insights.";
    }
  };
  
  return (
    <div className="mt-8 p-4 bg-white rounded-lg shadow-md">
      <h3 className="text-xl font-bold mb-4">Your Mood Insights</h3>
      
      <div className="flex items-center mb-6">
        <div className="mr-4">{getMoodIcon(dominantMood, 48)}</div>
        <div>
          <p className="font-medium">Your dominant mood has been <span className="capitalize">{dominantMood}</span></p>
          <p className="text-sm text-gray-600">{getMoodMessage(dominantMood)}</p>
        </div>
      </div>
      
      <div className="h-64 mb-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={displayData}
            margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="shortDate" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="happy" name="Happy" fill="#fbbf24" />
            <Bar dataKey="neutral" name="Neutral" fill="#9ca3af" />
            <Bar dataKey="sad" name="Sad" fill="#60a5fa" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      <p className="text-sm text-gray-500 text-center">
        Mood distribution over the past {displayData.length} days
      </p>
    </div>
  );
};

export default MoodStats;