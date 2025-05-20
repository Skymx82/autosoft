'use client';

import React, { useState, useEffect } from 'react';
import { SelectionCell } from './SelectionManager';

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
  const [eleves, setEleves] = useState<any[]>([]);
  const [selectedEleve, setSelectedEleve] = useState<number | null>(null);
  const [typeLecon, setTypeLecon] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Charger la liste des élèves (simulé pour l'instant)
  useEffect(() => {
    setEleves([
      { id_eleve: 1, nom: 'Dupont', prenom: 'Jean' },
      { id_eleve: 2, nom: 'Martin', prenom: 'Sophie' },
      { id_eleve: 3, nom: 'Durand', prenom: 'Pierre' },
    ]);
  }, []);
  
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
      
      {/* Modal pour ajouter un horaire */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Ajouter un horaire</h2>
            
            <form onSubmit={handleSubmit}>
              {/* Informations sur la date et le moniteur */}
              <div className="mb-4">
                <p className="text-gray-700">
                  <span className="font-medium">Date:</span> {date || selectionStart?.day || 'Non spécifiée'}
                </p>
                <p className="text-gray-700">
                  <span className="font-medium">Moniteur:</span> {moniteurPrenom && moniteurNom ? `${moniteurPrenom} ${moniteurNom}` : 'Non spécifié'}
                </p>
              </div>
              
              {/* Heures de début et de fin */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Heure de début
                  </label>
                  <input
                    type="time"
                    value={heureDebut}
                    onChange={(e) => setHeureDebut(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Heure de fin
                  </label>
                  <input
                    type="time"
                    value={heureFin}
                    onChange={(e) => setHeureFin(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded"
                    required
                  />
                </div>
              </div>
              
              {/* Sélection de l'élève */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Élève
                </label>
                <select
                  value={selectedEleve || ''}
                  onChange={(e) => setSelectedEleve(parseInt(e.target.value))}
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                >
                  <option value="">Sélectionner un élève</option>
                  {eleves.map((eleve) => (
                    <option key={eleve.id_eleve} value={eleve.id_eleve}>
                      {eleve.prenom} {eleve.nom}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* Type de leçon */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type de leçon
                </label>
                <select
                  value={typeLecon}
                  onChange={(e) => setTypeLecon(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                >
                  <option value="">Sélectionner un type</option>
                  <option value="Conduite">Conduite</option>
                  <option value="Code">Code</option>
                  <option value="Examen blanc">Examen blanc</option>
                  <option value="Examen">Examen</option>
                </select>
              </div>
              
              {/* Boutons d'action */}
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                  }}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded hover:bg-gray-100"
                  disabled={isLoading}
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  disabled={isLoading}
                >
                  {isLoading ? 'Enregistrement...' : 'Enregistrer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
