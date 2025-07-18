'use client';

import React, { useState, useEffect } from 'react';
import { FiUser, FiCalendar, FiInfo, FiEdit, FiCheck, FiX } from 'react-icons/fi';

// Interface pour les données de l'élève nécessaires à ce composant
interface Eleve {
  id_eleve: number;
  nom: string;
  prenom: string;
  naiss?: string;
  categorie?: string;
}

interface InfoPersoProps {
  eleve: Eleve | null;
  loading: boolean;
  onSave?: (updatedEleve: Eleve) => Promise<void>;
}

export default function InfoPerso({ eleve, loading, onSave }: InfoPersoProps) {
  // États pour la gestion de l'édition
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  // État pour l'édition des champs de l'élève
  const [formData, setFormData] = useState({
    nom: eleve?.nom || '',
    prenom: eleve?.prenom || '',
    naiss: eleve?.naiss || ''
  });
  
  // Fonction pour basculer en mode édition
  const handleEdit = () => {
    setIsEditing(true);
    // Réinitialiser les données du formulaire avec les valeurs actuelles
    if (eleve) {
      setFormData({
        nom: eleve.nom || '',
        prenom: eleve.prenom || '',
        naiss: eleve.naiss || ''
      });
    }
  };
  
  // Fonction pour annuler l'édition
  const handleCancel = () => {
    setIsEditing(false);
    setError(null);
  };
  
  // État pour les erreurs de validation
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  
  // Fonction de validation des informations personnelles
  const validateInfoPersonnelles = (info: any) => {
    const errors: Record<string, string> = {};
    
    // Validation du nom
    if (!info.nom || info.nom.trim() === '') {
      errors.nom = 'Le nom est requis';
    }
    
    // Validation du prénom
    if (!info.prenom || info.prenom.trim() === '') {
      errors.prenom = 'Le prénom est requis';
    }
    
    // Validation de la date de naissance
    if (info.naiss) {
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(info.naiss)) {
        errors.naiss = 'Format de date invalide (YYYY-MM-DD)';
      }
    }
    
    return errors;
  };
  
  // Fonction pour sauvegarder les modifications
  const handleSave = async () => {
    if (!eleve || !onSave) return;
    
    try {
      // Valider les données avant de sauvegarder
      const infoPerso = {
        nom: formData.nom,
        prenom: formData.prenom,
        naiss: formData.naiss
      };
      
      const errors = validateInfoPersonnelles(infoPerso);
      
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
        ...infoPerso
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
  
  // Fonction pour calculer l'âge à partir de la date de naissance
  const calculateAge = (dateOfBirth: string): number => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  // Fonction pour formater la date au format français
  const formatDate = (dateString: string): string => {
    if (!dateString) return 'Non renseignée';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="p-4 border border-gray-200 rounded-md animate-pulse">
        <div className="flex items-center mb-3">
          <div className="bg-gray-200 rounded-full h-6 w-6 mr-2"></div>
          <div className="bg-gray-200 h-5 w-40 rounded"></div>
        </div>
        <div className="space-y-2">
          <div className="bg-gray-200 h-4 w-3/4 rounded"></div>
          <div className="bg-gray-200 h-4 w-1/2 rounded"></div>
          <div className="bg-gray-200 h-4 w-2/3 rounded"></div>
        </div>
      </div>
    );
  }

  if (!eleve) {
    return (
      <div className="p-4 border border-gray-200 rounded-md">
        <p className="text-gray-500">Aucune information disponible</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm flex-1 min-w-[300px]">
      {/* En-tête de la section */}
      <div className="flex justify-between items-center p-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center space-x-2">
          <FiUser className="text-blue-500" />
          <h3 className="font-medium">Informations personnelles</h3>
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
      
      {/* Message d'erreur */}
      {error && (
        <div className="mb-3 p-2 bg-red-100 text-red-700 text-sm rounded-md">
          {error}
        </div>
      )}
      
      {/* Contenu de la section */}
      <div className="p-4">
        {!isEditing ? (
          // Mode lecture
          <div className="space-y-4">
            {/* Nom et prénom */}
            <div className="flex flex-col md:flex-row md:space-x-6">
              <div className="flex-1 mb-3 md:mb-0">
                <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <FiUser className="mr-2 text-gray-500" />
                  Nom
                </h4>
                <p className="font-medium">{eleve.nom || 'Non renseigné'}</p>
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Prénom</h4>
                <p className="font-medium">{eleve.prenom || 'Non renseigné'}</p>
              </div>
            </div>
            
            {/* Date de naissance et âge */}
            <div className="flex flex-col md:flex-row md:space-x-6">
              <div className="flex-1 mb-3 md:mb-0">
                <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <FiCalendar className="mr-2 text-gray-500" />
                  Date de naissance
                </h4>
                <p className="font-medium">
                  {eleve.naiss ? formatDate(eleve.naiss) : 'Non renseignée'}
                </p>
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <FiInfo className="mr-2 text-gray-500" />
                  Âge
                </h4>
                <p className="font-medium">
                  {eleve.naiss 
                    ? `${calculateAge(eleve.naiss)} ans` 
                    : 'Non renseigné'}
                </p>
              </div>
            </div>
          </div>
        ) : (
          // Mode édition
          <div className="space-y-4">
            {/* Nom et prénom */}
            <div className="flex flex-col md:flex-row md:space-x-6">
              <div className="flex-1 mb-3 md:mb-0">
                <label className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <FiUser className="mr-2 text-gray-500" />
                  Nom
                </label>
                <input
                  type="text"
                  value={formData.nom}
                  onChange={(e) => {
                    setFormData({...formData, nom: e.target.value});
                    // Effacer l'erreur de validation quand l'utilisateur modifie le champ
                    if (validationErrors.nom) {
                      setValidationErrors({...validationErrors, nom: ''});
                    }
                  }}
                  className={`w-full p-2 text-sm border rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 ${validationErrors.nom ? 'border-red-500' : 'border-gray-300'}`}
                />
                {validationErrors.nom && (
                  <p className="text-red-500 text-xs mt-1">{validationErrors.nom}</p>
                )}
              </div>
              
              <div className="flex-1">
                <label className="text-sm font-medium text-gray-700 mb-2">Prénom</label>
                <input
                  type="text"
                  value={formData.prenom}
                  onChange={(e) => {
                    setFormData({...formData, prenom: e.target.value});
                    if (validationErrors.prenom) {
                      setValidationErrors({...validationErrors, prenom: ''});
                    }
                  }}
                  className={`w-full p-2 text-sm border rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 ${validationErrors.prenom ? 'border-red-500' : 'border-gray-300'}`}
                />
                {validationErrors.prenom && (
                  <p className="text-red-500 text-xs mt-1">{validationErrors.prenom}</p>
                )}
              </div>
            </div>
            
            {/* Date de naissance */}
            <div className="flex flex-col md:flex-row md:space-x-6">
              <div className="flex-1">
                <label className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <FiCalendar className="mr-2 text-gray-500" />
                  Date de naissance
                </label>
                <input
                  type="date"
                  value={formData.naiss ? formData.naiss.split('T')[0] : ''}
                  onChange={(e) => {
                    setFormData({...formData, naiss: e.target.value});
                    if (validationErrors.naiss) {
                      setValidationErrors({...validationErrors, naiss: ''});
                    }
                  }}
                  className={`w-full p-2 text-sm border rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 ${validationErrors.naiss ? 'border-red-500' : 'border-gray-300'}`}
                />
                {validationErrors.naiss && (
                  <p className="text-red-500 text-xs mt-1">{validationErrors.naiss}</p>
                )}
              </div>
              <div className="flex-1">
                {/* Espace vide pour équilibrer la mise en page */}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
