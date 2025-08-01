'use client';

import React, { useEffect } from 'react';
import { Notification as NotificationType } from '../../app/(protected)/directeur/eleves/components/EleveAjout/context/FormContext';

interface NotificationProps {
  notification: NotificationType;
  onClose: (id: string) => void;
}

export const Notification: React.FC<NotificationProps> = ({ notification, onClose }) => {
  // Fermeture automatique après la durée spécifiée
  useEffect(() => {
    if (notification.duration) {
      const timer = setTimeout(() => {
        onClose(notification.id);
      }, notification.duration);
      
      return () => clearTimeout(timer);
    }
  }, [notification, onClose]);
  
  // Déterminer les classes CSS en fonction du type de notification
  const getNotificationClasses = () => {
    const baseClasses = 'flex items-center p-4 mb-3 rounded-md shadow-md transition-all transform animate-slide-in';
    
    switch (notification.type) {
      case 'success':
        return `${baseClasses} bg-green-50 border-l-4 border-green-500 text-green-700`;
      case 'error':
        return `${baseClasses} bg-red-50 border-l-4 border-red-500 text-red-700`;
      case 'warning':
        return `${baseClasses} bg-yellow-50 border-l-4 border-yellow-500 text-yellow-700`;
      case 'info':
      default:
        return `${baseClasses} bg-blue-50 border-l-4 border-blue-500 text-blue-700`;
    }
  };
  
  // Icône en fonction du type de notification
  const getIcon = () => {
    switch (notification.type) {
      case 'success':
        return (
          <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        );
      case 'error':
        return (
          <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        );
      case 'warning':
        return (
          <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        );
      case 'info':
      default:
        return (
          <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zm-1 9a1 1 0 01-1-1v-4a1 1 0 112 0v4a1 1 0 01-1 1z" clipRule="evenodd" />
          </svg>
        );
    }
  };
  
  return (
    <div className={getNotificationClasses()} role="alert">
      {getIcon()}
      <div className="flex-grow">{notification.message}</div>
      <button 
        type="button" 
        className="ml-3 text-gray-400 hover:text-gray-600 focus:outline-none"
        onClick={() => onClose(notification.id)}
        aria-label="Fermer"
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>
    </div>
  );
};
