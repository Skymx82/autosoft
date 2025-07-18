'use client';

import React, { useState, useEffect } from 'react';
import { SelectionCell } from './Selecteur';
import ModalSelect from '../../ModalAjout';

interface SelectionControlsProps {
  onConfirm: () => void;
  onCancel: () => void;
  position: {
    top: number;
    left: number;
  };
  selectionStart?: SelectionCell | null;
  selectionEnd?: SelectionCell | null;
  moniteurId?: number;
  moniteurNom?: string;
  moniteurPrenom?: string;
  date?: string;
}

export default function SelectionControls({ 
  onConfirm, 
  onCancel, 
  position,
  selectionStart,
  selectionEnd,
  moniteurId,
  moniteurNom,
  moniteurPrenom,
  date
}: SelectionControlsProps) {
  const [showModal, setShowModal] = useState(false);
  const [heureDebut, setHeureDebut] = useState('');
  const [heureFin, setHeureFin] = useState('');
  const [selectedEleve, setSelectedEleve] = useState<number | null>(null);
  const [typeLecon, setTypeLecon] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Fonction pour formater l'heure au format HH:MM
  const formatTimeToHHMM = (timeStr: string): string => {
    // Si le format est déjà HH:MM, vérifier qu'il est bien formaté
    if (timeStr.length === 5 && timeStr.includes(':')) {
      const [hours, minutes] = timeStr.split(':');
      return `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}`;
    }
    
    // Si le format est H:MM, ajouter un zéro devant l'heure
    if (timeStr.length === 4 && timeStr.includes(':')) {
      const [hours, minutes] = timeStr.split(':');
      return `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}`;
    }
    
    // Si le format est autre, essayer de le parser
    try {
      const [hours, minutes] = timeStr.split(':').map(part => part.trim());
      return `${hours.padStart(2, '0')}:${(minutes || '00').padStart(2, '0')}`;
    } catch (e) {
      console.error('Format d\'heure invalide:', timeStr);
      return timeStr; // Retourner l'heure telle quelle en cas d'erreur
    }
  };
  
  // Initialiser les heures de début et de fin à partir des données de sélection
  useEffect(() => {
    if (selectionStart) {
      // Définir l'heure de début (formater pour s'assurer qu'elle est au format HH:MM)
      const formattedStartTime = formatTimeToHHMM(selectionStart.time);
      setHeureDebut(formattedStartTime);
      
      // Définir l'heure de fin
      if (selectionStart.endTime) {
        // Si on a une heure de fin explicite, on l'utilise mais on ajoute 15 minutes pour avoir une durée minimale
        const formattedEndTime = formatTimeToHHMM(selectionStart.endTime);
        const [endHourStr, endMinuteStr] = formattedEndTime.split(':');
        const endHour = parseInt(endHourStr);
        const endMinute = parseInt(endMinuteStr || '0');
        
        const endTimeDate = new Date();
        endTimeDate.setHours(endHour, endMinute + 15); // Ajouter 15 minutes à l'heure de fin
        const finalEndTime = `${endTimeDate.getHours().toString().padStart(2, '0')}:${endTimeDate.getMinutes().toString().padStart(2, '0')}`;
        setHeureFin(finalEndTime);
      } else {
        // Sinon, on ajoute 15 minutes à l'heure de début
        const [startHourStr, startMinuteStr] = formattedStartTime.split(':');
        const startHour = parseInt(startHourStr);
        const startMinute = parseInt(startMinuteStr || '0');
        
        const startTimeDate = new Date();
        startTimeDate.setHours(startHour, startMinute + 15);
        const finalEndTime = `${startTimeDate.getHours().toString().padStart(2, '0')}:${startTimeDate.getMinutes().toString().padStart(2, '0')}`;
        setHeureFin(finalEndTime);
      }
    }
  }, [selectionStart]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedEleve || !heureDebut || !heureFin || !typeLecon || !moniteurId) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Ici, vous feriez un appel API pour enregistrer l'horaire
      console.log('Enregistrement de l\'horaire:', {
        date,
        heureDebut,
        heureFin,
        id_moniteur: moniteurId,
        id_eleve: selectedEleve,
        typeLecon
      });
      
      // Simuler un délai d'appel API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Fermer le modal après l'enregistrement
      setShowModal(false);
      onConfirm(); // Appeler la fonction de confirmation pour nettoyer la sélection
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement de l\'horaire:', error);
      alert('Une erreur est survenue lors de l\'enregistrement de l\'horaire');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleConfirmClick = (e: React.MouseEvent) => {
    // Empêcher la propagation de l'événement pour éviter que le clic ne soit capturé par d'autres gestionnaires
    e.stopPropagation();
    
    // Afficher les données transmises à la modale
    console.log('ConfirmeSelect - Données transmises à la modale:');
    console.log('selectionStart:', selectionStart);
    console.log('selectionEnd:', selectionEnd);
    console.log('moniteurId:', moniteurId);
    console.log('moniteurNom:', moniteurNom);
    console.log('moniteurPrenom:', moniteurPrenom);
    console.log('date:', date);
    console.log('heureDebut:', heureDebut);
    console.log('heureFin:', heureFin);
    
    // Ouvrir le modal
    setShowModal(true);
  };
  
  return (
    <>
      <div 
        className="absolute flex items-center gap-2 bg-white rounded-md shadow-md p-1 z-50 border border-gray-200"
        style={{ 
          top: `${position.top - 40}px`, 
          left: `${position.left}px`,
        }}
      >
        <button 
          onClick={onCancel}
          className="p-1 rounded-full hover:bg-gray-100 text-red-500 transition-colors"
          title="Annuler la sélection"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
        <button 
          onClick={handleConfirmClick}
          className="p-1 rounded-full hover:bg-gray-100 text-green-500 transition-colors"
          title="Confirmer la sélection"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
      
      {/* Utilisation du composant ModalSelect */}
      <ModalSelect
        showModal={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={async (formData) => {
          setIsLoading(true);
          try {
            // Récupérer l'utilisateur actuel depuis le localStorage
            const userData = localStorage.getItem('autosoft_user');
            if (!userData) {
              throw new Error('Utilisateur non trouvé dans le localStorage');
            }
            
            // Parser les données utilisateur
            const user = JSON.parse(userData);
            const id_ecole = user.id_ecole;
            const id_bureau = user.id_bureau;
            
            // Préparer les données pour l'API
            const planningData = {
              date: formData.date,
              heure_debut: formData.startTime,
              heure_fin: formData.endTime,
              type_lecon: formData.lessonType || formData.type,
              id_moniteur: formData.instructorId,
              id_eleve: formData.studentId,
              id_vehicule: formData.vehicleId,
              id_bureau,
              id_ecole,
              commentaire: formData.comments
            };
            
            console.log('Envoi des données à l\'API:', planningData);
            
            // Appel à l'API pour enregistrer l'horaire
            const response = await fetch('/directeur/planning/api/enregistrer', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(planningData),
            });
            
            if (!response.ok) {
              const errorData = await response.json();
              throw new Error(errorData.error || 'Erreur lors de l\'enregistrement');
            }
            
            const result = await response.json();
            console.log('Résultat de l\'enregistrement:', result);
            
            // Appeler onConfirm pour notifier le parent
            onConfirm();
            
            // Vérifier si c'est un enregistrement multiple et si c'est le dernier créneau
            const isMultipleSubmit = formData.isMultipleSubmit;
            const isLastRecurringSlot = formData.isLastRecurringSlot;
            
            // Ne recharger la page que s'il ne s'agit pas d'un enregistrement multiple
            // ou s'il s'agit du dernier créneau d'un enregistrement multiple
            if (!isMultipleSubmit || (isMultipleSubmit && isLastRecurringSlot)) {
              console.log('Rechargement de la page après enregistrement');
              window.location.reload();
            } else {
              console.log('Enregistrement intermédiaire, pas de rechargement');
            }
          } catch (error) {
            console.error('Erreur lors de l\'enregistrement:', error);
            alert(`Erreur: ${error instanceof Error ? error.message : 'Une erreur est survenue'}`);
          } finally {
            setIsLoading(false);
          }
        }}
        selectionStart={selectionStart}
        selectionEnd={selectionEnd}
        moniteurId={moniteurId}
        moniteurNom={moniteurNom}
        moniteurPrenom={moniteurPrenom}
        date={date}
        heureDebut={heureDebut}
        heureFin={heureFin}
      />
    </>
  );
}
