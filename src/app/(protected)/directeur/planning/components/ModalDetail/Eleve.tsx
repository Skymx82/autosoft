'use client';

import React, { useState, useEffect } from 'react';
import { FiUser, FiEdit, FiCheck, FiX, FiPhone, FiMail } from 'react-icons/fi';
import { PlanningDetails } from './types';

// Interface pour les élèves
interface Eleve {
  id_eleve: number;
  nom: string;
  prenom: string;
  mail?: string;
  tel?: string;
  categorie?: string;
  id_bureau?: number;
  id_ecole?: number;
}

interface EleveProps {
  planningDetails: PlanningDetails;
  onSave: (updatedDetails: PlanningDetails) => Promise<void>;
}

export default function Eleve({ planningDetails, onSave }: EleveProps) {
  // États pour la gestion de l'édition
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isManualEntry, setIsManualEntry] = useState<boolean>(false);
  const [eleves, setEleves] = useState<Eleve[]>([]);
  const [filteredEleves, setFilteredEleves] = useState<Eleve[]>([]);
  const [isLoadingEleves, setIsLoadingEleves] = useState<boolean>(false);
  // États pour la recherche et la sélection d'élève
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEleveId, setSelectedEleveId] = useState<number | null>(planningDetails.eleves?.id_eleve || null);
  // États pour les suggestions d'élèves (comme dans PlanningFilters)
  const [suggestions, setSuggestions] = useState<Eleve[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  // État pour l'édition des champs de l'élève
  const [formData, setFormData] = useState({
    id_eleve: planningDetails.eleves?.id_eleve || null,
    nom: planningDetails.eleves?.nom || '',
    prenom: planningDetails.eleves?.prenom || '',
    mail: planningDetails.eleves?.mail || '',
    tel: planningDetails.eleves?.tel || '',
    categorie: planningDetails.eleves?.categorie || ''
  });
  
  // Fonction pour basculer en mode édition
  const handleEdit = () => {
    setIsEditing(true);
    // Réinitialiser les données du formulaire avec les valeurs actuelles
    if (planningDetails.eleves) {
      setFormData({
        id_eleve: planningDetails.eleves.id_eleve,
        nom: planningDetails.eleves.nom,
        prenom: planningDetails.eleves.prenom,
        mail: planningDetails.eleves.mail || '',
        tel: planningDetails.eleves.tel || '',
        categorie: planningDetails.eleves.categorie || ''
      });
    }
  };
  
  // Fonction pour annuler l'édition
  const handleCancel = () => {
    setIsEditing(false);
    setError(null);
    setIsManualEntry(false);
    setSearchTerm('');
    // Réinitialiser l'ID de l'élève sélectionné
    setSelectedEleveId(planningDetails.eleves?.id_eleve || null);
  };
  
  // Fonction pour récupérer la liste des élèves
  const fetchEleves = async () => {
    if (!planningDetails.id_ecole) return;
    
    setIsLoadingEleves(true);
    setError(null);
    
    try {
      // Construire l'URL avec les paramètres
      const url = new URL('/api/directeur/planning/ModalDetail/eleve', window.location.origin);
      url.searchParams.append('id_ecole', planningDetails.id_ecole.toString());
      if (planningDetails.id_bureau) {
        url.searchParams.append('id_bureau', planningDetails.id_bureau.toString());
      }
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Erreur lors de la récupération des élèves: ${response.status}`);
      }
      
      const data = await response.json();
      setEleves(data.eleves || []);
    } catch (err) {
      console.error("Erreur lors de la récupération des élèves:", err);
      setError("Impossible de charger la liste des élèves.");
    } finally {
      setIsLoadingEleves(false);
    }
  };
  
  // Charger les élèves lorsque le mode édition est activé
  useEffect(() => {
    if (isEditing) {
      fetchEleves();
    }
  }, [isEditing]);
  
  // Note: Le filtrage des élèves est maintenant géré directement dans l'onChange de l'input
  // avec le système de suggestions, donc nous n'avons plus besoin de ce useEffect
  
  // Mettre à jour les champs du formulaire lorsqu'un élève est sélectionné
  useEffect(() => {
    if (selectedEleveId && !isManualEntry) {
      const setSelectedEleve = (eleve: Eleve) => {
        setSelectedEleveId(eleve.id_eleve);
        setFormData({
          id_eleve: eleve.id_eleve,
          nom: eleve.nom,
          prenom: eleve.prenom,
          mail: eleve.mail || '',
          tel: eleve.tel || '',
          categorie: eleve.categorie || ''
        });
      };
      const selectedEleve = eleves.find(e => e.id_eleve === selectedEleveId);
      if (selectedEleve) {
        setSelectedEleve(selectedEleve);
      }
    }
  }, [selectedEleveId, eleves, isManualEntry]);

  // Fonction pour gérer la sauvegarde des modifications
  const handleSave = async () => {
    if (!planningDetails) return;
    
    try {
      setIsLoading(true);
      setError(null);
      
      // Déterminer l'ID de l'élève à enregistrer
      let eleveId = null;
      
      // Si on est en mode sélection et qu'un élève est sélectionné
      if (!isManualEntry && selectedEleveId) {
        eleveId = selectedEleveId;
      } 
      // Si on est en mode saisie manuelle et qu'un ID d'élève est défini dans le formulaire
      else if (isManualEntry && formData.id_eleve) {
        eleveId = formData.id_eleve;
      }
      
      // Créer un objet avec les données mises à jour
      const updatedDetails = {
        ...planningDetails,
        // Ajouter explicitement l'ID de l'élève pour la mise à jour dans la table planning
        id_eleve: eleveId,
        // Conserver les informations complètes de l'élève pour l'affichage
        eleves: eleveId ? {
          id_eleve: eleveId,
          nom: formData.nom,
          prenom: formData.prenom,
          mail: formData.mail,
          tel: formData.tel,
          categorie: formData.categorie
        } : null
      };
      
      console.log('Sauvegarde de l\'élève avec ID:', eleveId);
      
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
      {planningDetails.eleves || isEditing ? (
        <div className="flex-1 min-w-[200px] p-3 bg-blue-50 rounded-md border border-blue-100">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <FiUser className="text-blue-500 mr-2" />
              <h4 className="font-medium">Élève</h4>
            </div>
            
            {!isEditing ? (
              <button 
                onClick={handleEdit}
                className="text-xs px-2 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded transition-colors"
              >
                Modifier
              </button>
            ) : (
              <div className="flex space-x-1">
                <button 
                  onClick={handleCancel}
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
            <div className="mb-2 p-2 bg-red-100 text-red-700 text-sm rounded-md">
              {error}
            </div>
          )}
          
          {isEditing ? (
            <div className="space-y-3">
              <div className="flex items-center mb-2">
                <input
                  type="checkbox"
                  id="manualEntryEleve"
                  checked={isManualEntry}
                  onChange={(e) => setIsManualEntry(e.target.checked)}
                  className="mr-2"
                />
                <label htmlFor="manualEntryEleve" className="text-xs">
                  Saisie manuelle
                </label>
              </div>
              
              {!isManualEntry ? (
                <div className="space-y-2">
                  {/* Recherche d'élève avec suggestions comme dans PlanningFilters */}
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Rechercher un élève</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => {
                          const value = e.target.value;
                          setSearchTerm(value);
                          
                          // Générer des suggestions si l'utilisateur tape quelque chose
                          if (value.trim() !== '') {
                            const valueLower = value.toLowerCase();
                            const filteredSuggestions = eleves.filter(eleve => 
                              (eleve.nom && eleve.nom.toLowerCase().includes(valueLower)) ||
                              (eleve.prenom && eleve.prenom.toLowerCase().includes(valueLower)) ||
                              (eleve.tel && eleve.tel.toLowerCase().includes(valueLower))
                            );
                            
                            // Trier les suggestions par pertinence (commence par > contient)
                            const sortedSuggestions = filteredSuggestions.sort((a, b) => {
                              const aFullName = `${a.prenom} ${a.nom}`.toLowerCase();
                              const bFullName = `${b.prenom} ${b.nom}`.toLowerCase();
                              
                              // Priorité aux noms qui commencent par la recherche
                              const aStartsWith = aFullName.startsWith(valueLower) ? 0 : 1;
                              const bStartsWith = bFullName.startsWith(valueLower) ? 0 : 1;
                              
                              if (aStartsWith !== bStartsWith) {
                                return aStartsWith - bStartsWith;
                              }
                              
                              // Ensuite, trier par ordre alphabétique
                              return aFullName.localeCompare(bFullName);
                            });
                            
                            // Limiter à 5 suggestions maximum
                            setSuggestions(sortedSuggestions.slice(0, 5));
                            setShowSuggestions(sortedSuggestions.length > 0);
                            
                            // Mettre à jour les élèves filtrés pour la compatibilité
                            setFilteredEleves(sortedSuggestions);
                          } else {
                            setSuggestions([]);
                            setShowSuggestions(false);
                            setFilteredEleves([]);
                          }
                        }}
                        placeholder="Nom, prénom, téléphone..."
                        className="w-full p-2 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                        onFocus={() => {
                          if (searchTerm.trim() !== '' && suggestions.length > 0) {
                            setShowSuggestions(true);
                          }
                        }}
                        onBlur={() => {
                          // Délai pour permettre la sélection d'une suggestion avant de fermer
                          setTimeout(() => setShowSuggestions(false), 200);
                        }}
                      />
                      
                      {isLoadingEleves && (
                        <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                        </div>
                      )}
                      
                      {/* Liste des suggestions */}
                      {showSuggestions && suggestions.length > 0 && (
                        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                          {suggestions.map((eleve) => (
                            <div 
                              key={eleve.id_eleve}
                              className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                              onClick={() => {
                                // Sélectionner l'élève
                                setSelectedEleveId(eleve.id_eleve);
                                setSearchTerm(`${eleve.prenom} ${eleve.nom}`);
                                setShowSuggestions(false);
                                
                                // Mettre à jour les données du formulaire avec l'élève sélectionné
                                setFormData({
                                  id_eleve: eleve.id_eleve,
                                  nom: eleve.nom,
                                  prenom: eleve.prenom,
                                  mail: eleve.mail || '',
                                  tel: eleve.tel || '',
                                  categorie: eleve.categorie || ''
                                });
                              }}
                            >
                              <div className="font-medium">{eleve.prenom} {eleve.nom}</div>
                              <div className="text-xs text-gray-500">
                                {eleve.categorie && <span className="mr-2">{eleve.categorie}</span>}
                                {eleve.tel && <span>{eleve.tel}</span>}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    {filteredEleves.length === 0 && searchTerm && (
                      <p className="text-xs text-amber-600 mt-1">Aucun élève trouvé. Essayez un autre terme ou la saisie manuelle.</p>
                    )}
                  </div>
                  
                  {/* Affichage des détails de l'élève sélectionné en lecture seule */}
                  {selectedEleveId && (
                    <div className="p-2 bg-white rounded-md border border-gray-200">
                      <h5 className="text-sm font-medium mb-1">Détails de l'élève</h5>
                      <div className="text-xs space-y-1">
                        <p><span className="font-medium">Nom:</span> {formData.nom}</p>
                        <p><span className="font-medium">Prénom:</span> {formData.prenom}</p>
                        {formData.mail && <p><span className="font-medium">Email:</span> {formData.mail}</p>}
                        {formData.tel && <p><span className="font-medium">Téléphone:</span> {formData.tel}</p>}
                        {formData.categorie && <p><span className="font-medium">Catégorie:</span> {formData.categorie}</p>}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-2">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Nom</label>
                    <input
                      type="text"
                      value={formData.nom}
                      onChange={(e) => setFormData({...formData, nom: e.target.value})}
                      className="w-full p-1 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Prénom</label>
                    <input
                      type="text"
                      value={formData.prenom}
                      onChange={(e) => setFormData({...formData, prenom: e.target.value})}
                      className="w-full p-1 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      value={formData.mail}
                      onChange={(e) => setFormData({...formData, mail: e.target.value})}
                      className="w-full p-1 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Téléphone</label>
                    <input
                      type="tel"
                      value={formData.tel}
                      onChange={(e) => setFormData({...formData, tel: e.target.value})}
                      className="w-full p-1 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Catégorie de permis</label>
                    <select
                      value={formData.categorie || ''}
                      onChange={(e) => setFormData({...formData, categorie: e.target.value})}
                      className="w-full p-1 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">-- Sélectionner --</option>
                      <option value="B">B - Voiture</option>
                      <option value="A">A - Moto</option>
                      <option value="A1">A1 - Moto légère</option>
                      <option value="A2">A2 - Moto intermédiaire</option>
                      <option value="AM">AM - Cyclomoteur</option>
                      <option value="C">C - Poids lourd</option>
                      <option value="D">D - Transport en commun</option>
                      <option value="E">E - Remorque</option>
                    </select>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-1">
              {planningDetails.eleves && (
                <>
                  <div className="text-sm font-medium">
                    {planningDetails.eleves.prenom} {planningDetails.eleves.nom}
                  </div>
                  {planningDetails.eleves.tel && (
                    <div className="text-sm">
                      <span className="text-gray-500">Tél: </span>
                      <a href={`tel:${planningDetails.eleves.tel}`} className="text-blue-500 hover:underline">
                        {planningDetails.eleves.tel}
                      </a>
                    </div>
                  )}
                  {planningDetails.eleves.mail && (
                    <div className="text-sm">
                      <span className="text-gray-500">Email: </span>
                      <a href={`mailto:${planningDetails.eleves.mail}`} className="text-blue-500 hover:underline">
                        {planningDetails.eleves.mail}
                      </a>
                    </div>
                  )}
                  {planningDetails.eleves.categorie && (
                    <div className="text-sm">
                      <span className="text-gray-500">Catégorie: </span>
                      <span className="font-medium">{planningDetails.eleves.categorie}</span>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="flex-1 min-w-[200px] p-3 bg-gray-50 rounded-md border border-gray-200">
          <div className="flex justify-between items-start mb-2">
            <h4 className="font-medium flex items-center text-gray-700">
              <FiUser className="mr-2" /> Élève
            </h4>
            <button
              onClick={() => setIsEditing(true)}
              className="p-1 text-blue-500 hover:text-blue-700 transition-colors"
              title="Ajouter un élève"
            >
              <FiEdit size={16} />
            </button>
          </div>
          <p className="text-sm text-gray-500 italic">Aucun élève associé</p>
        </div>
      )}
    </>
  );
}
