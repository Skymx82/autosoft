'use client';

import React, { useState, useEffect } from 'react';
import { FiTruck, FiSearch } from 'react-icons/fi';
import { PlanningDetails } from './types';

interface VehiculeProps {
  planningDetails: PlanningDetails;
  onSave: (updatedDetails: PlanningDetails) => Promise<void>;
}

interface Vehicule {
  id_vehicule: number;
  immatriculation: string;
  marque: string;
  modele: string;
  type_vehicule: string;
  categorie_permis: string;
  statut: string;
}

export default function Vehicule({ planningDetails, onSave }: VehiculeProps) {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [vehicules, setVehicules] = useState<Vehicule[]>([]);
  const [filteredVehicules, setFilteredVehicules] = useState<Vehicule[]>([]);
  const [isLoadingVehicules, setIsLoadingVehicules] = useState<boolean>(false);
  const [selectedVehiculeId, setSelectedVehiculeId] = useState<number | null>(planningDetails.vehicule?.id_vehicule || null);
  
  // État pour l'édition des champs du véhicule
  const [formData, setFormData] = useState({
    immatriculation: planningDetails.vehicule?.immatriculation || '',
    marque: planningDetails.vehicule?.marque || '',
    modele: planningDetails.vehicule?.modele || '',
    type_vehicule: planningDetails.vehicule?.type_vehicule || '',
    categorie_permis: planningDetails.vehicule?.categorie_permis || '',
    id_vehicule: planningDetails.vehicule?.id_vehicule || null
  });
  
  // Fonction pour charger les véhicules disponibles
  const fetchVehicules = async () => {
    try {
      setIsLoadingVehicules(true);
      
      // Récupérer l'ID du bureau et de l'auto-école depuis les détails du planning
      const id_bureau = planningDetails.bureau?.id_bureau;
      const id_ecole = planningDetails.auto_ecole?.id_ecole;
      
      if (!id_bureau || !id_ecole) {
        throw new Error("Informations du bureau ou de l'auto-école manquantes");
      }
      
      // Appel à l'API pour récupérer les véhicules
      const response = await fetch(`/api/directeur/planning/ModalDetail/vehicule?id_bureau=${id_bureau}&id_ecole=${id_ecole}`);
      
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
      
      const data = await response.json();
      setVehicules(data.vehicules || []);
    } catch (err) {
      console.error("Erreur lors du chargement des véhicules:", err);
      setError("Impossible de charger la liste des véhicules.");
    } finally {
      setIsLoadingVehicules(false);
    }
  };
  
  // Charger les véhicules lorsque le mode édition est activé
  useEffect(() => {
    if (isEditing) {
      fetchVehicules();
    }
  }, [isEditing]);
  
  // Filtrer les véhicules automatiquement selon la catégorie du véhicule actuel
  useEffect(() => {
    const vehiculeCategorie = planningDetails.vehicule?.categorie_permis;
    
    if (vehiculeCategorie && vehicules.length > 0) {
      // Filtrer les véhicules qui correspondent à la catégorie du véhicule actuel
      const filtered = vehicules.filter(v => v.categorie_permis === vehiculeCategorie);
      setFilteredVehicules(filtered);
    } else {
      // Si pas de catégorie, afficher tous les véhicules
      setFilteredVehicules(vehicules);
    }
  }, [vehicules, planningDetails.vehicule?.categorie_permis]);
  
  // Mettre à jour les champs du formulaire lorsqu'un véhicule est sélectionné
  useEffect(() => {
    if (selectedVehiculeId) {
      const selectedVehicule = vehicules.find(v => v.id_vehicule === selectedVehiculeId);
      if (selectedVehicule) {
        setFormData({
          immatriculation: selectedVehicule.immatriculation,
          marque: selectedVehicule.marque,
          modele: selectedVehicule.modele,
          type_vehicule: selectedVehicule.type_vehicule,
          categorie_permis: selectedVehicule.categorie_permis,
          id_vehicule: selectedVehicule.id_vehicule
        });
      }
    }
  }, [selectedVehiculeId, vehicules]);

  // Fonction pour gérer la sauvegarde des modifications
  const handleSave = async () => {
    if (!planningDetails) return;
    
    try {
      setIsLoading(true);
      setError(null);
      
      // Déterminer l'ID du véhicule à enregistrer
      const vehiculeId = selectedVehiculeId;
      
      // Créer un objet avec les données mises à jour
      const updatedDetails = {
        ...planningDetails,
        // Ajouter explicitement l'ID du véhicule pour la mise à jour dans la table planning
        id_vehicule: vehiculeId,
        // Conserver les informations complètes du véhicule pour l'affichage
        vehicule: vehiculeId ? {
          id_vehicule: vehiculeId,
          immatriculation: formData.immatriculation,
          marque: formData.marque,
          modele: formData.modele,
          type_vehicule: formData.type_vehicule,
          categorie_permis: formData.categorie_permis,
          statut: planningDetails.vehicule?.statut || 'Disponible'
        } : null
      };
      
      console.log('Sauvegarde du véhicule avec ID:', vehiculeId);
      
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
    <>
      {planningDetails.vehicule || isEditing ? (
        <div className="flex-1 min-w-[200px] p-3 bg-green-50 rounded-md border border-green-100">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <FiTruck className="text-green-500 mr-2" />
              <h4 className="font-medium">Véhicule</h4>
            </div>
            {!isEditing ? (
              <button 
                onClick={() => setIsEditing(true)}
                className="text-xs px-2 py-1 bg-green-100 hover:bg-green-200 text-green-700 rounded transition-colors"
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
                  className="text-xs px-2 py-1 bg-green-500 hover:bg-green-600 text-white rounded transition-colors"
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
                <span className="text-gray-500">Immatriculation: </span>
                <span className="font-medium">{planningDetails.vehicule?.immatriculation}</span>
              </div>
              <div className="text-sm">
                <span className="text-gray-500">Modèle: </span>
                <span className="font-medium">{planningDetails.vehicule?.marque} {planningDetails.vehicule?.modele}</span>
              </div>
              <div className="text-sm">
                <span className="text-gray-500">Type: </span>
                <span className="font-medium">{planningDetails.vehicule?.type_vehicule}</span>
              </div>
              <div className="text-sm">
                <span className="text-gray-500">Catégorie: </span>
                <span className="font-medium">{planningDetails.vehicule?.categorie_permis}</span>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {/* Afficher la catégorie du véhicule actuel */}
              {planningDetails.vehicule?.categorie_permis && (
                <div className="p-2 bg-blue-50 rounded-md border border-blue-100">
                  <p className="text-xs text-blue-700">
                    <span className="font-medium">Catégorie du véhicule actuel :</span> {planningDetails.vehicule.categorie_permis}
                  </p>
                </div>
              )}
              
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Sélectionner un véhicule</label>
                <div className="relative">
                  <select
                    value={selectedVehiculeId || ''}
                    onChange={(e) => setSelectedVehiculeId(e.target.value ? Number(e.target.value) : null)}
                    className="w-full p-1 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-green-500 focus:border-green-500"
                    disabled={isLoadingVehicules}
                  >
                    <option value="">-- Sélectionner un véhicule --</option>
                    {filteredVehicules.length === 0 ? (
                      <option value="" disabled>
                        Aucun véhicule disponible pour la catégorie {planningDetails.vehicule?.categorie_permis}
                      </option>
                    ) : (
                      filteredVehicules.map((vehicule) => (
                        <option key={vehicule.id_vehicule} value={vehicule.id_vehicule}>
                          {vehicule.immatriculation} - {vehicule.marque} {vehicule.modele}
                        </option>
                      ))
                    )}
                  </select>
                  {isLoadingVehicules && (
                    <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-500"></div>
                    </div>
                  )}
                </div>
                {filteredVehicules.length === 0 && planningDetails.vehicule?.categorie_permis && (
                  <p className="text-xs text-amber-600 mt-1">
                    Aucun véhicule disponible pour la catégorie {planningDetails.vehicule.categorie_permis}.
                  </p>
                )}
              </div>
              
              {/* Affichage des détails du véhicule sélectionné */}
              {selectedVehiculeId && (
                <div className="p-2 bg-green-50 rounded-md border border-green-100">
                  <h5 className="text-xs font-medium text-gray-700 mb-1">Détails du véhicule</h5>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                    <div>
                      <span className="text-gray-500">Immatriculation:</span> {formData.immatriculation}
                    </div>
                    <div>
                      <span className="text-gray-500">Modèle:</span> {formData.marque} {formData.modele}
                    </div>
                    <div>
                      <span className="text-gray-500">Type:</span> {formData.type_vehicule}
                    </div>
                    <div>
                      <span className="text-gray-500">Catégorie:</span> {formData.categorie_permis}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="flex-1 min-w-[200px] p-3 bg-gray-50 rounded-md border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <FiTruck className="text-gray-500 mr-2" />
              <h4 className="font-medium">Véhicule</h4>
            </div>
            <button 
              onClick={() => setIsEditing(true)}
              className="text-xs px-2 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded transition-colors"
            >
              Ajouter
            </button>
          </div>
          {!isEditing && <p className="text-sm text-gray-500">Aucun véhicule assigné à cette leçon</p>}
        </div>
      )}
    </>
  );
}
