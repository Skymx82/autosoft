'use client';

import { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Notification } from '@/app/(protected)/directeur/eleves/components/EleveAjout/context/FormContext';
import { saveNotification } from '@/components/notification/notificationService';

/**
 * Hook personnalisé pour gérer les notifications
 * @param options - Options de configuration du hook
 * @returns Fonctions et état pour gérer les notifications
 */
export const useNotifications = (options?: {
  userId?: number;
  bureauId?: number;
  ecoleId?: number;
  disablePersistence?: boolean;
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  
  /**
   * Ajoute une notification
   * @param type - Type de notification (success, error, info, warning)
   * @param message - Message à afficher
   * @param duration - Durée d'affichage en millisecondes (par défaut: 5000ms)
   * @returns ID de la notification créée
   */
  const addNotification = useCallback(
    async (
      type: 'success' | 'error' | 'info' | 'warning',
      message: string,
      duration = 5000
    ): Promise<string> => {
      const id = uuidv4();
      const newNotification: Notification = {
        id,
        type,
        message,
        duration
      };
      
      setNotifications(prev => [...prev, newNotification]);
      
      // Enregistrer dans la base de données si la persistance est activée
      if (!options?.disablePersistence) {
        try {
          await saveNotification(
            newNotification,
            options?.userId,
            options?.bureauId,
            options?.ecoleId
          );
        } catch (error) {
          console.error('Erreur lors de l\'enregistrement de la notification:', error);
        }
      }
      
      return id;
    },
    [options]
  );
  
  /**
   * Supprime une notification par son ID
   * @param id - ID de la notification à supprimer
   */
  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  }, []);
  
  /**
   * Supprime toutes les notifications
   */
  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
  }, []);
  
  return {
    notifications,
    addNotification,
    removeNotification,
    clearAllNotifications
  };
};

export default useNotifications;
