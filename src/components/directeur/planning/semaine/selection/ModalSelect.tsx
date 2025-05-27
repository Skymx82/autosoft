'use client';

import React, { useState, useEffect } from 'react';
import { SelectionCell } from './Selecteur';

interface ModalSelectProps {
  showModal: boolean;
  onClose: () => void;
  onSubmit: (formData: any) => Promise<void>;
  selectionStart?: SelectionCell | null;
  selectionEnd?: SelectionCell | null;
  moniteurId?: number;
  moniteurNom?: string;
  moniteurPrenom?: string;
  date?: string;
  heureDebut: string;
  heureFin: string;
}

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
  const [heureDebutState, setHeureDebutState] = useState(heureDebut);
  const [heureFinState, setHeureFinState] = useState(heureFin);
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
  
  // Mettre à jour les états locaux lorsque les props changent
  useEffect(() => {
    setHeureDebutState(heureDebut);
    setHeureFinState(heureFin);
  }, [heureDebut, heureFin]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Collecter les données du formulaire
      const formData = {
        date: date || selectionStart?.day,
        moniteurId,
        heureDebut: heureDebutState,
        heureFin: heureFinState,
        eleveId: selectedEleve,
        typeLecon
      };
      
      // Appeler la fonction onSubmit fournie par le parent
      await onSubmit(formData);
      
      // Réinitialiser le formulaire et fermer la modale
      setSelectedEleve(null);
      setTypeLecon('');
      onClose();
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  if (!showModal) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
        <h2 className="text-xl font-semibold mb-4">Ajouter une leçon</h2>
        
        <form onSubmit={handleSubmit}>
          {/* Informations sur la sélection */}
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
                value={heureDebutState}
                onChange={(e) => setHeureDebutState(e.target.value)}
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
                value={heureFinState}
                onChange={(e) => setHeureFinState(e.target.value)}
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
              onClick={onClose}
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
  );
}
