'use client';

import React, { useState, useEffect } from 'react';
import { Lecon } from '../PlanningGrid';
import { FiMail, FiClock, FiCalendar, FiUser, FiTruck, FiMapPin, FiFileText, FiAlertCircle, FiEdit } from 'react-icons/fi';
import SendMessage from './SendMessage';
import DateEtHoraires from './DateEtHoraires';
import Vehicule from './Vehicule';
import Eleve from './Eleve';
import Moniteur from './Moniteur';
import { PlanningDetails } from './types';

interface LeconDetailsModalProps {
  lecon: Lecon;
  onClose: () => void;
  onUpdate?: (lecon: Lecon, action: 'cancel' | 'complete' | 'edit') => Promise<void>;
  showModal: boolean;
}

// L'interface PlanningDetails est maintenant importée depuis le fichier types.ts

export default function LeconDetailsModal({ 
  lecon, 
  onClose, 
  onUpdate,
  showModal
}: LeconDetailsModalProps) {
  const [planningDetails, setPlanningDetails] = useState<PlanningDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [commentaire, setCommentaire] = useState<string>('');
  const [isEditingComment, setIsEditingComment] = useState<boolean>(false);
  const [isEditingDetails, setIsEditingDetails] = useState<boolean>(false);
  
  // Fonction pour annuler une leçon
  const handleCancel = async () => {
    if (!planningDetails) return;
    
    if (window.confirm('Êtes-vous sûr de vouloir annuler cette leçon ?')) {
      try {
        const response = await fetch('/directeur/planning/api/ModalDetail', {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id_planning: planningDetails.id_planning,
            statut_lecon: 'Annulée'
          }),
        });
        
        if (!response.ok) {
          throw new Error(`Erreur lors de l'annulation: ${response.status}`);
        }
        
        const updatedPlanning = await response.json();
        setPlanningDetails(updatedPlanning);
        
        if (onUpdate && lecon) {
          await onUpdate({
            ...lecon,
            statut_lecon: 'Annulée'
          }, 'cancel');
        }
      } catch (err) {
        console.error('Erreur lors de l\'annulation de la leçon:', err);
        setError('Impossible d\'annuler la leçon. Veuillez réessayer.');
      }
    }
  };
  
  // Fonction pour terminer une leçon
  const handleComplete = async () => {
    if (!planningDetails) return;
    
    if (window.confirm('Confirmer que cette leçon est terminée ?')) {
      try {
        const response = await fetch('/directeur/planning/api/ModalDetail', {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id_planning: planningDetails.id_planning,
            statut_lecon: 'Terminée'
          }),
        });
        
        if (!response.ok) {
          throw new Error(`Erreur lors de la mise à jour: ${response.status}`);
        }
        
        const updatedPlanning = await response.json();
        setPlanningDetails(updatedPlanning);
        
        if (onUpdate && lecon) {
          await onUpdate({
            ...lecon,
            statut_lecon: 'Terminée'
          }, 'complete');
        }
      } catch (err) {
        console.error('Erreur lors de la mise à jour de la leçon:', err);
        setError('Impossible de mettre à jour la leçon. Veuillez réessayer.');
      }
    }
  };
  
  // Fonction pour mettre à jour le commentaire
  const handleSaveComment = async () => {
    if (!planningDetails) return;
    
    try {
      const response = await fetch('/directeur/planning/api/ModalDetail', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id_planning: planningDetails.id_planning,
          commentaire: commentaire
        }),
      });
      
      if (!response.ok) {
        throw new Error(`Erreur lors de la mise à jour: ${response.status}`);
      }
      
      const updatedPlanning = await response.json();
      setPlanningDetails(updatedPlanning);
      setIsEditingComment(false);
      
      if (onUpdate && lecon) {
        await onUpdate({
          ...lecon,
          commentaire: commentaire
        }, 'edit');
      }
    } catch (err) {
      console.error('Erreur lors de la mise à jour du commentaire:', err);
      setError('Impossible de mettre à jour le commentaire. Veuillez réessayer.');
    }
  };
  
  // Fonction pour sauvegarder les modifications des détails de la leçon
  const handleSaveDetails = async (updatedDetails: PlanningDetails) => {
    try {
      const response = await fetch('/directeur/planning/api/ModalDetail', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id_planning: updatedDetails.id_planning,
          date: updatedDetails.date,
          heure_debut: updatedDetails.heure_debut,
          heure_fin: updatedDetails.heure_fin,
          type_lecon: updatedDetails.type_lecon,
          commentaire: updatedDetails.commentaire,
          id_moniteur: updatedDetails.id_moniteur,
          id_eleve: updatedDetails.id_eleve,
          id_vehicule: updatedDetails.id_vehicule
        }),
      });
      
      if (!response.ok) {
        throw new Error(`Erreur lors de la mise à jour: ${response.status}`);
      }
      
      const updatedPlanning = await response.json();
      setPlanningDetails(updatedPlanning);
      setIsEditingDetails(false);
      
      if (onUpdate && lecon) {
        await onUpdate({
          ...lecon,
          date: updatedDetails.date,
          heure_debut: updatedDetails.heure_debut,
          heure_fin: updatedDetails.heure_fin,
          type_lecon: updatedDetails.type_lecon || "",  // Convertir null en chaîne vide
          commentaire: updatedDetails.commentaire || ""  // Convertir null en chaîne vide
        }, 'edit');
      }
    } catch (err) {
      console.error('Erreur lors de la mise à jour des détails:', err);
      throw new Error('Impossible de mettre à jour les détails. Veuillez réessayer.');
    }
  };
  
  // Initialiser le commentaire quand les détails sont chargés
  useEffect(() => {
    if (planningDetails) {
      setCommentaire(planningDetails.commentaire || '');
    }
  }, [planningDetails]);

  useEffect(() => {
    // Fonction pour récupérer les détails du planning
    const fetchPlanningDetails = async () => {
      if (!lecon?.id_planning || !showModal) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const response = await fetch(`/directeur/planning/api/ModalDetail?id_planning=${lecon.id_planning}`);
        
        if (!response.ok) {
          throw new Error(`Erreur lors de la récupération des détails: ${response.status}`);
        }
        
        const data = await response.json();
        setPlanningDetails(data);
        
        // Initialiser le commentaire s'il existe
        if (data.commentaire) {
          setCommentaire(data.commentaire);
        } else {
          setCommentaire('');
        }
      } catch (err) {
        console.error('Erreur lors de la récupération des détails du planning:', err);
        setError('Impossible de récupérer les détails du planning. Veuillez réessayer.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchPlanningDetails();
  }, [lecon?.id_planning, showModal]);
  
  // Fonction pour formater une date
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };
  
  // Fonction pour formater une heure
  const formatTime = (timeStr: string) => {
    if (!timeStr) return '';
    // Si le format est déjà HH:MM, on le retourne tel quel
    if (timeStr.length === 5) return timeStr;
    
    // Sinon on extrait les heures et minutes
    const [hours, minutes] = timeStr.split(':');
    return `${hours}:${minutes}`;
  };
  
  // Si la modale n'est pas visible, ne rien afficher
  if (!showModal) return null;
  
  // Log pour déboguer le rendu
  console.log('Rendu de LeconDetailsModal, isEditingDetails:', isEditingDetails);
  console.log('planningDetails existe:', !!planningDetails);
  
  return (
    <>
      {/* Modale principale */}
      <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl p-0 max-w-4xl w-full border border-gray-200 max-h-[90vh] overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>
        {/* En-tête avec titre, statut et bouton de fermeture */}
        <div className="flex justify-between items-center p-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center">
            <h3 className="text-xl font-semibold">Détails de la leçon</h3>
            {planningDetails && (
              <div className={`ml-3 px-2 py-1 rounded text-sm font-medium ${
                planningDetails.statut_lecon === 'Prévue' ? 'bg-blue-100 text-blue-800' :
                planningDetails.statut_lecon === 'Terminée' ? 'bg-green-100 text-green-800' :
                planningDetails.statut_lecon === 'Annulée' ? 'bg-red-100 text-red-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {planningDetails.statut_lecon}
              </div>
            )}
          </div>
          <button 
            className="text-gray-400 hover:text-gray-600 transition-colors p-2 rounded-full hover:bg-gray-100"
            onClick={onClose}
            aria-label="Fermer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Barre d'actions rapides */}
        {planningDetails && planningDetails.statut_lecon !== 'Annulée' && planningDetails.statut_lecon !== 'Terminée' && (
          <div className="flex items-center justify-between p-3 bg-gray-100 border-b border-gray-200">
            <div className="flex space-x-2">
              {planningDetails.eleves?.tel && (
                <SendMessage
                  phoneNumber={planningDetails.eleves.tel}
                  label="Envoyer un message"
                  leconDetails={{
                    date: planningDetails.date ? formatDate(planningDetails.date) : undefined,
                    heure: planningDetails.heure_debut ? formatTime(planningDetails.heure_debut) : undefined,
                    moniteur: planningDetails.enseignants ? `${planningDetails.enseignants.prenom} ${planningDetails.enseignants.nom}` : undefined,
                    type: planningDetails.type_lecon || undefined
                  }}
                />
              )}
              {planningDetails.eleves?.mail && (
                <a 
                  href={`mailto:${planningDetails.eleves.mail}`} 
                  className="flex items-center px-3 py-1.5 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                  title="Envoyer un email à l'élève"
                >
                  <FiMail className="mr-1" /> Email
                </a>
              )}
            </div>
            <div className="flex space-x-2">
              <button 
                onClick={() => {
                  console.log('Bouton Modifier cliqué');
                  console.log('isEditingDetails avant:', isEditingDetails);
                  setIsEditingDetails(true);
                  console.log('isEditingDetails après:', true);
                }} 
                className="flex items-center px-3 py-1.5 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
              >
                <FiEdit className="mr-1" /> Modifier
              </button>
              <button 
                onClick={handleCancel} 
                className="flex items-center px-3 py-1.5 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
              >
                <FiAlertCircle className="mr-1" /> Annuler
              </button>
            </div>
          </div>
        )}
        
        <div className="overflow-y-auto p-4 flex-grow">
          {/* Affichage du chargement */}
          {loading && (
            <div className="flex justify-center items-center p-8">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          )}
          
          {/* Affichage de l'erreur */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
        
        {/* Affichage des détails du planning */}
        {!loading && !error && planningDetails && (
          <div>
            {/* Mode édition des commentaires */}
            {isEditingComment ? (
              <div className="p-4 border-b border-gray-200">
                <h4 className="font-medium mb-2 flex items-center">
                  <FiFileText className="mr-2" /> Modifier les commentaires
                </h4>
                <textarea
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={4}
                  value={commentaire}
                  onChange={(e) => setCommentaire(e.target.value)}
                  placeholder="Ajoutez vos commentaires ici..."
                />
                <div className="flex justify-end mt-2 space-x-2">
                  <button
                    onClick={() => setIsEditingComment(false)}
                    className="px-3 py-1.5 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={handleSaveComment}
                    className="px-3 py-1.5 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                  >
                    Enregistrer
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4 p-4">
                {/* Informations principales - Date, heure et statut */}
                <div className="flex flex-wrap gap-4 mb-4">
                  <DateEtHoraires 
                    planningDetails={planningDetails}
                    onSave={handleSaveDetails}
                    formatDate={formatDate}
                    formatTime={formatTime}
                  />
                  
                  {/* Informations véhicule */}
                  <Vehicule planningDetails={planningDetails} onSave={handleSaveDetails} />
                </div>
                
                {/* Deuxième rangée - Élève et moniteur */}
                <div className="flex flex-wrap gap-4 mb-4">
                  <Eleve planningDetails={planningDetails} onSave={handleSaveDetails} />
                  
                  {/* Informations moniteur */}
                  <Moniteur 
                    planningDetails={planningDetails}
                    onSave={handleSaveDetails}
                  />
                </div>
                
                {/* Informations administratives */}
                {(planningDetails.auto_ecole || planningDetails.bureau) && (
                  <div className="p-3 bg-gray-50 rounded-md border border-gray-200">
                    <div className="flex items-center mb-2">
                      <FiMapPin className="text-gray-500 mr-2" />
                      <h4 className="font-medium">Informations administratives</h4>
                    </div>
                    <div className="flex flex-wrap gap-4">
                      {planningDetails.auto_ecole && (
                        <div className="text-sm">
                          <span className="text-gray-500">Auto-école: </span>
                          <span className="font-medium">{planningDetails.auto_ecole.nom}</span>
                        </div>
                      )}
                      {planningDetails.bureau && (
                        <div className="text-sm">
                          <span className="text-gray-500">Bureau: </span>
                          <span className="font-medium">{planningDetails.bureau.nom}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                
                {/* Commentaires */}
                <div className="p-3 bg-gray-50 rounded-md border border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <FiFileText className="text-gray-500 mr-2" />
                      <h4 className="font-medium">Commentaires</h4>
                    </div>
                    <button 
                      onClick={() => setIsEditingComment(true)}
                      className="text-xs px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                    >
                      Modifier
                    </button>
                  </div>
                  {planningDetails.commentaire ? (
                    <p className="text-sm text-gray-700 whitespace-pre-line">{planningDetails.commentaire}</p>
                  ) : (
                    <p className="text-sm text-gray-500 italic">Aucun commentaire</p>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
    </div>
    </>
  );
}
