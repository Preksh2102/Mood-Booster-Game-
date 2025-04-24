import React, { useState } from 'react';
import { X, Trash2, Save, RotateCcw } from 'lucide-react';
import { clearLocalStorage } from '../utils/localStorageUtils';

const Settings = ({ onClose }) => {
  const [showConfirmReset, setShowConfirmReset] = useState(false);
  const [resetComplete, setResetComplete] = useState(false);
  
  // Reset all data
  const handleResetData = () => {
    clearLocalStorage();
    setShowConfirmReset(false);
    setResetComplete(true);
    
    // Show reset confirmation message for 2 seconds
    setTimeout(() => {
      onClose();
      // Force page reload to clear state
      window.location.reload();
    }, 2000);
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-xl font-bold">Settings</h3>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>
        
        {/* Content */}
        <div className="p-6">
          {resetComplete ? (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
              <p className="text-green-700">Data successfully reset!</p>
              <p className="text-sm text-green-600">Reloading page...</p>
            </div>
          ) : showConfirmReset ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <h4 className="text-lg font-semibold text-red-700 mb-2">Confirm Reset</h4>
              <p className="text-red-600 mb-4">
                This will permanently delete all your mood history and activity data. This action cannot be undone.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowConfirmReset(false)}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={handleResetData}
                  className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg flex items-center"
                >
                  <Trash2 size={16} className="mr-1" />
                  Reset All Data
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <h4 className="font-semibold mb-2">Data & Privacy</h4>
                <p className="text-gray-600 text-sm mb-4">
                  All your data is stored locally on your device and is never sent to any server.
                  You can reset your data at any time.
                </p>
                <button
                  onClick={() => setShowConfirmReset(true)}
                  className="bg-red-100 hover:bg-red-200 text-red-700 font-bold py-2 px-4 rounded-lg flex items-center"
                >
                  <RotateCcw size={16} className="mr-1" />
                  Reset All Data
                </button>
              </div>
              
              <div className="mb-6">
                <h4 className="font-semibold mb-2">About Mood Booster</h4>
                <p className="text-gray-600 text-sm">
                  This application uses AI facial recognition to detect your mood and suggest
                  personalized activities to boost your well-being. All processing happens directly
                  on your device for complete privacy.
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Credits</h4>
                <p className="text-gray-600 text-sm">
                  - Facial detection powered by face-api.js<br />
                  - Icons from Lucide<br />
                  - Built with React and Tailwind CSS
                </p>
              </div>
            </>
          )}
        </div>
        
        {/* Footer */}
        {!showConfirmReset && !resetComplete && (
          <div className="border-t p-4 flex justify-end">
            <button
              onClick={onClose}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-lg"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;