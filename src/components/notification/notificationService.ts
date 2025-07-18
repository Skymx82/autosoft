'use client';

import { supabase } from '@/lib/supabase';
import { Notification } from '@/app/(protected)/directeur/eleves/components/EleveAjout/context/FormContext';

// Interface pour les notifications en base de données
export interface DBNotification {
  code_notif?: number;
  type_notif: string;
  message_notif: string;
  date_notif?: string;
  id_destinataire?: number | null;
  lu?: boolean;
  priorite?: string;
  id_bureau?: number | null;
  id_ecole?: number | null;
}

/**
 * Convertit une notification d'interface en objet compatible avec la base de données
 * @param notification - La notification à convertir
 * @param userId - L'ID de l'utilisateur destinataire (optionnel)
 * @param bureauId - L'ID du bureau associé (optionnel)
 * @param ecoleId - L'ID de l'école associée (optionnel)
 * @returns L'objet notification formaté pour la base de données
 */
export const convertToDBNotification = (
  notification: Notification,
  userId?: number,
  bureauId?: number,
  ecoleId?: number
): DBNotification => {
  // Mapper la priorité en fonction du type de notification
  let priorite = 'normale';
  switch (notification.type) {
    case 'error':
      priorite = 'haute';
      break;
    case 'warning':
      priorite = 'moyenne';
      break;
    case 'success':
    case 'info':
    default:
      priorite = 'normale';
      break;
  }

  return {
    type_notif: notification.type,
    message_notif: notification.message,
    id_destinataire: userId || null,
    lu: false,
    priorite,
    id_bureau: bureauId || null,
    id_ecole: ecoleId || null
  };
};

/**
 * Enregistre une notification dans la base de données
 * @param notification - La notification à enregistrer
 * @param userId - L'ID de l'utilisateur destinataire (optionnel)
 * @param bureauId - L'ID du bureau associé (optionnel)
 * @param ecoleId - L'ID de l'école associée (optionnel)
 * @returns Promise avec le résultat de l'opération
 */
export const saveNotification = async (
  notification: Notification,
  userId?: number,
  bureauId?: number,
  ecoleId?: number
): Promise<{ success: boolean; error?: string }> => {
  try {
    // Récupérer les IDs depuis le localStorage si non fournis
    const storedBureauId = bureauId || Number(localStorage.getItem('id_bureau'));
    const storedEcoleId = ecoleId || Number(localStorage.getItem('id_ecole'));
    
    // Convertir la notification au format de la base de données
    const dbNotification = convertToDBNotification(
      notification,
      userId,
      storedBureauId || undefined,
      storedEcoleId || undefined
    );
    
    // Enregistrer dans la base de données
    const { error } = await supabase
      .from('notifications')
      .insert(dbNotification);
    
    if (error) {
      console.error('Erreur lors de l\'enregistrement de la notification:', error);
      return { success: false, error: error.message };
    }
    
    return { success: true };
  } catch (error) {
    console.error('Exception lors de l\'enregistrement de la notification:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Erreur inconnue'
    };
  }
};

/**
 * Marque une notification comme lue dans la base de données
 * @param notificationId - L'ID de la notification à marquer comme lue
 * @returns Promise avec le résultat de l'opération
 */
export const markNotificationAsRead = async (
  notificationId: number
): Promise<{ success: boolean; error?: string }> => {
  try {
    const { error } = await supabase
      .from('notifications')
      .update({ lu: true })
      .eq('code_notif', notificationId);
    
    if (error) {
      console.error('Erreur lors du marquage de la notification comme lue:', error);
      return { success: false, error: error.message };
    }
    
    return { success: true };
  } catch (error) {
    console.error('Exception lors du marquage de la notification comme lue:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Erreur inconnue'
    };
  }
};

/**
 * Récupère les notifications non lues pour un utilisateur
 * @param userId - L'ID de l'utilisateur
 * @param bureauId - L'ID du bureau (optionnel)
 * @param ecoleId - L'ID de l'école (optionnel)
 * @returns Promise avec les notifications récupérées
 */
export const fetchUnreadNotifications = async (
  userId: number,
  bureauId?: number,
  ecoleId?: number
): Promise<{ notifications: DBNotification[]; error?: string }> => {
  try {
    // Récupérer les IDs depuis le localStorage si non fournis
    const storedBureauId = bureauId || Number(localStorage.getItem('id_bureau'));
    const storedEcoleId = ecoleId || Number(localStorage.getItem('id_ecole'));
    
    // Construire la requête
    let query = supabase
      .from('notifications')
      .select('*')
      .eq('lu', false);
    
    // Filtrer par destinataire si spécifié
    if (userId) {
      query = query.eq('id_destinataire', userId);
    }
    
    // Filtrer par bureau si spécifié
    if (storedBureauId) {
      query = query.eq('id_bureau', storedBureauId);
    }
    
    // Filtrer par école si spécifié
    if (storedEcoleId) {
      query = query.eq('id_ecole', storedEcoleId);
    }
    
    // Exécuter la requête
    const { data, error } = await query.order('date_notif', { ascending: false });
    
    if (error) {
      console.error('Erreur lors de la récupération des notifications:', error);
      return { notifications: [], error: error.message };
    }
    
    return { notifications: data || [] };
  } catch (error) {
    console.error('Exception lors de la récupération des notifications:', error);
    return { 
      notifications: [], 
      error: error instanceof Error ? error.message : 'Erreur inconnue'
    };
  }
};
