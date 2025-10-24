import { supabase } from '@/lib/supabase';

export type NotificationType = 'success' | 'warning' | 'error' | 'info';
export type NotificationPriority = 'haute' | 'normale' | 'basse';

interface CreateNotificationParams {
  type: NotificationType;
  message: string;
  id_destinataire: number | string;
  id_ecole: number | string;
  id_bureau?: number | string | null;
  priorite?: NotificationPriority;
}

/**
 * Créer une notification dans la base de données
 * 
 * @example
 * ```ts
 * await createNotification({
 *   type: 'success',
 *   message: 'Votre leçon a été créée avec succès',
 *   id_destinataire: 123,
 *   id_ecole: 1,
 *   id_bureau: 5,
 *   priorite: 'normale'
 * });
 * ```
 */
export async function createNotification({
  type,
  message,
  id_destinataire,
  id_ecole,
  id_bureau = null,
  priorite = 'normale'
}: CreateNotificationParams): Promise<{ success: boolean; error?: string }> {
  try {
    console.log('📬 Création notification:', {
      type,
      message: message.substring(0, 50) + '...',
      id_destinataire,
      id_ecole,
      id_bureau,
      priorite
    });

    const { data, error } = await supabase
      .from('notifications')
      .insert({
        type_notif: type,
        message_notif: message,
        id_destinataire: id_destinataire.toString(), // Garder en string (UUID ou integer)
        id_ecole: parseInt(id_ecole.toString()),
        id_bureau: id_bureau ? parseInt(id_bureau.toString()) : null,
        priorite,
        lu: false,
        date_notif: new Date().toISOString()
      })
      .select();

    if (error) {
      console.error('❌ Erreur création notification:', error);
      return { success: false, error: error.message };
    }

    console.log('✅ Notification créée:', data?.[0]?.code_notif);
    return { success: true };

  } catch (error: any) {
    console.error('❌ Erreur createNotification:', error);
    return { success: false, error: error?.message || 'Erreur inconnue' };
  }
}

/**
 * Créer une notification pour plusieurs utilisateurs
 * 
 * @example
 * ```ts
 * await createNotificationForMultipleUsers({
 *   type: 'info',
 *   message: 'Nouvelle mise à jour disponible',
 *   id_destinataires: [1, 2, 3, 4],
 *   id_ecole: 1,
 *   id_bureau: 5
 * });
 * ```
 */
export async function createNotificationForMultipleUsers({
  type,
  message,
  id_destinataires,
  id_ecole,
  id_bureau = null,
  priorite = 'normale'
}: Omit<CreateNotificationParams, 'id_destinataire'> & { id_destinataires: (number | string)[] }): Promise<{ success: boolean; created: number; error?: string }> {
  try {
    console.log('📬 Création notifications multiples:', {
      type,
      nombre: id_destinataires.length,
      id_ecole,
      id_bureau
    });

    const notifications = id_destinataires.map(id_dest => ({
      type_notif: type,
      message_notif: message,
      id_destinataire: id_dest.toString(), // Garder en string (UUID ou integer)
      id_ecole: parseInt(id_ecole.toString()),
      id_bureau: id_bureau ? parseInt(id_bureau.toString()) : null,
      priorite,
      lu: false,
      date_notif: new Date().toISOString()
    }));

    const { data, error } = await supabase
      .from('notifications')
      .insert(notifications)
      .select();

    if (error) {
      console.error('❌ Erreur création notifications multiples:', error);
      return { success: false, created: 0, error: error.message };
    }

    console.log('✅ Notifications créées:', data?.length || 0);
    return { success: true, created: data?.length || 0 };

  } catch (error: any) {
    console.error('❌ Erreur createNotificationForMultipleUsers:', error);
    return { success: false, created: 0, error: error?.message || 'Erreur inconnue' };
  }
}

/**
 * Exemples d'utilisation prédéfinis pour des cas courants
 */
export const NotificationTemplates = {
  // Leçons
  leconCreated: (eleveName: string) => ({
    type: 'success' as NotificationType,
    message: `Nouvelle leçon programmée avec ${eleveName}`,
    priorite: 'normale' as NotificationPriority
  }),
  
  leconCancelled: (eleveName: string, date: string) => ({
    type: 'warning' as NotificationType,
    message: `Leçon annulée avec ${eleveName} le ${date}`,
    priorite: 'haute' as NotificationPriority
  }),
  
  leconReminder: (eleveName: string, time: string) => ({
    type: 'info' as NotificationType,
    message: `Rappel : Leçon avec ${eleveName} dans ${time}`,
    priorite: 'haute' as NotificationPriority
  }),

  // Examens
  examenScheduled: (eleveName: string, date: string) => ({
    type: 'success' as NotificationType,
    message: `Examen programmé pour ${eleveName} le ${date}`,
    priorite: 'haute' as NotificationPriority
  }),
  
  examenPassed: (eleveName: string) => ({
    type: 'success' as NotificationType,
    message: `🎉 ${eleveName} a réussi son examen !`,
    priorite: 'normale' as NotificationPriority
  }),
  
  examenFailed: (eleveName: string) => ({
    type: 'warning' as NotificationType,
    message: `${eleveName} n'a pas réussi son examen`,
    priorite: 'normale' as NotificationPriority
  }),

  // Paiements
  paymentReceived: (eleveName: string, amount: number) => ({
    type: 'success' as NotificationType,
    message: `Paiement de ${amount}€ reçu de ${eleveName}`,
    priorite: 'normale' as NotificationPriority
  }),
  
  paymentOverdue: (eleveName: string, amount: number) => ({
    type: 'error' as NotificationType,
    message: `Paiement en retard : ${eleveName} doit ${amount}€`,
    priorite: 'haute' as NotificationPriority
  }),

  // Documents
  documentUploaded: (eleveName: string, docType: string) => ({
    type: 'info' as NotificationType,
    message: `${eleveName} a uploadé un document : ${docType}`,
    priorite: 'normale' as NotificationPriority
  }),
  
  documentValidated: (docType: string) => ({
    type: 'success' as NotificationType,
    message: `Votre document "${docType}" a été validé`,
    priorite: 'normale' as NotificationPriority
  }),
  
  documentRejected: (docType: string, reason: string) => ({
    type: 'error' as NotificationType,
    message: `Document "${docType}" rejeté : ${reason}`,
    priorite: 'haute' as NotificationPriority
  }),

  // Véhicules
  vehicleMaintenanceDue: (vehicleName: string, date: string) => ({
    type: 'warning' as NotificationType,
    message: `Entretien du véhicule ${vehicleName} prévu le ${date}`,
    priorite: 'haute' as NotificationPriority
  }),
  
  vehicleMaintenanceOverdue: (vehicleName: string) => ({
    type: 'error' as NotificationType,
    message: `⚠️ Entretien du véhicule ${vehicleName} en retard !`,
    priorite: 'haute' as NotificationPriority
  }),

  // Système
  systemUpdate: (message: string) => ({
    type: 'info' as NotificationType,
    message: `Mise à jour système : ${message}`,
    priorite: 'basse' as NotificationPriority
  }),
  
  systemError: (message: string) => ({
    type: 'error' as NotificationType,
    message: `Erreur système : ${message}`,
    priorite: 'haute' as NotificationPriority
  })
};
