'use client';

import React, { useState, useEffect } from 'react';
import { FiX } from 'react-icons/fi';
import InfoPerso from './components/InfoPerso';
import InfoContact from './components/InfoContact';
import InfoAdmin from './components/InfoAdmin';
import InfoFormation from './components/InfoFormation';
import InfoHistorique from './components/InfoHistorique';
import InfoDocuments from './components/InfoDocuments';
import { getEleveById, updateEleve, Eleve } from './api/eleveApi';

interface EleveDetailModalProps {
  showModal: boolean;
  onClose: () => void;
  eleveId: number;
}

export default function EleveDetailModal({ 
  showModal, 
  onClose, 
  eleveId 
}: EleveDetailModalProps) {
  // États pour les données et le chargement
  const [eleve, setEleve] = useState<Eleve | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Récupérer les données de l'élève
  useEffect(() => {
    const fetchEleveDetails = async () => {
      if (!eleveId) return;
      
      try {
        setLoading(true);
        setError(null);
        
        // Utiliser la fonction API getEleveById
        const data = await getEleveById(eleveId);
        setEleve(data);
      } catch (err) {
        console.error('Erreur lors de la récupération des détails de l\'élève:', err);
        setError('Impossible de charger les détails de l\'élève. Veuillez réessayer.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchEleveDetails();
  }, [eleveId]);
  
  // Si la modale n'est pas visible, ne rien afficher
  if (!showModal) return null;
  
  return (
    <>
      {/* Fond semi-transparent avec effet de flou */}
      <div 
        className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50 text-gray-800" 
        onClick={onClose}
      >
        {/* Conteneur principal avec bordure arrondie et ombre */}
        <div 
          className="bg-white rounded-lg shadow-xl p-0 max-w-4xl w-full border border-gray-200 max-h-[90vh] overflow-hidden flex flex-col" 
          onClick={e => e.stopPropagation()}
        >
          {/* En-tête avec titre et bouton de fermeture */}
          <div className="flex justify-between items-center p-4 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center">
              <h3 className="text-xl font-semibold">Détails de l'élève</h3>
            </div>
            <button 
              className="text-gray-400 hover:text-gray-600 transition-colors p-2 rounded-full hover:bg-gray-100"
              onClick={onClose}
              aria-label="Fermer"
            >
              <FiX className="h-6 w-6" />
            </button>
          </div>
          
          {/* Contenu principal avec défilement */}
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
            
            {/* Contenu des détails de l'élève */}
            <div className="space-y-6">
              {/* Première rangée - Informations personnelles et Coordonnées */}
              <div className="flex flex-wrap gap-4">
                {/* Section Informations personnelles */}
                <InfoPerso 
                  eleve={eleve} 
                  loading={loading} 
                  onSave={async (updatedEleve: Eleve) => {
                    try {
                      setLoading(true);
                      setError(null);
                      
                      // Utiliser la fonction API updateEleve
                      const data = await updateEleve(eleveId, updatedEleve);
                      setEleve(data);
                      
                      return Promise.resolve();
                    } catch (err) {
                      console.error('Erreur lors de la mise à jour des détails de l\'élève:', err);
                      setError('Impossible de mettre à jour les détails de l\'élève. Veuillez réessayer.');
                      return Promise.reject(err);
                    } finally {
                      setLoading(false);
                    }
                  }}
                />
                
                {/* Section Coordonnées */}
                <InfoContact 
                  eleve={eleve} 
                  loading={loading} 
                  onSave={async (updatedEleve: Eleve) => {
                    try {
                      setLoading(true);
                      setError(null);
                      
                      // Utiliser la fonction API updateEleve
                      const data = await updateEleve(eleveId, updatedEleve);
                      setEleve(data);
                      
                      return Promise.resolve();
                    } catch (err) {
                      console.error('Erreur lors de la mise à jour des coordonnées de l\'élève:', err);
                      setError('Impossible de mettre à jour les coordonnées de l\'élève. Veuillez réessayer.');
                      return Promise.reject(err);
                    } finally {
                      setLoading(false);
                    }
                  }}
                />
              </div>
              
              {/* Deuxième rangée - Informations administratives et Formation */}
              <div className="flex flex-wrap gap-4">
                {/* Section Informations administratives */}
                <InfoAdmin 
                  eleve={eleve} 
                  loading={loading} 
                  onSave={async (updatedEleve: Eleve) => {
                    try {
                      setLoading(true);
                      setError(null);
                      
                      // Utiliser la fonction API updateEleve
                      const data = await updateEleve(eleveId, updatedEleve);
                      setEleve(data);
                      
                      return Promise.resolve();
                    } catch (err) {
                      console.error('Erreur lors de la mise à jour des informations administratives:', err);
                      setError('Impossible de mettre à jour les informations administratives. Veuillez réessayer.');
                      return Promise.reject(err);
                    } finally {
                      setLoading(false);
                    }
                  }}
                />
                
                {/* Section Formation */}
                <InfoFormation 
                  eleve={eleve} 
                  loading={loading} 
                  onSave={async (updatedEleve: Eleve) => {
                    try {
                      setLoading(true);
                      setError(null);
                      
                      // Utiliser la fonction API updateEleve
                      const data = await updateEleve(eleveId, updatedEleve);
                      setEleve(data);
                      
                      return Promise.resolve();
                    } catch (err) {
                      console.error('Erreur lors de la mise à jour des informations de formation:', err);
                      setError('Impossible de mettre à jour les informations de formation. Veuillez réessayer.');
                      return Promise.reject(err);
                    } finally {
                      setLoading(false);
                    }
                  }}
                />
              </div>
              
              {/* Troisième rangée - Historique et Documents */}
              <div className="flex flex-wrap gap-4">
                {/* Section Documents */}
                <InfoDocuments 
                  eleve={eleve} 
                  loading={loading} 
                />
                {/* Section Historique */}
                <InfoHistorique 
                  eleve={eleve} 
                  loading={loading} 
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
