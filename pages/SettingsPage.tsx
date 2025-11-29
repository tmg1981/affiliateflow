
import React, { useState, useEffect } from 'react';
import { useSettings } from '../components/GenerateProvider';

const SettingsPage: React.FC = () => {
  const { apiKey, saveApiKey } = useSettings();
  const [currentKey, setCurrentKey] = useState(apiKey || '');
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    // Sync local state if context key changes (e.g., on initial load)
    setCurrentKey(apiKey || '');
  }, [apiKey]);

  const handleSave = () => {
    saveApiKey(currentKey);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };
  
  const Toast = () => (
    <div className="fixed top-5 right-5 bg-green-600 text-white py-2 px-4 rounded-lg shadow-lg z-50 animate-pulse">
      API Key saved successfully!
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto">
      {showToast && <Toast />}
      <h1 className="text-3xl font-bold text-white mb-6">Settings</h1>
      <div className="bg-gray-800 p-8 rounded-lg shadow-xl space-y-6">
        <div>
          <h2 className="text-xl font-semibold text-white mb-4">API Configuration</h2>
          <div className="space-y-4">
            <div>
              <label htmlFor="geminiApiKey" className="block text-sm font-medium text-gray-300">Gemini API Key</label>
              <input
                type="password"
                id="geminiApiKey"
                value={currentKey}
                onChange={(e) => setCurrentKey(e.target.value)}
                placeholder="Enter your Gemini API Key here"
                className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm text-white focus:ring-teal-500 focus:border-teal-500 sm:text-sm p-3"
              />
              <p className="mt-2 text-xs text-gray-500">Your key is stored in your browser's local storage.</p>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end pt-4">
          <button
            type="button"
            onClick={handleSave}
            className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
          >
            Save API Key
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
