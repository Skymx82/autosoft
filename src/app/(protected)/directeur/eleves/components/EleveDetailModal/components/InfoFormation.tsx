'use client';

import React, { useState, useEffect } from 'react';
import { FiBookOpen, FiAward, FiBarChart, FiEdit, FiCheck, FiX } from 'react-icons/fi';
import { Eleve } from '../api/eleveApi';

interface InfoFormationProps {
  eleve: Eleve | null;
  loading: boolean;
  onSave?: (updatedEleve: Eleve) => Promise<void>;
}

export default function InfoFormation({ eleve, loading, onSave }: InfoFormationProps) {
  // États pour la gestion de l'édition
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  // État pour l'édition des champs de formation de l'élève
  const [formData, setFormData] = useState({
    categorie: eleve?.categorie || '',
    progression: eleve?.progression || 0
  });
  
  // État pour les erreurs de validation
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  
  // Fonction pour basculer en mode édition
  const handleEdit = () => {
    setIsEditing(true);
    // Réinitialiser les données du formulaire avec les valeurs actuelles
    if (eleve) {
      setFormData({
        categorie: eleve.categorie || '',
        progression: eleve.progression || 0
      });
    }
  };
  
  // Fonction pour annuler l'édition
  const handleCancel = () => {
    setIsEditing(false);
    setError(null);
    setValidationErrors({});
  };
  
  // Fonction de validation des informations de formation
  const validateInfoFormation = (info: any) => {
    const errors: Record<string, string> = {};
    
    // Validation de la progression
    if (info.progression !== undefined && info.progression !== null) {
      if (isNaN(Number(info.progression)) || Number(info.progression) < 0 || Number(info.progression) > 100) {
        errors.progression = 'La progression doit être un nombre entre 0 et 100';
      }
    }
    
    return errors;
  };
  
  // Fonction pour sauvegarder les modifications
  const handleSave = async () => {
    if (!eleve || !onSave) return;
    
    try {
      // Valider les données avant de sauvegarder
      const infoFormation = {
        categorie: formData.categorie,
        progression: formData.progression
      };
      
      const errors = validateInfoFormation(infoFormation);
      
      // S'il y a des erreurs de validation, les afficher et ne pas continuer
      if (Object.keys(errors).length > 0) {
        setValidationErrors(errors);
        return;
      }
      
      // Réinitialiser les erreurs de validation
      setValidationErrors({});
      setIsLoading(true);
      setError(null);
      
      // Créer un objet avec les données mises à jour
      const updatedEleve = {
        ...eleve,
        ...infoFormation
      };
      
      // Appeler la fonction de sauvegarde
      await onSave(updatedEleve);
      
      // Quitter le mode édition
      setIsEditing(false);
    } catch (err) {
      console.error("Erreur lors de la sauvegarde des informations:", err);
      setError("Impossible de sauvegarder les modifications. Veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
  };
  
  // Mettre à jour le formulaire si l'élève change
  useEffect(() => {
    if (eleve) {
      setFormData({
        categorie: eleve.categorie || '',
        progression: eleve.progression || 0
      });
    }
  }, [eleve]);
  
  // Si les données sont en cours de chargement, afficher un indicateur de chargement
  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm flex-1 min-w-[300px] p-4">
        <div className="flex justify-center items-center h-24">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }
  
  // Si aucun élève n'est trouvé, afficher un message
  if (!eleve) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm flex-1 min-w-[300px] p-4">
        <p className="text-gray-500">Aucune information disponible</p>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm flex-1 min-w-[300px]">
      {/* En-tête de la section */}
      <div className="flex justify-between items-center p-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center space-x-2">
          <FiBookOpen className="text-blue-500" />
          <h3 className="font-medium">Formation</h3>
        </div>
        
        {/* Boutons d'action (édition, sauvegarde, annulation) */}
        <div className="flex space-x-2">
          {!isEditing ? (
            <button
              onClick={handleEdit}
              disabled={loading}
              className="p-1 text-gray-500 hover:text-blue-500 transition-colors"
              title="Modifier"
            >
              <FiEdit className="h-4 w-4" />
            </button>
          ) : (
            <>
              <button
                onClick={handleSave}
                disabled={isLoading}
                className="p-1 text-gray-500 hover:text-green-500 transition-colors"
                title="Enregistrer"
              >
                {isLoading ? (
                  <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent"></span>
                ) : (
                  <FiCheck className="h-4 w-4" />
                )}
              </button>
              <button
                onClick={handleCancel}
                disabled={isLoading}
                className="p-1 text-gray-500 hover:text-red-500 transition-colors"
                title="Annuler"
              >
                <FiX className="h-4 w-4" />
              </button>
            </>
          )}
        </div>
      </div>
      
      {/* Contenu de la section */}
      <div className="p-4">
        {error && (
          <div className="mb-4 p-2 bg-red-50 text-red-700 text-sm rounded-md">
            {error}
          </div>
        )}
        
        {!isEditing ? (
          <div className="space-y-4">
            {/* Catégorie de permis */}
            <div className="flex items-start">
              <FiAward className="text-gray-400 mt-1 mr-3" />
              <div>
                <p className="text-xs text-gray-500">Catégorie de permis</p>
                <div className="mt-1">
                  {eleve.categorie ? (
                    <span className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {eleve.categorie === 'A' && 'A - Moto'}
                      {eleve.categorie === 'A1' && 'A1 - Moto légère'}
                      {eleve.categorie === 'A2' && 'A2 - Moto intermédiaire'}
                      {eleve.categorie === 'B' && 'B - Voiture'}
                      {eleve.categorie === 'BE' && 'BE - Voiture + remorque'}
                      {eleve.categorie === 'C' && 'C - Poids lourd'}
                      {eleve.categorie === 'D' && 'D - Transport en commun'}
                      {!['A', 'A1', 'A2', 'B', 'BE', 'C', 'D'].includes(eleve.categorie) && eleve.categorie}
                    </span>
                  ) : (
                    <span className="text-gray-400">Non spécifiée</span>
                  )}
                </div>
              </div>
            </div>
            
            {/* Progression */}
            <div className="flex items-start">
              <FiBarChart className="text-gray-400 mt-1 mr-3" />
              <div className="flex-1">
                <p className="text-xs text-gray-500">Progression</p>
                <div className="mt-2">
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-blue-600 h-2.5 rounded-full" 
                      style={{ width: `${eleve.progression || 0}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-right mt-1 text-gray-600">{eleve.progression || 0}%</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Catégorie de permis */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Catégorie de permis</label>
              <select
                value={formData.categorie}
                onChange={(e) => {
                  setFormData({...formData, categorie: e.target.value});
                  if (validationErrors.categorie) {
                    setValidationErrors({...validationErrors, categorie: ''});
                  }
                }}
                className={`w-full p-2 text-sm border rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 ${validationErrors.categorie ? 'border-red-500' : 'border-gray-300'}`}
              >
                <option value="">Sélectionner une catégorie</option>
                <option value="A">A - Moto</option>
                <option value="A1">A1 - Moto légère</option>
                <option value="A2">A2 - Moto intermédiaire</option>
                <option value="B">B - Voiture</option>
                <option value="BE">BE - Voiture + remorque</option>
                <option value="C">C - Poids lourd</option>
                <option value="D">D - Transport en commun</option>
              </select>
              {validationErrors.categorie && (
                <p className="text-red-500 text-xs mt-1">{validationErrors.categorie}</p>
              )}
            </div>
            
            {/* Progression */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Progression (%)</label>
              <div className="flex items-center">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={formData.progression}
                  onChange={(e) => {
                    setFormData({...formData, progression: parseInt(e.target.value)});
                    if (validationErrors.progression) {
                      setValidationErrors({...validationErrors, progression: ''});
                    }
                  }}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <span className="ml-2 text-sm font-medium text-gray-700">{formData.progression}%</span>
              </div>
              <input
                type="number"
                min="0"
                max="100"
                value={formData.progression}
                onChange={(e) => {
                  const value = parseInt(e.target.value);
                  setFormData({...formData, progression: isNaN(value) ? 0 : Math.min(100, Math.max(0, value))});
                  if (validationErrors.progression) {
                    setValidationErrors({...validationErrors, progression: ''});
                  }
                }}
                className={`mt-2 w-24 p-2 text-sm border rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 ${validationErrors.progression ? 'border-red-500' : 'border-gray-300'}`}
              />
              {validationErrors.progression && (
                <p className="text-red-500 text-xs mt-1">{validationErrors.progression}</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
