'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import useNotifications from '@/components/notification/useNotifications';
import { NotificationContainer } from './NotificationContainer';
import { Notification } from '../../app/(protected)/directeur/eleves/components/EleveAjout/context/FormContext';

// Type pour le contexte
interface NotificationContextType {
  notifications: Notification[];
  addNotification: (type: 'success' | 'error' | 'info' | 'warning', message: string, duration?: number) => Promise<string>;
  removeNotification: (id: string) => void;
  clearAllNotifications: () => void;
}

// Props pour le provider
interface NotificationProviderProps {
  children: ReactNode;
  userId?: number;
  bureauId?: number;
  ecoleId?: number;
  disablePersistence?: boolean;
}

// Créer le contexte
const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

// Provider du contexte
export function NotificationProvider({ 
  children, 
  userId, 
  bureauId, 
  ecoleId,
  disablePersistence = false
}: NotificationProviderProps) {
  // Utiliser le hook de notifications
  const notificationMethods = useNotifications({ 
    userId, 
    bureauId, 
    ecoleId,
    disablePersistence
  });
  
  return (
    <NotificationContext.Provider value={notificationMethods}>
      {children}
      <NotificationContainer
        notifications={notificationMethods.notifications}
        removeNotification={notificationMethods.removeNotification}
        userId={userId}
        bureauId={bureauId}
        ecoleId={ecoleId}
        disablePersistence={disablePersistence}
      />
    </NotificationContext.Provider>
  );
}

// Hook personnalisé pour utiliser le contexte
export function useNotificationContext() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotificationContext doit être utilisé à l\'intérieur d\'un NotificationProvider');
  }
  return context;
}
