'use client';

import React, { useState, useEffect } from 'react';
import { FiUser, FiEdit, FiCheck, FiX } from 'react-icons/fi';
import { PlanningDetails } from '../types';

// Interface pour les moniteurs
interface Moniteur {
  id_moniteur: number;
  nom: string;
  prenom: string;
  email: string;
  tel: string;
  num_enseignant: string | null;
  date_delivrance_num: string | null;
}

interface MoniteurProps {
  planningDetails: PlanningDetails;
  onSave: (updatedDetails: PlanningDetails) => Promise<void>;
}

export default function Moniteur({ planningDetails, onSave }: MoniteurProps) {
  // États pour la gestion de l'édition
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [moniteurs, setMoniteurs] = useState<Moniteur[]>([]);
  const [isLoadingMoniteurs, setIsLoadingMoniteurs] = useState<boolean>(false);
  const [selectedMoniteurId, setSelectedMoniteurId] = useState<number | null>(planningDetails.enseignants?.id_moniteur || null);
  
  // État pour l'édition des champs du moniteur
  const [formData, setFormData] = useState({
    id_moniteur: planningDetails.enseignants?.id_moniteur || null,
    nom: planningDetails.enseignants?.nom || '',
    prenom: planningDetails.enseignants?.prenom || '',
    email: planningDetails.enseignants?.email || '',
    tel: planningDetails.enseignants?.tel || '',
    num_enseignant: planningDetails.enseignants?.num_enseignant || '',
    date_delivrance_num: planningDetails.enseignants?.date_delivrance_num || ''
  });

  // Effet pour charger les moniteurs lors de l'édition
  useEffect(() => {
    if (isEditing) {
      fetchMoniteurs();
    }
  }, [isEditing]);


  // Fonction pour récupérer les moniteurs depuis l'API
  const fetchMoniteurs = async () => {
    try {
      setIsLoadingMoniteurs(true);
      setError(null);
      
      const response = await fetch(`/directeur/planning/components/ModalDetail/Moniteur/api?id_ecole=${planningDetails.id_ecole}${planningDetails.id_bureau ? `&id_bureau=${planningDetails.id_bureau}` : ''}`);
      
      if (!response.ok) {
        throw new Error(`Erreur lors de la récupération des moniteurs: ${response.status}`);
      }
      
      const data = await response.json();
      setMoniteurs(data.moniteurs || []);
    } catch (err) {
      console.error("Erreur lors du chargement des moniteurs:", err);
      setError("Impossible de charger la liste des moniteurs. Veuillez réessayer.");
    } finally {
      setIsLoadingMoniteurs(false);
    }
  };

  // Fonction pour gérer la sélection d'un moniteur
  const handleSelectMoniteur = (moniteur: Moniteur) => {
    setSelectedMoniteurId(moniteur.id_moniteur);
    setFormData({
      id_moniteur: moniteur.id_moniteur,
      nom: moniteur.nom,
      prenom: moniteur.prenom,
      email: moniteur.email,
      tel: moniteur.tel,
      num_enseignant: moniteur.num_enseignant || '',
      date_delivrance_num: moniteur.date_delivrance_num || ''
    });
  };


  // Fonction pour gérer la sauvegarde des modifications
  const handleSave = async () => {
    if (!planningDetails) return;
    
    try {
      setIsLoading(true);
      setError(null);
      
      // Déterminer l'ID du moniteur à enregistrer
      const moniteurId = selectedMoniteurId;
      
      // Créer un objet avec les données mises à jour
      const updatedDetails = {
        ...planningDetails,
        // Ajouter explicitement l'ID du moniteur pour la mise à jour dans la table planning
        id_moniteur: moniteurId,
        // Conserver les informations complètes du moniteur pour l'affichage
        enseignants: moniteurId ? {
          id_moniteur: moniteurId,
          nom: formData.nom,
          prenom: formData.prenom,
          email: formData.email,
          tel: formData.tel,
          num_enseignant: formData.num_enseignant,
          date_delivrance_num: formData.date_delivrance_num
        } : null
      };
      
      console.log('Sauvegarde du moniteur avec ID:', moniteurId);
      
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

  // Fonction pour annuler l'édition
  const handleCancel = () => {
    setIsEditing(false);
    setError(null);
    setFormData({
      id_moniteur: planningDetails.enseignants?.id_moniteur || null,
      nom: planningDetails.enseignants?.nom || '',
      prenom: planningDetails.enseignants?.prenom || '',
      email: planningDetails.enseignants?.email || '',
      tel: planningDetails.enseignants?.tel || '',
      num_enseignant: planningDetails.enseignants?.num_enseignant || '',
      date_delivrance_num: planningDetails.enseignants?.date_delivrance_num || ''
    });
    setSelectedMoniteurId(planningDetails.enseignants?.id_moniteur || null);
  };

  return (
    <div className="flex-1 min-w-[200px] p-3 bg-gray-50 rounded-md border border-gray-200">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          <FiUser className="text-green-500 mr-2" />
          <h4 className="font-medium">Moniteur</h4>
        </div>
        {!isEditing ? (
          <button 
            onClick={() => setIsEditing(true)}
            className="text-xs px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            <FiEdit className="inline mr-1" /> Modifier
          </button>
        ) : (
          <div className="flex space-x-1">
            <button 
              onClick={handleSave}
              disabled={isLoading}
              className="text-xs px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition-colors disabled:bg-gray-400"
            >
              <FiCheck className="inline mr-1" /> Enregistrer
            </button>
            <button 
              onClick={handleCancel}
              className="text-xs px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
            >
              <FiX className="inline mr-1" /> Annuler
            </button>
          </div>
        )}
      </div>
      
      {error && (
        <div className="text-sm text-red-500 mb-2">{error}</div>
      )}
      
      {!isEditing ? (
        // Mode affichage
        <div className="space-y-1">
          {planningDetails.enseignants ? (
            <>
              <div className="text-sm font-medium">
                {planningDetails.enseignants.prenom} {planningDetails.enseignants.nom}
              </div>
              {planningDetails.enseignants.tel && (
                <div className="text-sm">
                  <span className="text-gray-500">Tél: </span>
                  <a href={`tel:${planningDetails.enseignants.tel}`} className="text-blue-500 hover:underline">
                    {planningDetails.enseignants.tel}
                  </a>
                </div>
              )}
              {planningDetails.enseignants.email && (
                <div className="text-sm">
                  <span className="text-gray-500">Email: </span>
                  <a href={`mailto:${planningDetails.enseignants.email}`} className="text-blue-500 hover:underline">
                    {planningDetails.enseignants.email}
                  </a>
                </div>
              )}
            </>
          ) : (
            <div className="text-sm text-gray-500 italic">Aucun moniteur assigné</div>
          )}
        </div>
      ) : (
        // Mode édition
        <div className="space-y-3">
          <div className="space-y-2">
              <div>
                <label className="block text-sm font-medium mb-1">Sélectionner un moniteur</label>
                <select
                  value={selectedMoniteurId || ''}
                  onChange={(e) => {
                    const moniteurId = e.target.value ? parseInt(e.target.value) : null;
                    if (moniteurId) {
                      const moniteur = moniteurs.find(m => m.id_moniteur === moniteurId);
                      if (moniteur) {
                        handleSelectMoniteur(moniteur);
                      }
                    } else {
                      setSelectedMoniteurId(null);
                      setFormData({
                        id_moniteur: null,
                        nom: '',
                        prenom: '',
                        email: '',
                        tel: '',
                        num_enseignant: '',
                        date_delivrance_num: ''
                      });
                    }
                  }}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  disabled={isLoadingMoniteurs}
                >
                  <option value="">-- Sélectionner un moniteur --</option>
                  {moniteurs.map((moniteur) => (
                    <option key={moniteur.id_moniteur} value={moniteur.id_moniteur}>
                      {moniteur.prenom} {moniteur.nom}
                    </option>
                  ))}
                </select>
                {isLoadingMoniteurs && (
                  <div className="text-sm text-gray-500 mt-1">Chargement des moniteurs...</div>
                )}
              </div>
              {selectedMoniteurId && (
                <div className="p-3 bg-green-50 rounded-md border border-green-200">
                  <div className="font-medium text-gray-900">{formData.prenom} {formData.nom}</div>
                  {formData.email && (
                    <div className="text-sm text-gray-600 mt-1">
                      <span className="font-medium">Email:</span> {formData.email}
                    </div>
                  )}
                  {formData.tel && (
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">Tél:</span> {formData.tel}
                    </div>
                  )}
                </div>
              )}
            </div>
        </div>
      )}
    </div>
  );
}
