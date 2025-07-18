'use client';

import React, { useState, useEffect } from 'react';
import { SelectionCell } from '../semaine/selection/Selecteur';
import TabSelector from './TabSelector';
import TimeRangeSelector from './TimeRangeSelector';
import StudentSelector from './StudentSelector';
import VehicleSelector from './VehicleSelector';
import RecurrenceOptions from './RecurrenceOptions';
import { generateRecurringSlots } from './generateRecurringSlots';
import { v4 as uuidv4 } from 'uuid';
import '@/styles/anim_Notif.css';
import { 
  ModalSelectProps, 
  FormState, 
  EventType, 
  LicenseCategory,
  RecurrencePattern
} from './types';

// Type pour les notifications
interface Notification {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  duration?: number;
}

// Composant de notification
const NotificationItem: React.FC<{ notification: Notification, onClose: (id: string) => void }> = ({ notification, onClose }) => {
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

export default function ModalSelect({
  showModal,
  onClose,
  onSubmit,
  selectionStart,
  selectionEnd,
  moniteurId,
  moniteurNom,
  moniteurPrenom,
  date,
  heureDebut,
  heureFin
}: ModalSelectProps) {
  // État pour gérer les notifications
  const [notifications, setNotifications] = useState<Notification[]>([]);
  // État du formulaire
  const [formState, setFormState] = useState<FormState>({
    type: 'lesson',
    date: date || '', // Utiliser uniquement la date transmise par ConfirmeSelect
    startTime: heureDebut,
    endTime: heureFin,
    studentId: null,
    instructorId: moniteurId || 0,
    lessonType: '',
    licenseCategory: '',
    vehicleId: null,
    isRecurring: false,
    comments: ''
  });
  
  // État de chargement
  const [isLoading, setIsLoading] = useState(false);
  
  // Fonction pour ajouter une notification
  const addNotification = (type: 'success' | 'error' | 'info' | 'warning', message: string, duration = 5000) => {
    const newNotification: Notification = {
      id: uuidv4(),
      type,
      message,
      duration
    };
    setNotifications(prev => [...prev, newNotification]);
  };
  
  // Fonction pour supprimer une notification
  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };
  
  // Mettre à jour l'état du formulaire lorsque les props changent
  useEffect(() => {
    console.log('ModalSelect - useEffect - Mise à jour du formulaire:');
    console.log('date reçue:', date);
    
    setFormState(prev => {
      const updatedState = {
        ...prev,
        date: date || '', // Utiliser uniquement la date transmise par ConfirmeSelect
        startTime: heureDebut,
        endTime: heureFin,
        instructorId: moniteurId || 0
      };
      
      console.log('Nouvel état du formulaire:', updatedState);
      return updatedState;
    });
  }, [date, heureDebut, heureFin, moniteurId]);
  
  // Gérer le changement d'onglet
  const handleTabChange = (tab: EventType) => {
    setFormState(prev => ({
      ...prev,
      type: tab
    }));
  };
  
  // Gérer le changement d'heure de début
  const handleStartTimeChange = (time: string) => {
    setFormState(prev => ({
      ...prev,
      startTime: time
    }));
  };
  
  // Gérer le changement d'heure de fin
  const handleEndTimeChange = (time: string) => {
    setFormState(prev => ({
      ...prev,
      endTime: time
    }));
  };
  
  // Gérer le changement d'élève
  const handleStudentChange = (studentId: number) => {
    setFormState(prev => ({
      ...prev,
      studentId
    }));
  };
  
  // Gérer le changement de catégorie de permis
  const handleLicenseCategoryChange = (category: LicenseCategory) => {
    setFormState(prev => ({
      ...prev,
      licenseCategory: category,
      // Réinitialiser le véhicule si la catégorie change
      vehicleId: null
    }));
  };
  
  // Gérer le changement de véhicule
  const handleVehicleChange = (vehicleId: number) => {
    setFormState(prev => ({
      ...prev,
      vehicleId
    }));
  };
  
  // Gérer le changement de type de leçon
  const handleLessonTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormState(prev => ({
      ...prev,
      lessonType: e.target.value
    }));
  };
  
  // Gérer le changement de l'option de récurrence
  const handleIsRecurringChange = (isRecurring: boolean) => {
    setFormState(prev => ({
      ...prev,
      isRecurring
    }));
  };
  
  // Gérer le changement du pattern de récurrence
  const handleRecurrencePatternChange = (pattern: RecurrencePattern) => {
    setFormState(prev => ({
      ...prev,
      recurrencePattern: pattern
    }));
  };
  
  // Gérer le changement des commentaires
  const handleCommentsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormState(prev => ({
      ...prev,
      comments: e.target.value
    }));
  };
  
  // Gérer la soumission du formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Vérifier que les données du formulaire sont valides
      if (formState.type === 'lesson' && !formState.studentId) {
        addNotification('error', 'Veuillez sélectionner un élève.');
        setIsLoading(false);
        return;
      }
      
      if (formState.type === 'lesson' && !formState.licenseCategory) {
        addNotification('error', 'Veuillez sélectionner une catégorie de permis.');
        setIsLoading(false);
        return;
      }
      
      if (formState.type === 'exam' && !formState.lessonType) {
        addNotification('error', 'Veuillez sélectionner un type d\'examen.');
        setIsLoading(false);
        return;
      }
      
      // Si l'option de récurrence est activée, générer les créneaux récurrents
      if (formState.isRecurring && formState.recurrencePattern) {
        const recurringSlots = generateRecurringSlots(formState);
        
        // Soumettre chaque créneau récurrent
        for (let i = 0; i < recurringSlots.length; i++) {
          const slot = recurringSlots[i];
          const isLastSlot = i === recurringSlots.length - 1;
          
          try {
            // Ajouter des métadonnées pour la gestion des enregistrements multiples
            await onSubmit({
              ...formState,
              date: slot.date,
              startTime: slot.startTime,
              endTime: slot.endTime,
              isMultipleSubmit: true,
              isLastRecurringSlot: isLastSlot
            });
          } catch (slotError) {
            console.error(`Erreur lors de l'enregistrement du créneau récurrent:`, slotError);
          }
        }
        
        // Afficher une notification de succès pour les créneaux récurrents
        addNotification('success', `${recurringSlots.length} créneaux ont été enregistrés avec succès.`);
      } else {
        // Soumettre un créneau unique
        await onSubmit(formState);
        
        // Afficher une notification de succès pour un créneau unique
        addNotification('success', 'Le créneau a été enregistré avec succès.');
      }
      
      // Fermer la modale après la soumission réussie
      onClose();
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement:', error);
      addNotification('error', `Une erreur est survenue lors de l'enregistrement. Veuillez réessayer.`);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Si la modale n'est pas visible, ne rien afficher
  if (!showModal) return null;
  
  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center z-50 p-4">
      {/* Conteneur de notifications - positioné en haut à droite */}
      <div className="fixed top-4 right-4 z-50 w-80">
        {notifications.map((notification) => (
          <NotificationItem 
            key={notification.id} 
            notification={notification} 
            onClose={removeNotification} 
          />
        ))}
      </div>
      
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            {formState.type === 'lesson' && 'Ajouter une leçon'}
            {formState.type === 'unavailability' && 'Ajouter une indisponibilité'}
            {formState.type === 'exam' && 'Ajouter un examen'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <span className="sr-only">Fermer</span>
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <TabSelector 
          activeTab={formState.type} 
          onTabChange={handleTabChange} 
        />
        
        <form onSubmit={handleSubmit}>
          {/* Informations sur le moniteur */}
          <div className="p-3 bg-gray-50 rounded-md border border-gray-200 mb-4">
            <div className="flex items-center mb-2">
              <svg className="w-5 h-5 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg>
              <h4 className="font-medium">Moniteur</h4>
            </div>
            <div className="flex items-center space-x-2">
              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium">
                {moniteurPrenom?.charAt(0)}{moniteurNom?.charAt(0)}
              </div>
              <div>
                <p className="font-medium">
                  {moniteurPrenom && moniteurNom ? `${moniteurPrenom} ${moniteurNom}` : 'Moniteur non spécifié'}
                </p>
              </div>
            </div>
          </div>
          
          {/* Date et horaires */}
          <div className="p-3 bg-gray-50 rounded-md border border-gray-200 mb-4">
            <div className="flex items-center mb-2">
              <svg className="w-5 h-5 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
              <h4 className="font-medium">Date et horaires</h4>
            </div>
            <div className="mb-2">
              <p className="text-sm text-gray-700">
                {formState.date ? new Date(formState.date).toLocaleDateString('fr-FR', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                }) : 'Date non spécifiée'}
              </p>
            </div>
            <TimeRangeSelector
              startTime={formState.startTime}
              endTime={formState.endTime}
              onStartTimeChange={handleStartTimeChange}
              onEndTimeChange={handleEndTimeChange}
              date={formState.date}
            />
          </div>
          
          {/* Contenu spécifique au type d'événement */}
          {formState.type === 'lesson' && (
            <>
              <div className="p-3 bg-gray-50 rounded-md border border-gray-200 mb-4">
                <div className="flex items-center mb-2">
                  <svg className="w-5 h-5 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                  </svg>
                  <h4 className="font-medium">Élève</h4>
                </div>
                <StudentSelector
                  selectedStudentId={formState.studentId}
                  onStudentChange={handleStudentChange}
                  licenseCategory={formState.licenseCategory}
                  onLicenseCategoryChange={handleLicenseCategoryChange}
                />
              </div>
              
              <div className="p-3 bg-gray-50 rounded-md border border-gray-200 mb-4">
                <div className="flex items-center mb-2">
                  <svg className="w-5 h-5 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                  </svg>
                  <h4 className="font-medium">Type de leçon</h4>
                </div>
                <select
                  value={formState.lessonType}
                  onChange={handleLessonTypeChange}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Sélectionner un type</option>
                  <option value="Conduite">Conduite</option>
                  <option value="Code">Code</option>
                  <option value="Examen blanc">Examen blanc</option>
                  <option value="Préparation examen">Préparation examen</option>
                  <option value="Évaluation">Évaluation</option>
                </select>
              </div>
              
              <div className="p-3 bg-gray-50 rounded-md border border-gray-200 mb-4">
                <div className="flex items-center mb-2">
                  <svg className="w-5 h-5 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                  </svg>
                  <h4 className="font-medium">Véhicule</h4>
                </div>
                <VehicleSelector
                  selectedVehicleId={formState.vehicleId}
                  onVehicleChange={handleVehicleChange}
                  licenseCategory={formState.licenseCategory}
                  instructorId={formState.instructorId}
                />
              </div>
              
              <div className="p-3 bg-gray-50 rounded-md border border-gray-200 mb-4">
                <div className="flex items-center mb-2">
                  <svg className="w-5 h-5 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                  </svg>
                  <h4 className="font-medium">Récurrence</h4>
                </div>
                <RecurrenceOptions
                  isRecurring={formState.isRecurring}
                  onIsRecurringChange={handleIsRecurringChange}
                  recurrencePattern={formState.recurrencePattern}
                  onRecurrencePatternChange={handleRecurrencePatternChange}
                  startDate={formState.date}
                />
              </div>
            </>
          )}
          
          {formState.type === 'unavailability' && (
            <>
              <div className="p-3 bg-gray-50 rounded-md border border-gray-200 mb-4">
                <div className="flex items-center mb-2">
                  <svg className="w-5 h-5 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <h4 className="font-medium">Motif de l'indisponibilité</h4>
                </div>
                <select
                  value={formState.lessonType}
                  onChange={handleLessonTypeChange}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Sélectionner un motif</option>
                  <option value="Congé">Congé</option>
                  <option value="Maladie">Maladie</option>
                  <option value="Formation">Formation</option>
                  <option value="Réunion">Réunion</option>
                  <option value="Autre">Autre</option>
                </select>
              </div>
              
              <div className="p-3 bg-gray-50 rounded-md border border-gray-200 mb-4">
                <div className="flex items-center mb-2">
                  <svg className="w-5 h-5 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                  </svg>
                  <h4 className="font-medium">Récurrence</h4>
                </div>
                <RecurrenceOptions
                  isRecurring={formState.isRecurring}
                  onIsRecurringChange={handleIsRecurringChange}
                  recurrencePattern={formState.recurrencePattern}
                  onRecurrencePatternChange={handleRecurrencePatternChange}
                  startDate={formState.date}
                />
              </div>
            </>
          )}
          
          {formState.type === 'exam' && (
            <>
              <div className="p-3 bg-gray-50 rounded-md border border-gray-200 mb-4">
                <div className="flex items-center mb-2">
                  <svg className="w-5 h-5 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                  </svg>
                  <h4 className="font-medium">Élève</h4>
                </div>
                <StudentSelector
                  selectedStudentId={formState.studentId}
                  onStudentChange={handleStudentChange}
                  licenseCategory={formState.licenseCategory}
                  onLicenseCategoryChange={handleLicenseCategoryChange}
                />
              </div>
              
              <div className="p-3 bg-gray-50 rounded-md border border-gray-200 mb-4">
                <div className="flex items-center mb-2">
                  <svg className="w-5 h-5 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <h4 className="font-medium">Type d'examen</h4>
                </div>
                <select
                  value={formState.lessonType}
                  onChange={handleLessonTypeChange}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Sélectionner un type</option>
                  <option value="Examen code">Examen code</option>
                  <option value="Examen conduite">Examen conduite</option>
                  <option value="Examen plateau">Examen plateau</option>
                </select>
              </div>
              
              <div className="p-3 bg-gray-50 rounded-md border border-gray-200 mb-4">
                <div className="flex items-center mb-2">
                  <svg className="w-5 h-5 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                  </svg>
                  <h4 className="font-medium">Véhicule</h4>
                </div>
                <VehicleSelector
                  selectedVehicleId={formState.vehicleId}
                  onVehicleChange={handleVehicleChange}
                  licenseCategory={formState.licenseCategory}
                  instructorId={formState.instructorId}
                />
              </div>
            </>
          )}
          
          {/* Commentaires (pour tous les types) */}
          <div className="p-3 bg-gray-50 rounded-md border border-gray-200 mb-4">
            <div className="flex items-center mb-2">
              <svg className="w-5 h-5 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"></path>
              </svg>
              <h4 className="font-medium">Commentaires</h4>
            </div>
            <textarea
              value={formState.comments}
              onChange={handleCommentsChange}
              rows={3}
              className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
              placeholder="Ajouter des notes ou commentaires..."
            />
          </div>
          
          {/* Boutons d'action */}
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded hover:bg-gray-100"
              disabled={isLoading}
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Enregistrement...
                </>
              ) : 'Enregistrer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
