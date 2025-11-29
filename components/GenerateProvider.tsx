
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

interface SettingsContextType {
  apiKey: string | null;
  saveApiKey: (key: string) => void;
  isKeySet: boolean;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const GenerateProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [apiKey, setApiKey] = useState<string | null>(() => localStorage.getItem('GEMINI_API_KEY'));
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Only redirect if not on the settings page and key is missing
    if (!apiKey && location.pathname !== '/settings') {
      setToastMessage('Please set your API key first.');
      navigate('/settings');
    }
  }, [apiKey, location.pathname, navigate]);

  const saveApiKey = (key: string) => {
    localStorage.setItem('GEMINI_API_KEY', key);
    setApiKey(key);
  };
  
  const Toast = ({ message, onClose }: { message: string, onClose: () => void }) => {
    useEffect(() => {
      const timer = setTimeout(onClose, 3000);
      return () => clearTimeout(timer);
    }, [onClose]);

    return (
      <div className="fixed top-5 right-5 bg-red-500 text-white py-2 px-4 rounded-lg shadow-lg z-50">
        {message}
      </div>
    );
  };

  return (
    <SettingsContext.Provider value={{ apiKey, saveApiKey, isKeySet: !!apiKey }}>
      {toastMessage && <Toast message={toastMessage} onClose={() => setToastMessage(null)} />}
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = (): SettingsContextType => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a GenerateProvider');
  }
  return context;
};
