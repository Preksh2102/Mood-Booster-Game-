import React from 'react';

const PrivacyPolicy = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-4">Privacy Policy</h2>
          
          <div className="space-y-4 text-left">
            <p>
              At Mood Booster Game, we take your privacy seriously. This privacy policy explains 
              how our application works and how we handle your data.
            </p>
            
            <h3 className="text-lg font-semibold">Data Collection</h3>
            <p>
              <strong>Camera Access:</strong> Our app requires access to your device's camera to 
              detect facial expressions for mood analysis. All processing is done directly on your 
              device, and no video or image data is ever transmitted to our servers or any third-party.
            </p>
            
            <h3 className="text-lg font-semibold">Data Storage</h3>
            <p>
              <strong>Local Storage Only:</strong> Any data collected (such as your mood history) 
              is stored only in your browser's local storage and is not transmitted elsewhere. 
              This data is cleared when you clear your browser data.
            </p>
            
            <h3 className="text-lg font-semibold">AI Processing</h3>
            <p>
              <strong>On-device AI:</strong> The facial recognition and emotion detection is 
              performed entirely on your device using pre-trained models that run in your browser. 
              No images or analysis results leave your device.
            </p>
            
            <h3 className="text-lg font-semibold">Third-party Libraries</h3>
            <p>
              We use the following open-source libraries:
            </p>
            <ul className="list-disc pl-5">
              <li>face-api.js - For facial detection and emotion analysis</li>
              <li>React.js - For the user interface</li>
              <li>Tailwind CSS - For styling</li>
            </ul>
            <p>
              These libraries do not collect any personal data as part of our implementation.
            </p>
            
            <h3 className="text-lg font-semibold">Changes to This Policy</h3>
            <p>
              We may update our Privacy Policy from time to time. We will notify you of any changes 
              by posting the new Privacy Policy on this page.
            </p>
            
            <h3 className="text-lg font-semibold">Contact Us</h3>
            <p>
              If you have any questions about this Privacy Policy, please contact us at:
              privacy@moodboostergame.example.com
            </p>
          </div>
          
          <div className="mt-6 flex justify-end">
            <button 
              onClick={onClose}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-lg shadow-md transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;