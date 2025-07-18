'use client';

import React, { useEffect, useRef } from 'react';
import { Notification } from './Notification';
import { Notification as NotificationType } from '../../app/(protected)/directeur/eleves/components/EleveAjout/context/FormContext';
import { saveNotification } from '@/components/notification/notificationService';

interface NotificationContainerProps {
  notifications: NotificationType[];
  removeNotification: (id: string) => void;
  /**
   * ID de l'utilisateur destinataire (optionnel)
   */
  userId?: number;
  /**
   * ID du bureau associé (optionnel, par défaut récupéré depuis localStorage)
   */
  bureauId?: number;
  /**
   * ID de l'école associée (optionnel, par défaut récupéré depuis localStorage)
   */
  ecoleId?: number;
  /**
   * Si true, les notifications ne seront pas enregistrées en base de données
   */
  disablePersistence?: boolean;
}

export const NotificationContainer: React.FC<NotificationContainerProps> = ({ 
  notifications, 
  removeNotification,
  userId,
  bureauId,
  ecoleId,
  disablePersistence = false
}) => {
  // Référence pour suivre les notifications déjà enregistrées
  const savedNotificationsRef = useRef<Set<string>>(new Set());
  
  // Effet pour enregistrer les nouvelles notifications en base de données
  useEffect(() => {
    if (disablePersistence) return;
    
    // Filtrer les notifications qui n'ont pas encore été enregistrées
    const newNotifications = notifications.filter(
      notification => !savedNotificationsRef.current.has(notification.id)
    );
    
    // Enregistrer chaque nouvelle notification
    newNotifications.forEach(async (notification) => {
      // Marquer la notification comme enregistrée
      savedNotificationsRef.current.add(notification.id);
      
      // Enregistrer dans la base de données
      try {
        await saveNotification(notification, userId, bureauId, ecoleId);
      } catch (error) {
        console.error('Erreur lors de l\'enregistrement de la notification:', error);
      }
    });
  }, [notifications, userId, bureauId, ecoleId, disablePersistence]);
  
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
