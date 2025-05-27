'use client';

import React, { useState, useEffect } from 'react';
import { SelectionCell } from '../Selecteur';
import TabSelector from './TabSelector';
import TimeRangeSelector from './TimeRangeSelector';
import StudentSelector from './StudentSelector';
import VehicleSelector from './VehicleSelector';
import RecurrenceOptions from './RecurrenceOptions';
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
  // Afficher les données reçues par la modale
  console.log('ModalSelect - Données reçues:');
  console.log('selectionStart:', selectionStart);
  console.log('selectionEnd:', selectionEnd);
  console.log('moniteurId:', moniteurId);
  console.log('moniteurNom:', moniteurNom);
  console.log('moniteurPrenom:', moniteurPrenom);
  console.log('date:', date);
  console.log('heureDebut:', heureDebut);
  console.log('heureFin:', heureFin);
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
      await onSubmit(formState);
      onClose();
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement:', error);
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
          <div className="mb-4">
            <div className="flex items-center space-x-2">
              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium">
                {moniteurPrenom?.charAt(0)}{moniteurNom?.charAt(0)}
              </div>
              <div>
                <p className="font-medium">
                  {moniteurPrenom && moniteurNom ? `${moniteurPrenom} ${moniteurNom}` : 'Moniteur non spécifié'}
                </p>
                <p className="text-sm text-gray-500">
                  {formState.date ? new Date(formState.date).toLocaleDateString('fr-FR', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  }) : 'Date non spécifiée'}
                </p>
              </div>
            </div>
          </div>
          
          {/* Sélection des horaires */}
          <TimeRangeSelector
            startTime={formState.startTime}
            endTime={formState.endTime}
            onStartTimeChange={handleStartTimeChange}
            onEndTimeChange={handleEndTimeChange}
            date={formState.date}
          />
          
          {/* Contenu spécifique au type d'événement */}
          {formState.type === 'lesson' && (
            <>
              <StudentSelector
                selectedStudentId={formState.studentId}
                onStudentChange={handleStudentChange}
                licenseCategory={formState.licenseCategory}
                onLicenseCategoryChange={handleLicenseCategoryChange}
              />
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type de leçon
                </label>
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
              
              <VehicleSelector
                selectedVehicleId={formState.vehicleId}
                onVehicleChange={handleVehicleChange}
                licenseCategory={formState.licenseCategory}
                instructorId={formState.instructorId}
              />
              
              <RecurrenceOptions
                isRecurring={formState.isRecurring}
                onIsRecurringChange={handleIsRecurringChange}
                recurrencePattern={formState.recurrencePattern}
                onRecurrencePatternChange={handleRecurrencePatternChange}
                startDate={formState.date}
              />
            </>
          )}
          
          {formState.type === 'unavailability' && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Motif de l'indisponibilité
              </label>
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
              
              <RecurrenceOptions
                isRecurring={formState.isRecurring}
                onIsRecurringChange={handleIsRecurringChange}
                recurrencePattern={formState.recurrencePattern}
                onRecurrencePatternChange={handleRecurrencePatternChange}
                startDate={formState.date}
              />
            </div>
          )}
          
          {formState.type === 'exam' && (
            <>
              <StudentSelector
                selectedStudentId={formState.studentId}
                onStudentChange={handleStudentChange}
                licenseCategory={formState.licenseCategory}
                onLicenseCategoryChange={handleLicenseCategoryChange}
              />
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type d'examen
                </label>
                <select
                  value={formState.lessonType}
                  onChange={handleLessonTypeChange}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Sélectionner un type</option>
                  <option value="Code">Examen code</option>
                  <option value="Conduite">Examen conduite</option>
                  <option value="Plateau">Examen plateau</option>
                </select>
              </div>
              
              <VehicleSelector
                selectedVehicleId={formState.vehicleId}
                onVehicleChange={handleVehicleChange}
                licenseCategory={formState.licenseCategory}
                instructorId={formState.instructorId}
              />
            </>
          )}
          
          {/* Commentaires (pour tous les types) */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Commentaires
            </label>
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
