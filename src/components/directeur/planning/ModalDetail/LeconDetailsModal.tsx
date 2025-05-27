'use client';

import { useState } from 'react';
import { Lecon } from '../PlanningGrid';

// Fonction utilitaire pour formater une heure au format HH:MM:SS en HH:MM
const formatTimeToHHMM = (time: string): string => {
  // Si le format est déjà HH:MM, on le retourne tel quel
  if (time.length === 5) return time;
  
  // Sinon on extrait les heures et minutes
  const [hours, minutes] = time.split(':');
  return `${hours}:${minutes}`;
};

interface LeconDetailsModalProps {
  lecon: Lecon;
  onClose: () => void;
  onUpdate?: (lecon: Lecon, action: 'cancel' | 'complete' | 'edit') => Promise<void>;
}

export default function LeconDetailsModal({ lecon, onClose, onUpdate }: LeconDetailsModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'details' | 'edit' | 'comments'>('details');
  const [commentaire, setCommentaire] = useState(lecon.commentaire || '');
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [showCompleteConfirm, setShowCompleteConfirm] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  
  // Fonction pour gérer l'annulation d'une leçon
  const handleCancel = async () => {
    if (!onUpdate) return;
    
    setIsLoading(true);
    try {
      const updatedLecon = {
        ...lecon,
        statut_lecon: 'Annulée',
        commentaire: commentaire + (cancelReason ? `\n[Motif d'annulation: ${cancelReason}]` : '')
      };
      
      await onUpdate(updatedLecon, 'cancel');
      setShowCancelConfirm(false);
      onClose();
    } catch (error) {
      console.error('Erreur lors de l\'annulation de la leçon:', error);
      alert('Erreur lors de l\'annulation de la leçon');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Fonction pour marquer une leçon comme réalisée
  const handleComplete = async () => {
    if (!onUpdate) return;
    
    setIsLoading(true);
    try {
      const updatedLecon = {
        ...lecon,
        statut_lecon: 'Réalisée',
        commentaire: commentaire
      };
      
      await onUpdate(updatedLecon, 'complete');
      setShowCompleteConfirm(false);
      onClose();
    } catch (error) {
      console.error('Erreur lors de la validation de la leçon:', error);
      alert('Erreur lors de la validation de la leçon');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Fonction pour sauvegarder les commentaires
  const handleSaveComments = async () => {
    if (!onUpdate) return;
    
    setIsLoading(true);
    try {
      const updatedLecon = {
        ...lecon,
        commentaire: commentaire
      };
      
      await onUpdate(updatedLecon, 'edit');
      setActiveTab('details');
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des commentaires:', error);
      alert('Erreur lors de la sauvegarde des commentaires');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Déterminer si la leçon peut être annulée ou marquée comme réalisée
  const canCancel = lecon.statut_lecon !== 'Annulée' && lecon.statut_lecon !== 'Réalisée';
  const canComplete = lecon.statut_lecon !== 'Réalisée';
  
  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-2xl w-full border border-gray-200" onClick={e => e.stopPropagation()}>
        {/* En-tête avec titre et bouton de fermeture */}
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">
            {showCancelConfirm ? 'Annuler la leçon' : 
             showCompleteConfirm ? 'Marquer comme réalisée' : 
             'Détails de la leçon'}
          </h3>
          <button 
            className="text-gray-400 hover:text-gray-600 transition-colors"
            onClick={onClose}
            disabled={isLoading}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Onglets de navigation */}
        {!showCancelConfirm && !showCompleteConfirm && (
          <div className="flex border-b border-gray-200 mb-4">
            <button
              className={`px-4 py-2 font-medium ${activeTab === 'details' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab('details')}
            >
              Détails
            </button>
            <button
              className={`px-4 py-2 font-medium ${activeTab === 'comments' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab('comments')}
            >
              Commentaires
            </button>
          </div>
        )}
        
        {/* Contenu principal */}
        {showCancelConfirm ? (
          <div className="space-y-4">
            <p className="text-gray-700">Voulez-vous vraiment annuler cette leçon ?</p>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Motif d'annulation
              </label>
              <select
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Sélectionner un motif</option>
                <option value="Absence élève">Absence élève</option>
                <option value="Absence moniteur">Absence moniteur</option>
                <option value="Problème véhicule">Problème véhicule</option>
                <option value="Météo">Météo</option>
                <option value="Autre">Autre</option>
              </select>
            </div>
            
            <div className="flex justify-end space-x-2">
              <button
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors font-medium"
                onClick={() => setShowCancelConfirm(false)}
                disabled={isLoading}
              >
                Retour
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors font-medium flex items-center"
                onClick={handleCancel}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Annulation...
                  </>
                ) : 'Confirmer l\'annulation'}
              </button>
            </div>
          </div>
        ) : showCompleteConfirm ? (
          <div className="space-y-4">
            <p className="text-gray-700">Voulez-vous marquer cette leçon comme réalisée ?</p>
            
            <div className="flex justify-end space-x-2">
              <button
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors font-medium"
                onClick={() => setShowCompleteConfirm(false)}
                disabled={isLoading}
              >
                Retour
              </button>
              <button
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors font-medium flex items-center"
                onClick={handleComplete}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Validation...
                  </>
                ) : 'Confirmer'}
              </button>
            </div>
          </div>
        ) : activeTab === 'details' ? (
          <div className="space-y-4">
            {/* Informations sur le moniteur */}
            <div className="flex items-center space-x-2 mb-4 bg-blue-50 p-3 rounded-md">
              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium">
                {lecon.id_moniteur ? `M${lecon.id_moniteur}` : 'M'}
              </div>
              <div>
                <p className="font-medium">Moniteur #{lecon.id_moniteur}</p>
                <p className="text-sm text-gray-500">
                  {new Date(lecon.date).toLocaleDateString('fr-FR', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                </p>
              </div>
            </div>
            
            {/* Détails de la leçon */}
            <div className="space-y-4 bg-white p-4 rounded-md border border-gray-200">
              <div className="flex items-center">
                <span className="text-gray-500 w-28 flex-shrink-0">Horaire:</span> 
                <span className="font-medium">{formatTimeToHHMM(lecon.heure_debut)} - {formatTimeToHHMM(lecon.heure_fin)}</span>
              </div>
              <div className="flex items-center">
                <span className="text-gray-500 w-28 flex-shrink-0">Type:</span> 
                <span className="font-medium">{lecon.type_lecon}</span>
              </div>
              <div className="flex items-center">
                <span className="text-gray-500 w-28 flex-shrink-0">Statut:</span> 
                <span className="font-medium px-2 py-1 rounded-full text-xs" 
                  style={{
                    backgroundColor: lecon.statut_lecon === 'Annulée' ? '#FEE2E2' : 
                                    lecon.statut_lecon === 'Réalisée' ? '#D1FAE5' : '#E0F2FE',
                    color: lecon.statut_lecon === 'Annulée' ? '#B91C1C' : 
                           lecon.statut_lecon === 'Réalisée' ? '#065F46' : '#0369A1'
                  }}>
                  {lecon.statut_lecon}
                </span>
              </div>
              
              {/* Informations sur l'élève */}
              {lecon.eleves && (
                <div className="mt-4 p-3 bg-gray-50 rounded-md">
                  <h4 className="font-medium mb-2">Informations élève</h4>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <span className="text-gray-500 w-28 flex-shrink-0">Nom:</span> 
                      <span className="font-medium">{lecon.eleves.prenom} {lecon.eleves.nom}</span>
                    </div>
                    {lecon.eleves.tel && (
                      <div className="flex items-center">
                        <span className="text-gray-500 w-28 flex-shrink-0">Téléphone:</span>
                        <a href={`tel:${lecon.eleves.tel}`} className="text-blue-600 hover:underline">{lecon.eleves.tel}</a>
                      </div>
                    )}
                    {lecon.eleves.categorie && (
                      <div className="flex items-center">
                        <span className="text-gray-500 w-28 flex-shrink-0">Catégorie:</span>
                        <span>{lecon.eleves.categorie}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {/* Commentaires (affichage) */}
              {lecon.commentaire && (
                <div className="mt-4 p-3 bg-gray-50 rounded-md">
                  <h4 className="font-medium mb-2">Commentaires</h4>
                  <p className="text-gray-700 whitespace-pre-line">{lecon.commentaire}</p>
                </div>
              )}
            </div>
          </div>
        ) : activeTab === 'comments' && (
          <div className="space-y-4">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Commentaires
              </label>
              <textarea
                value={commentaire}
                onChange={(e) => setCommentaire(e.target.value)}
                rows={5}
                className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                placeholder="Ajouter des notes ou commentaires..."
              />
            </div>
            
            <div className="flex justify-end">
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium flex items-center"
                onClick={handleSaveComments}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Enregistrement...
                  </>
                ) : 'Enregistrer'}
              </button>
            </div>
          </div>
        )}
        
        {/* Boutons d'action */}
        {!showCancelConfirm && !showCompleteConfirm && activeTab === 'details' && onUpdate && (
          <div className="mt-6 flex justify-between">
            <div className="space-x-2">
              {canCancel && (
                <button
                  className="px-4 py-2 bg-red-50 text-red-600 rounded-md hover:bg-red-100 transition-colors font-medium"
                  onClick={() => setShowCancelConfirm(true)}
                  disabled={isLoading}
                >
                  Annuler la leçon
                </button>
              )}
              {canComplete && (
                <button
                  className="px-4 py-2 bg-green-50 text-green-600 rounded-md hover:bg-green-100 transition-colors font-medium"
                  onClick={() => setShowCompleteConfirm(true)}
                  disabled={isLoading}
                >
                  Marquer comme réalisée
                </button>
              )}
            </div>
            <button
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors font-medium"
              onClick={onClose}
              disabled={isLoading}
            >
              Fermer
            </button>
          </div>
        )}
        
        {!showCancelConfirm && !showCompleteConfirm && activeTab === 'comments' && !onUpdate && (
          <div className="mt-6 flex justify-end">
            <button
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors font-medium"
              onClick={onClose}
              disabled={isLoading}
            >
              Fermer
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
