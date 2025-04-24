/**
 * Utility functions for working with localStorage
 */

const STORAGE_KEY = 'mood-booster-data';

/**
 * Save data to localStorage
 * @param {Object} data - Data object to save
 */
export const saveToLocalStorage = (data) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error('Error saving to localStorage:', error);
    return false;
  }
};

/**
 * Load data from localStorage
 * @returns {Object|null} - Saved data object or null if not found/error
 */
export const loadFromLocalStorage = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error loading from localStorage:', error);
    return null;
  }
};

/**
 * Clear all saved data from localStorage
 */
export const clearLocalStorage = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
    return true;
  } catch (error) {
    console.error('Error clearing localStorage:', error);
    return false;
  }
};

/**
 * Save mood history to localStorage
 * @param {Array} moodHistory - Array of mood history entries
 */
export const saveMoodHistory = (moodHistory) => {
  try {
    const existingData = loadFromLocalStorage() || {};
    existingData.moodHistory = moodHistory;
    saveToLocalStorage(existingData);
    return true;
  } catch (error) {
    console.error('Error saving mood history:', error);
    return false;
  }
};

/**
 * Save completed activities to localStorage
 * @param {Array} completedActivities - Array of completed activity entries
 */
export const saveCompletedActivities = (completedActivities) => {
  try {
    const existingData = loadFromLocalStorage() || {};
    existingData.completedActivities = completedActivities;
    saveToLocalStorage(existingData);
    return true;
  } catch (error) {
    console.error('Error saving completed activities:', error);
    return false;
  }
};

/**
 * Get mood history from localStorage
 * @returns {Array} - Array of mood history entries
 */
export const getMoodHistory = () => {
  const data = loadFromLocalStorage();
  return data?.moodHistory || [];
};

/**
 * Get completed activities from localStorage
 * @returns {Array} - Array of completed activity entries
 */
export const getCompletedActivities = () => {
  const data = loadFromLocalStorage();
  return data?.completedActivities || [];
};

/**
 * Check if the app has been run before (has saved data)
 * @returns {boolean} - Whether the app has saved data
 */
export const hasExistingData = () => {
  const data = loadFromLocalStorage();
  return !!data && 
    ((data.moodHistory && data.moodHistory.length > 0) || 
     (data.completedActivities && data.completedActivities.length > 0));
};

/**
 * Get statistics about mood history
 * @returns {Object} - Object containing mood statistics
 */
export const getMoodStatistics = () => {
  const moodHistory = getMoodHistory();
  
  if (!moodHistory || moodHistory.length === 0) {
    return { 
      totalEntries: 0,
      moodCounts: { happy: 0, sad: 0, neutral: 0 },
      dominantMood: 'neutral',
      mostRecentMood: 'neutral',
      lastUpdated: null
    };
  }
  
  // Count occurrences of each mood
  const moodCounts = moodHistory.reduce((counts, item) => {
    counts[item.mood] = (counts[item.mood] || 0) + 1;
    return counts;
  }, { happy: 0, sad: 0, neutral: 0 });
  
  // Find dominant mood
  let dominantMood = 'neutral';
  let highestCount = 0;
  
  Object.entries(moodCounts).forEach(([mood, count]) => {
    if (count > highestCount) {
      highestCount = count;
      dominantMood = mood;
    }
  });
  
  // Get most recent mood
  const sortedHistory = [...moodHistory].sort((a, b) => 
    new Date(b.timestamp) - new Date(a.timestamp)
  );
  
  return {
    totalEntries: moodHistory.length,
    moodCounts,
    dominantMood,
    mostRecentMood: sortedHistory[0]?.mood || 'neutral',
    lastUpdated: sortedHistory[0]?.timestamp || null
  };
};