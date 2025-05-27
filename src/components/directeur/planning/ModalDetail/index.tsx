'use client';

import React, { useState, useEffect } from 'react';
import { Lecon } from '../PlanningGrid';
import TabSelector from './TabSelector';
import DetailsView from './DetailsView';
import CommentsEditor from './CommentsEditor';
import CancelConfirm from './CancelConfirm';
import CompleteConfirm from './CompleteConfirm';
import ActionButtons from './ActionButtons';
import { 
  LeconDetailsModalProps, 
  DetailTab, 
  UpdateAction,
  CancelReason
} from './types';

export default function LeconDetailsModal({ 
  lecon, 
  onClose, 
  onUpdate,
  showModal
}: LeconDetailsModalProps) {
  // États
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<DetailTab>('details');
  const [commentaire, setCommentaire] = useState('');
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [showCompleteConfirm, setShowCompleteConfirm] = useState(false);
  const [cancelReason, setCancelReason] = useState<CancelReason>('');
  
  // Initialiser le commentaire à partir de la leçon
  useEffect(() => {
    if (lecon && lecon.commentaire) {
      setCommentaire(lecon.commentaire);
    } else {
      setCommentaire('');
    }
  }, [lecon]);
  
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
      
      // Rafraîchir la page pour voir les changements
      window.location.reload();
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
      
      // Rafraîchir la page pour voir les changements
      window.location.reload();
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
  const canCancel = lecon?.statut_lecon !== 'Annulée' && lecon?.statut_lecon !== 'Réalisée';
  const canComplete = lecon?.statut_lecon !== 'Réalisée';
  
  // Si la modale n'est pas visible, ne rien afficher
  if (!showModal) return null;
  
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
          <TabSelector
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
        )}
        
        {/* Contenu principal */}
        {showCancelConfirm ? (
          <CancelConfirm
            onCancel={handleCancel}
            onBack={() => setShowCancelConfirm(false)}
            cancelReason={cancelReason}
            onCancelReasonChange={setCancelReason}
            isLoading={isLoading}
          />
        ) : showCompleteConfirm ? (
          <CompleteConfirm
            onComplete={handleComplete}
            onBack={() => setShowCompleteConfirm(false)}
            isLoading={isLoading}
          />
        ) : activeTab === 'details' ? (
          <DetailsView lecon={lecon} />
        ) : activeTab === 'comments' ? (
          <CommentsEditor
            commentaire={commentaire}
            onChange={setCommentaire}
            onSave={handleSaveComments}
            isLoading={isLoading}
          />
        ) : (
          <div className="p-4 bg-gray-50 rounded-md">
            <p className="text-gray-500 text-center">Historique non disponible pour le moment</p>
          </div>
        )}
        
        {/* Boutons d'action */}
        {!showCancelConfirm && !showCompleteConfirm && activeTab === 'details' && onUpdate && (
          <ActionButtons
            canCancel={canCancel}
            canComplete={canComplete}
            onCancelClick={() => setShowCancelConfirm(true)}
            onCompleteClick={() => setShowCompleteConfirm(true)}
            onClose={onClose}
            isLoading={isLoading}
          />
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
