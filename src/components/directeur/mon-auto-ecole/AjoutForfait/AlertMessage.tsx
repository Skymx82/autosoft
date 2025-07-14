import React, { useEffect } from 'react';
import { FiCheckCircle, FiAlertTriangle, FiX } from 'react-icons/fi';

interface AlertMessageProps {
  type: 'success' | 'error';
  message: string;
  onClose: () => void;
}

const AlertMessage: React.FC<AlertMessageProps> = ({ type, message, onClose }) => {
  useEffect(() => {
    // Fermer automatiquement l'alerte après 5 secondes
    const timer = setTimeout(() => {
      onClose();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className={`fixed top-4 right-4 z-50 p-4 rounded-md shadow-md flex items-center justify-between max-w-md ${
        type === 'success' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
      }`}
    >
      <div className="flex items-center">
        {type === 'success' ? (
          <FiCheckCircle className="h-5 w-5 text-green-500 mr-3" />
        ) : (
          <FiAlertTriangle className="h-5 w-5 text-red-500 mr-3" />
        )}
        <p className={`text-sm ${type === 'success' ? 'text-green-700' : 'text-red-700'}`}>
          {message}
        </p>
      </div>
      <button
        onClick={onClose}
        className={`ml-4 ${
          type === 'success' ? 'text-green-500 hover:text-green-700' : 'text-red-500 hover:text-red-700'
        }`}
      >
        <FiX className="h-5 w-5" />
      </button>
    </div>
  );
};

export default AlertMessage;
