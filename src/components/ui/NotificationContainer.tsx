'use client';

import React from 'react';
import { Notification } from './Notification';
import { Notification as NotificationType } from '../directeur/eleve/EleveAjout/context/FormContext';

interface NotificationContainerProps {
  notifications: NotificationType[];
  removeNotification: (id: string) => void;
}

export const NotificationContainer: React.FC<NotificationContainerProps> = ({ 
  notifications, 
  removeNotification 
}) => {
  if (notifications.length === 0) return null;
  
  return (
    <div className="fixed top-4 right-4 z-50 w-80 max-w-md">
      {notifications.map((notification) => (
        <Notification
          key={notification.id}
          notification={notification}
          onClose={removeNotification}
        />
      ))}
    </div>
  );
};
