'use client';

import React, { useState, useEffect } from 'react';
import { FiClipboard, FiCalendar, FiHome, FiEdit, FiCheck, FiX } from 'react-icons/fi';
import { Eleve } from '../api/eleveApi';
import { Bureau, getAllBureaux } from '../api/bureauApi';

interface InfoAdminProps {
  eleve: Eleve | null;
  loading: boolean;
  onSave?: (updatedEleve: Eleve) => Promise<void>;
}

export default function InfoAdmin({ eleve, loading, onSave }: InfoAdminProps) {
  // États pour la gestion de l'édition
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  // État pour l'édition des champs administratifs de l'élève
  const [formData, setFormData] = useState({
    statut_dossier: eleve?.statut_dossier || '',
    date_inscription: eleve?.date_inscription || '',
    id_bureau: eleve?.id_bureau || 0
  });
  
  // État pour les bureaux
  const [bureaux, setBureaux] = useState<Bureau[]>([]);
  const [bureauLoading, setBureauLoading] = useState<boolean>(false);
  
  // État pour les erreurs de validation
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  
  // Fonction pour basculer en mode édition
  const handleEdit = () => {
    setIsEditing(true);
    // Réinitialiser les données du formulaire avec les valeurs actuelles
    if (eleve) {
      setFormData({
        statut_dossier: eleve.statut_dossier || '',
        date_inscription: eleve.date_inscription || '',
        id_bureau: eleve.id_bureau || 0
      });
    }
  };
  
  // Fonction pour annuler l'édition
  const handleCancel = () => {
    setIsEditing(false);
    setError(null);
    setValidationErrors({});
  };
  
  // Fonction de validation des informations administratives
  const validateInfoAdmin = (info: any) => {
    const errors: Record<string, string> = {};
    
    // Validation de la date d'inscription
    if (info.date_inscription) {
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(info.date_inscription)) {
        errors.date_inscription = 'Format de date invalide (YYYY-MM-DD)';
      }
    }
    
    // Validation du bureau
    if (info.id_bureau && (isNaN(Number(info.id_bureau)) || Number(info.id_bureau) <= 0)) {
      errors.id_bureau = 'Veuillez sélectionner un bureau valide';
    }
    
    return errors;
  };
  
  // Fonction pour sauvegarder les modifications
  const handleSave = async () => {
    if (!eleve || !onSave) return;
    
    try {
      // Valider les données avant de sauvegarder
      const infoAdmin = {
        statut_dossier: formData.statut_dossier,
        date_inscription: formData.date_inscription,
        id_bureau: formData.id_bureau
      };
      
      const errors = validateInfoAdmin(infoAdmin);
      
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
        ...infoAdmin
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
        statut_dossier: eleve.statut_dossier || '',
        date_inscription: eleve.date_inscription || '',
        id_bureau: eleve.id_bureau || 0
      });
    }
  }, [eleve]);
  
  // Charger les bureaux
  useEffect(() => {
    const fetchBureaux = async () => {
      try {
        setBureauLoading(true);
        const data = await getAllBureaux();
        setBureaux(data);
      } catch (err) {
        console.error('Erreur lors du chargement des bureaux:', err);
      } finally {
        setBureauLoading(false);
      }
    };
    
    fetchBureaux();
  }, []);
  
  // Fonction pour obtenir le nom du bureau à partir de son ID
  const getBureauName = (id: number | undefined | null): string => {
    if (!id) return 'Non spécifié';
    const bureau = bureaux.find(b => b.id_bureau === id);
    return bureau ? bureau.nom : `Bureau #${id}`;
  };
  
  // Fonction pour formater la date au format français
  const formatDate = (dateString: string): string => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };
  
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
          <FiClipboard className="text-blue-500" />
          <h3 className="font-medium">Informations administratives</h3>
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
          <div className="space-y-3">
            {/* Statut du dossier */}
            <div className="flex items-start">
              <FiClipboard className="text-gray-400 mt-1 mr-3" />
              <div>
                <p className="text-xs text-gray-500">Statut du dossier</p>
                <p className="text-sm font-medium">
                  {eleve.statut_dossier ? (
                    <span className={`inline-block px-2 py-1 rounded-full text-xs ${
                      eleve.statut_dossier === 'Actif' ? 'bg-green-100 text-green-800' :
                      eleve.statut_dossier === 'En attente' ? 'bg-yellow-100 text-yellow-800' :
                      eleve.statut_dossier === 'Complet' ? 'bg-blue-100 text-blue-800' :
                      eleve.statut_dossier === 'Incomplet' ? 'bg-red-100 text-red-800' :
                      eleve.statut_dossier === 'Brouillon' ? 'bg-purple-100 text-purple-800' :
                      eleve.statut_dossier === 'Archivé' ? 'bg-gray-100 text-gray-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {eleve.statut_dossier}
                    </span>
                  ) : (
                    <span className="text-gray-400">Non spécifié</span>
                  )}
                </p>
              </div>
            </div>
            
            {/* Date d'inscription */}
            <div className="flex items-start">
              <FiCalendar className="text-gray-400 mt-1 mr-3" />
              <div>
                <p className="text-xs text-gray-500">Date d'inscription</p>
                <p className="text-sm font-medium">
                  {eleve.date_inscription ? (
                    formatDate(eleve.date_inscription)
                  ) : (
                    <span className="text-gray-400">Non spécifiée</span>
                  )}
                </p>
              </div>
            </div>
            
            {/* Bureau */}
            <div className="flex items-start">
              <FiHome className="text-gray-400 mt-1 mr-3" />
              <div>
                <p className="text-xs text-gray-500">Bureau</p>
                <p className="text-sm font-medium">
                  {eleve.id_bureau ? (
                    bureauLoading ? (
                      <span className="text-gray-400">Chargement...</span>
                    ) : (
                      getBureauName(eleve.id_bureau)
                    )
                  ) : (
                    <span className="text-gray-400">Non spécifié</span>
                  )}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Statut du dossier */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Statut du dossier</label>
              <select
                value={formData.statut_dossier}
                onChange={(e) => {
                  setFormData({...formData, statut_dossier: e.target.value});
                  if (validationErrors.statut_dossier) {
                    setValidationErrors({...validationErrors, statut_dossier: ''});
                  }
                }}
                className={`w-full p-2 text-sm border rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 ${validationErrors.statut_dossier ? 'border-red-500' : 'border-gray-300'}`}
              >
                <option value="">Sélectionner un statut</option>
                <option value="Actif">Actif</option>
                <option value="En attente">En attente</option>
                <option value="Complet">Complet</option>
                <option value="Incomplet">Incomplet</option>
                <option value="Brouillon">Brouillon</option>
                <option value="Archivé">Archivé</option>
              </select>
              {validationErrors.statut_dossier && (
                <p className="text-red-500 text-xs mt-1">{validationErrors.statut_dossier}</p>
              )}
            </div>
            
            {/* Date d'inscription */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Date d'inscription</label>
              <input
                type="date"
                value={formData.date_inscription ? formData.date_inscription.split('T')[0] : ''}
                onChange={(e) => {
                  setFormData({...formData, date_inscription: e.target.value});
                  if (validationErrors.date_inscription) {
                    setValidationErrors({...validationErrors, date_inscription: ''});
                  }
                }}
                className={`w-full p-2 text-sm border rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 ${validationErrors.date_inscription ? 'border-red-500' : 'border-gray-300'}`}
              />
              {validationErrors.date_inscription && (
                <p className="text-red-500 text-xs mt-1">{validationErrors.date_inscription}</p>
              )}
            </div>
            
            {/* Bureau */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Bureau</label>
              <select
                value={formData.id_bureau || ''}
                onChange={(e) => {
                  setFormData({...formData, id_bureau: parseInt(e.target.value) || 0});
                  if (validationErrors.id_bureau) {
                    setValidationErrors({...validationErrors, id_bureau: ''});
                  }
                }}
                className={`w-full p-2 text-sm border rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 ${validationErrors.id_bureau ? 'border-red-500' : 'border-gray-300'}`}
                disabled={bureauLoading}
              >
                <option value="">Sélectionner un bureau</option>
                {bureaux.map((bureau) => (
                  <option key={bureau.id_bureau} value={bureau.id_bureau}>
                    {bureau.nom}
                  </option>
                ))}
              </select>
              {validationErrors.id_bureau && (
                <p className="text-red-500 text-xs mt-1">{validationErrors.id_bureau}</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
