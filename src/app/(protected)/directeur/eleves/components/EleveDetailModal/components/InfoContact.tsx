'use client';

import React, { useState, useEffect } from 'react';
import { FiMail, FiPhone, FiMapPin, FiEdit, FiCheck, FiX } from 'react-icons/fi';
import { Eleve } from '../api/eleveApi';

interface InfoContactProps {
  eleve: Eleve | null;
  loading: boolean;
  onSave?: (updatedEleve: Eleve) => Promise<void>;
}

export default function InfoContact({ eleve, loading, onSave }: InfoContactProps) {
  // États pour la gestion de l'édition
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  // État pour l'édition des champs de l'élève
  const [formData, setFormData] = useState({
    mail: eleve?.mail || '',
    tel: eleve?.tel || '',
    adresse: eleve?.adresse || '',
    code_postal: eleve?.code_postal || '',
    ville: eleve?.ville || ''
  });
  
  // Fonction pour basculer en mode édition
  const handleEdit = () => {
    setIsEditing(true);
    // Réinitialiser les données du formulaire avec les valeurs actuelles
    if (eleve) {
      setFormData({
        mail: eleve.mail || '',
        tel: eleve.tel || '',
        adresse: eleve.adresse || '',
        code_postal: eleve.code_postal || '',
        ville: eleve.ville || ''
      });
    }
  };
  
  // Fonction pour annuler l'édition
  const handleCancel = () => {
    setIsEditing(false);
    setError(null);
    setValidationErrors({});
  };
  
  // État pour les erreurs de validation
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  
  // Fonction de validation des informations de contact
  const validateInfoContact = (info: any) => {
    const errors: Record<string, string> = {};
    
    // Validation de l'email
    if (info.mail && info.mail.trim() !== '') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(info.mail)) {
        errors.mail = 'Format d\'email invalide';
      }
    }
    
    // Validation du téléphone
    if (info.tel && info.tel.trim() !== '') {
      const telRegex = /^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/;
      if (!telRegex.test(info.tel)) {
        errors.tel = 'Format de téléphone invalide';
      }
    }
    
    // Validation du code postal
    if (info.code_postal && info.code_postal.trim() !== '') {
      const codePostalRegex = /^\d{5}$/;
      if (!codePostalRegex.test(info.code_postal)) {
        errors.code_postal = 'Le code postal doit contenir 5 chiffres';
      }
    }
    
    return errors;
  };
  
  // Fonction pour sauvegarder les modifications
  const handleSave = async () => {
    if (!eleve || !onSave) return;
    
    try {
      // Valider les données avant de sauvegarder
      const infoContact = {
        mail: formData.mail,
        tel: formData.tel,
        adresse: formData.adresse,
        code_postal: formData.code_postal,
        ville: formData.ville
      };
      
      const errors = validateInfoContact(infoContact);
      
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
        ...infoContact
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
        mail: eleve.mail || '',
        tel: eleve.tel || '',
        adresse: eleve.adresse || '',
        code_postal: eleve.code_postal || '',
        ville: eleve.ville || ''
      });
    }
  }, [eleve]);
  
  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm flex-1 min-w-[300px]">
      {/* En-tête de la section */}
      <div className="flex justify-between items-center p-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center space-x-2">
          <FiMapPin className="text-blue-500" />
          <h3 className="font-medium">Coordonnées</h3>
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
        {/* Message d'erreur */}
        {error && (
          <div className="mb-4 p-2 bg-red-50 text-red-600 text-sm rounded">
            {error}
          </div>
        )}
        
        {/* Affichage en mode lecture */}
        {!isEditing && (
          <div className="space-y-4">
            {/* Email */}
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <FiMail className="text-gray-400" />
                <p className="text-sm text-gray-500">Email</p>
              </div>
              <p className="font-medium">
                {eleve?.mail || 'Non renseigné'}
              </p>
            </div>
            
            {/* Téléphone */}
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <FiPhone className="text-gray-400" />
                <p className="text-sm text-gray-500">Téléphone</p>
              </div>
              <p className="font-medium">
                {eleve?.tel || 'Non renseigné'}
              </p>
            </div>
            
            {/* Adresse */}
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <FiMapPin className="text-gray-400" />
                <p className="text-sm text-gray-500">Adresse</p>
              </div>
              <div className="text-right">
                <p className="font-medium">
                  {eleve?.adresse || 'Non renseignée'}
                </p>
                {(eleve?.code_postal || eleve?.ville) && (
                  <p className="text-sm text-gray-600">
                    {eleve?.code_postal || ''} {eleve?.ville || ''}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
        
        {/* Formulaire d'édition */}
        {isEditing && (
          <div className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={formData.mail}
                onChange={(e) => {
                  setFormData({...formData, mail: e.target.value});
                  if (validationErrors.mail) {
                    setValidationErrors({...validationErrors, mail: ''});
                  }
                }}
                className={`w-full p-2 text-sm border rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 ${validationErrors.mail ? 'border-red-500' : 'border-gray-300'}`}
              />
              {validationErrors.mail && (
                <p className="text-red-500 text-xs mt-1">{validationErrors.mail}</p>
              )}
            </div>
            
            {/* Téléphone */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Téléphone</label>
              <input
                type="tel"
                value={formData.tel}
                onChange={(e) => {
                  setFormData({...formData, tel: e.target.value});
                  if (validationErrors.tel) {
                    setValidationErrors({...validationErrors, tel: ''});
                  }
                }}
                className={`w-full p-2 text-sm border rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 ${validationErrors.tel ? 'border-red-500' : 'border-gray-300'}`}
              />
              {validationErrors.tel && (
                <p className="text-red-500 text-xs mt-1">{validationErrors.tel}</p>
              )}
            </div>
            
            {/* Adresse */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Adresse</label>
              <input
                type="text"
                value={formData.adresse}
                onChange={(e) => {
                  setFormData({...formData, adresse: e.target.value});
                  if (validationErrors.adresse) {
                    setValidationErrors({...validationErrors, adresse: ''});
                  }
                }}
                className={`w-full p-2 text-sm border rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 ${validationErrors.adresse ? 'border-red-500' : 'border-gray-300'}`}
              />
              {validationErrors.adresse && (
                <p className="text-red-500 text-xs mt-1">{validationErrors.adresse}</p>
              )}
            </div>
            
            {/* Code postal et ville sur la même ligne */}
            <div className="grid grid-cols-2 gap-4">
              {/* Code postal */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Code postal</label>
                <input
                  type="text"
                  value={formData.code_postal}
                  onChange={(e) => {
                    setFormData({...formData, code_postal: e.target.value});
                    if (validationErrors.code_postal) {
                      setValidationErrors({...validationErrors, code_postal: ''});
                    }
                  }}
                  className={`w-full p-2 text-sm border rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 ${validationErrors.code_postal ? 'border-red-500' : 'border-gray-300'}`}
                />
                {validationErrors.code_postal && (
                  <p className="text-red-500 text-xs mt-1">{validationErrors.code_postal}</p>
                )}
              </div>
              
              {/* Ville */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Ville</label>
                <input
                  type="text"
                  value={formData.ville}
                  onChange={(e) => {
                    setFormData({...formData, ville: e.target.value});
                    if (validationErrors.ville) {
                      setValidationErrors({...validationErrors, ville: ''});
                    }
                  }}
                  className={`w-full p-2 text-sm border rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 ${validationErrors.ville ? 'border-red-500' : 'border-gray-300'}`}
                />
                {validationErrors.ville && (
                  <p className="text-red-500 text-xs mt-1">{validationErrors.ville}</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
