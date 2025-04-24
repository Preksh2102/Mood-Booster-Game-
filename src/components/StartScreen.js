import React, { useState } from 'react';
import { Settings as SettingsIcon } from 'lucide-react';
import PrivacyPolicy from './PrivacyPolicy';
import Settings from './Settings';

const StartScreen = ({ onStart, hasHistory }) => {
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  
  // In StartScreen.js
  return (
    <div className="flex flex-col items-center justify-center space-y-6 p-4">
      <div className="absolute top-4 right-4">
        <button
          onClick={() => setShowSettings(true)}
          className="settings-icon"
          aria-label="Settings"
        >
          <SettingsIcon size={24} />
        </button>
      </div>
      
      <h2 className="text-2xl font-bold text-center">Welcome to Mood Booster!</h2>
      <p className="text-center">
        This game uses your camera to detect your current mood and suggest 
        personalized activities to boost your well-being.
      </p>
      
      {hasHistory && (
        <p className="text-sm text-blue-600">
          Welcome back! Your mood history and activities are saved.
        </p>
      )}
      
      <p className="text-center text-sm text-gray-600">
        Your privacy is important - all facial analysis happens directly 
        in your browser. No images are stored or sent to any server.
      </p>
      
      <button 
        onClick={onStart}
        className="detection-button"
      >
        Start Mood Detection
      </button>
      
      <button 
        onClick={() => setShowPrivacyPolicy(true)}
        className="privacy-button"
      >
        View Privacy Policy
      </button>
      
      {showPrivacyPolicy && (
        <PrivacyPolicy onClose={() => setShowPrivacyPolicy(false)} />
      )}
      
      {showSettings && (
        <Settings onClose={() => setShowSettings(false)} />
      )}
    </div>
  );
};

export default StartScreen;