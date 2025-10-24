'use client';

import { useState, useEffect, useRef } from 'react';
import { FiBell, FiCheck, FiCheckCircle, FiAlertCircle, FiInfo, FiX } from 'react-icons/fi';

interface Notification {
  code_notif: number;
  type_notif: 'success' | 'warning' | 'error' | 'info';
  message_notif: string;
  date_notif: string;
  lu: boolean;
  priorite: 'haute' | 'normale' | 'basse';
  id_destinataire: string; // UUID ou integer en string
}

export default function NotificationPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  // Fermer le panel quand on clique en dehors
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Charger les notifications au montage et quand le panel s'ouvre
  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen]);

  // Charger le compteur de notifications non lues au montage
  useEffect(() => {
    fetchUnreadCount();
    
    // Rafraîchir le compteur toutes les 30 secondes
    const interval = setInterval(() => {
      fetchUnreadCount();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  // Récupérer les notifications
  const fetchNotifications = async () => {
    setIsLoading(true);
    try {
      const userData = localStorage.getItem('autosoft_user');
      if (!userData) return;

      const user = JSON.parse(userData);
      const response = await fetch(
        `/api/notifications?id_ecole=${user.id_ecole}&id_bureau=${user.id_bureau || ''}&id_utilisateur=${user.id}`
      );

      if (!response.ok) throw new Error('Erreur lors de la récupération des notifications');

      const data = await response.json();
      setNotifications(data.notifications || []);
      setUnreadCount(data.unreadCount || 0);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Récupérer uniquement le compteur de notifications non lues
  const fetchUnreadCount = async () => {
    try {
      const userData = localStorage.getItem('autosoft_user');
      if (!userData) return;

      const user = JSON.parse(userData);
      const response = await fetch(
        `/api/notifications/count?id_ecole=${user.id_ecole}&id_bureau=${user.id_bureau || ''}&id_utilisateur=${user.id}`
      );

      if (!response.ok) return;

      const data = await response.json();
      setUnreadCount(data.count || 0);
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  // Marquer une notification comme lue
  const markAsRead = async (code_notif: number) => {
    try {
      const response = await fetch('/api/notifications', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code_notif, lu: true }),
      });

      if (!response.ok) throw new Error('Erreur lors de la mise à jour');

      // Mettre à jour localement
      setNotifications(prev =>
        prev.map(notif =>
          notif.code_notif === code_notif ? { ...notif, lu: true } : notif
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  // Marquer toutes les notifications comme lues
  const markAllAsRead = async () => {
    try {
      const userData = localStorage.getItem('autosoft_user');
      if (!userData) return;

      const user = JSON.parse(userData);
      const response = await fetch('/api/notifications/mark-all-read', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id_ecole: user.id_ecole,
          id_bureau: user.id_bureau,
          id_utilisateur: user.id,
        }),
      });

      if (!response.ok) throw new Error('Erreur lors de la mise à jour');

      // Mettre à jour localement
      setNotifications(prev => prev.map(notif => ({ ...notif, lu: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  // Supprimer une notification
  const deleteNotification = async (code_notif: number) => {
    try {
      const response = await fetch(`/api/notifications?code_notif=${code_notif}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Erreur lors de la suppression');

      // Mettre à jour localement
      const notif = notifications.find(n => n.code_notif === code_notif);
      setNotifications(prev => prev.filter(n => n.code_notif !== code_notif));
      if (notif && !notif.lu) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  // Icône selon le type de notification
  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <FiCheckCircle className="w-5 h-5 text-green-500" />;
      case 'warning':
        return <FiAlertCircle className="w-5 h-5 text-yellow-500" />;
      case 'error':
        return <FiAlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return <FiInfo className="w-5 h-5 text-blue-500" />;
    }
  };

  // Couleur de fond selon le type
  const getBgColor = (type: string, lu: boolean) => {
    if (lu) return 'bg-gray-50';
    
    switch (type) {
      case 'success':
        return 'bg-green-50';
      case 'warning':
        return 'bg-yellow-50';
      case 'error':
        return 'bg-red-50';
      default:
        return 'bg-blue-50';
    }
  };

  // Formater la date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'À l\'instant';
    if (diffMins < 60) return `Il y a ${diffMins} min`;
    if (diffHours < 24) return `Il y a ${diffHours}h`;
    if (diffDays < 7) return `Il y a ${diffDays}j`;
    
    return date.toLocaleDateString('fr-FR', { 
      day: 'numeric', 
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="relative" ref={panelRef}>
      {/* Bouton notifications avec badge */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
      >
        <span className="sr-only">Voir les notifications</span>
        <FiBell className="h-6 w-6" />
        
        {/* Badge compteur */}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex items-center justify-center h-5 w-5 text-xs font-bold text-white bg-red-500 rounded-full animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Panel des notifications */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-xl border border-gray-200 z-50 max-h-[600px] flex flex-col">
          {/* Header */}
          <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between bg-gray-50 rounded-t-lg">
            <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
              >
                <FiCheck className="w-4 h-4" />
                Tout marquer comme lu
              </button>
            )}
          </div>

          {/* Liste des notifications */}
          <div className="overflow-y-auto flex-1">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              </div>
            ) : notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 px-4">
                <FiBell className="w-12 h-12 text-gray-300 mb-3" />
                <p className="text-gray-500 text-center">Aucune notification</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {notifications.map((notif) => (
                  <div
                    key={notif.code_notif}
                    className={`px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer ${
                      getBgColor(notif.type_notif, notif.lu)
                    } ${notif.priorite === 'haute' ? 'border-l-4 border-red-500' : ''}`}
                    onClick={() => !notif.lu && markAsRead(notif.code_notif)}
                  >
                    <div className="flex items-start gap-3">
                      {/* Icône */}
                      <div className="flex-shrink-0 mt-0.5">
                        {getIcon(notif.type_notif)}
                      </div>

                      {/* Contenu */}
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm ${notif.lu ? 'text-gray-600' : 'text-gray-900 font-medium'}`}>
                          {notif.message_notif}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {formatDate(notif.date_notif)}
                        </p>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {!notif.lu && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              markAsRead(notif.code_notif);
                            }}
                            className="p-1 text-blue-600 hover:bg-blue-100 rounded transition-colors"
                            title="Marquer comme lu"
                          >
                            <FiCheck className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteNotification(notif.code_notif);
                          }}
                          className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                          title="Supprimer"
                        >
                          <FiX className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="px-4 py-3 border-t border-gray-200 bg-gray-50 rounded-b-lg">
              <button
                onClick={() => {
                  setIsOpen(false);
                  // TODO: Rediriger vers la page de toutes les notifications
                }}
                className="w-full text-center text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Voir toutes les notifications
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
