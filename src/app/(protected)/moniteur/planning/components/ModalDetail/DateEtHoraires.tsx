'use client';

import React, { useState } from 'react';
import { FiCalendar } from 'react-icons/fi';
import { PlanningDetails } from './types';

interface DateEtHorairesProps {
  planningDetails: PlanningDetails;
  onSave: (updatedDetails: PlanningDetails) => Promise<void>;
  formatDate: (dateStr: string) => string;
  formatTime: (timeStr: string) => string;
}

export default function DateEtHoraires({
  planningDetails,
  onSave,
  formatDate,
  formatTime
}: DateEtHorairesProps) {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  // État pour l'édition des champs date et horaires
  const [formData, setFormData] = useState({
    date: planningDetails.date || '',
    heure_debut: planningDetails.heure_debut || '',
    heure_fin: planningDetails.heure_fin || '',
    type_lecon: planningDetails.type_lecon || ''
  });

  // Fonction pour gérer la sauvegarde des modifications
  const handleSave = async () => {
    if (!planningDetails) return;
    
    try {
      setIsLoading(true);
      setError(null);
      
      // Créer un objet avec les données mises à jour
      const updatedDetails = {
        ...planningDetails,
        date: formData.date,
        heure_debut: formData.heure_debut,
        heure_fin: formData.heure_fin,
        type_lecon: formData.type_lecon
      };
      
      // Appeler la fonction de sauvegarde passée en props
      await onSave(updatedDetails);
      setIsEditing(false);
    } catch (err) {
      console.error("Erreur lors de la sauvegarde:", err);
      setError("Une erreur est survenue lors de la sauvegarde. Veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 min-w-[200px] p-3 bg-blue-50 rounded-md border border-blue-100">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          <FiCalendar className="text-blue-500 mr-2" />
          <h4 className="font-medium">Date et horaires</h4>
        </div>
        {!isEditing ? (
          <button 
            onClick={() => setIsEditing(true)}
            className="text-xs px-2 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded transition-colors"
          >
            Modifier
          </button>
        ) : (
          <div className="flex space-x-1">
            <button 
              onClick={() => setIsEditing(false)}
              className="text-xs px-2 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded transition-colors"
              disabled={isLoading}
            >
              Annuler
            </button>
            <button 
              onClick={handleSave}
              className="text-xs px-2 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded transition-colors"
              disabled={isLoading}
            >
              {isLoading ? 'Enregistrement...' : 'Enregistrer'}
            </button>
          </div>
        )}
      </div>
      
      {error && (
        <div className="mb-2 text-xs text-red-600 bg-red-50 p-1 rounded border border-red-100">
          {error}
        </div>
      )}
      
      {!isEditing ? (
        <div className="space-y-1">
          <div className="text-sm">
            <span className="text-gray-500">Date: </span>
            <span className="font-medium">{formatDate(planningDetails.date)}</span>
          </div>
          <div className="text-sm">
            <span className="text-gray-500">Début: </span>
            <span className="font-medium">{formatTime(planningDetails.heure_debut)}</span>
          </div>
          <div className="text-sm">
            <span className="text-gray-500">Fin: </span>
            <span className="font-medium">{formatTime(planningDetails.heure_fin)}</span>
          </div>
          <div className="text-sm">
            <span className="text-gray-500">Type: </span>
            <span className="font-medium">{planningDetails.type_lecon || 'Non spécifié'}</span>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Date</label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({...formData, date: e.target.value})}
              className="w-full p-1 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Début</label>
              <input
                type="time"
                value={formData.heure_debut}
                onChange={(e) => setFormData({...formData, heure_debut: e.target.value})}
                className="w-full p-1 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Fin</label>
              <input
                type="time"
                value={formData.heure_fin}
                onChange={(e) => setFormData({...formData, heure_fin: e.target.value})}
                className="w-full p-1 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Type</label>
            <select
              value={formData.type_lecon}
              onChange={(e) => setFormData({...formData, type_lecon: e.target.value})}
              className="w-full p-1 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Non spécifié</option>
              <option value="Conduite">Conduite</option>
              <option value="Code">Code</option>
              <option value="Examen blanc">Examen blanc</option>
              <option value="Examen">Examen</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
}
