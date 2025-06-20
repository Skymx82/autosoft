'use client';

import React, { useState, useEffect } from 'react';
import { SelectionCell } from '../semaine/selection/Selecteur';
import TabSelector from './TabSelector';
import TimeRangeSelector from './TimeRangeSelector';
import StudentSelector from './StudentSelector';
import VehicleSelector from './VehicleSelector';
import RecurrenceOptions from './RecurrenceOptions';
import { generateRecurringSlots } from './generateRecurringSlots';
import { 
  ModalSelectProps, 
  FormState, 
  EventType, 
  LicenseCategory,
  RecurrencePattern
} from './types';

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
      if (!formState.date || !formState.startTime || !formState.endTime) {
        throw new Error('Les informations de date et d\'heure sont obligatoires');
      }
      
      // Générer tous les créneaux horaires en fonction des options de récurrence
      const slots = generateRecurringSlots(formState);
      console.log('Créneaux horaires générés:', slots);
      
      if (slots.length === 0) {
        throw new Error('Aucun créneau horaire n\'a pu être généré');
      }
      
      // Si un seul créneau, utiliser la méthode classique
      if (slots.length === 1) {
        await onSubmit(formState);
      } else {
        // Pour chaque créneau, créer un nouvel état de formulaire et le soumettre
        let successCount = 0;
        const totalSlots = slots.length;
        
        // Indiquer à ConfirmeSelect qu'il s'agit d'un enregistrement multiple
        // pour éviter le rechargement de la page après chaque enregistrement
        const isMultipleSubmit = true;
        
        for (let i = 0; i < slots.length; i++) {
          const slot = slots[i];
          const isLastSlot = i === slots.length - 1;
          
          try {
            const slotFormState = {
              ...formState,
              date: slot.date,
              startTime: slot.startTime,
              endTime: slot.endTime,
              // Désactiver la récurrence pour éviter une boucle infinie
              isRecurring: false,
              recurrencePattern: undefined,
              // Indiquer s'il s'agit du dernier créneau à enregistrer
              isLastRecurringSlot: isLastSlot,
              // Indiquer qu'il s'agit d'un enregistrement multiple
              isMultipleSubmit: isMultipleSubmit
            };
            
            console.log(`Enregistrement du créneau ${i+1}/${slots.length}:`, slotFormState);
            await onSubmit(slotFormState);
            successCount++;
          } catch (slotError) {
            console.error(`Erreur lors de l'enregistrement du créneau ${i+1}/${slots.length} (${slot.date}):`, slotError);
            // Continuer avec les autres créneaux malgré l'erreur
          }
        }
        
        if (successCount === 0) {
          throw new Error('Aucun créneau n\'a pu être enregistré');
        } else if (successCount < totalSlots) {
          console.warn(`Seulement ${successCount}/${totalSlots} créneaux ont été enregistrés avec succès`);
        }
      }
      
      onClose();
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement:', error);
      alert(`Erreur: ${error instanceof Error ? error.message : 'Une erreur est survenue lors de l\'enregistrement'}`); 
    } finally {
      setIsLoading(false);
    }
  };
  
  // Si la modale n'est pas visible, ne rien afficher
  if (!showModal) return null;
  
  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center z-50 p-4">
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
