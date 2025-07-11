'use client';

import React, { useState, useEffect } from 'react';
import { FiClock, FiCalendar, FiDollarSign, FiUser, FiTag, FiMessageSquare, FiCreditCard } from 'react-icons/fi';
import { Eleve } from '../api/eleveApi';
import { Lecon, Paiement, getDernieresLecons, getDerniersPaiements } from '../api/historiqueApi';

interface InfoHistoriqueProps {
  eleve: Eleve | null;
  loading: boolean;
}

export default function InfoHistorique({ eleve, loading }: InfoHistoriqueProps) {
  // États pour les données d'historique
  const [lecons, setLecons] = useState<Lecon[]>([]);
  const [paiements, setPaiements] = useState<Paiement[]>([]);
  const [isLoadingLecons, setIsLoadingLecons] = useState<boolean>(false);
  const [isLoadingPaiements, setIsLoadingPaiements] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  // Fonction pour formater une date
  const formatDate = (dateString: string) => {
    if (!dateString) return 'Non renseignée';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return dateString;
    }
  };
  
  // Fonction pour formater un montant en euros
  const formatMontant = (montant: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(montant);
  };
  
  // Fonction pour déterminer la couleur du badge de statut pour les leçons
  const getLeconStatusColor = (status: string) => {
    if (!status) return 'bg-gray-100 text-gray-800';
    
    const statusLower = status.toLowerCase();
    
    if (statusLower.includes('effectu') || statusLower.includes('termin')) {
      return 'bg-green-100 text-green-800';
    } else if (statusLower.includes('annul')) {
      return 'bg-red-100 text-red-800';
    } else if (statusLower.includes('prévue') || statusLower.includes('prevue') || 
              statusLower.includes('planifi') || statusLower.includes('venir')) {
      return 'bg-blue-100 text-blue-800';
    } else if (statusLower.includes('cours')) {
      return 'bg-yellow-100 text-yellow-800';
    } else {
      return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Fonction pour déterminer la couleur du badge de statut pour les paiements
  const getPaiementTypeColor = (type: string) => {
    if (!type) return 'bg-gray-100 text-gray-800';
    
    const typeLower = type.toLowerCase();
    
    if (typeLower.includes('cb') || typeLower.includes('carte')) {
      return 'bg-blue-100 text-blue-800';
    } else if (typeLower.includes('espèce') || typeLower.includes('espece') || typeLower.includes('cash')) {
      return 'bg-green-100 text-green-800';
    } else if (typeLower.includes('chèque') || typeLower.includes('cheque')) {
      return 'bg-yellow-100 text-yellow-800';
    } else if (typeLower.includes('virement')) {
      return 'bg-purple-100 text-purple-800';
    } else {
      return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Charger les données d'historique lorsque l'élève change
  useEffect(() => {
    const fetchHistorique = async () => {
      if (!eleve?.id_eleve) return;
      
      try {
        // Récupérer les dernières leçons
        setIsLoadingLecons(true);
        setError(null);
        const leconData = await getDernieresLecons(eleve.id_eleve);
        setLecons(leconData);
      } catch (err) {
        console.error('Erreur lors de la récupération des leçons:', err);
        setError('Impossible de charger l\'historique des leçons.');
      } finally {
        setIsLoadingLecons(false);
      }
      
      try {
        // Récupérer les derniers paiements
        setIsLoadingPaiements(true);
        const paiementData = await getDerniersPaiements(eleve.id_eleve);
        setPaiements(paiementData);
      } catch (err) {
        console.error('Erreur lors de la récupération des paiements:', err);
        if (!error) {
          setError('Impossible de charger l\'historique des paiements.');
        }
      } finally {
        setIsLoadingPaiements(false);
      }
    };
    
    fetchHistorique();
  }, [eleve]);
  
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
          <FiClock className="text-blue-500" />
          <h3 className="font-medium">Historique</h3>
        </div>
      </div>
      
      {/* Contenu de la section */}
      <div className="p-4">
        {error && (
          <div className="mb-4 p-2 bg-red-50 text-red-700 text-sm rounded-md">
            {error}
          </div>
        )}
        
        <div className="space-y-6">
          {/* Dernières leçons */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
              <FiCalendar className="mr-2 text-gray-500" />
              Dernières leçons
            </h4>
            
            {isLoadingLecons ? (
              <div className="flex justify-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
              </div>
            ) : lecons.length === 0 ? (
              <p className="text-sm text-gray-500 italic">Aucune leçon enregistrée</p>
            ) : (
              <div className="space-y-3">
                {lecons.map((lecon) => (
                  <div key={lecon.id_planning} className="border border-gray-100 rounded-md p-3 hover:bg-gray-50 transition-colors">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center mb-1">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLeconStatusColor(lecon.statut_lecon)}`}>
                            {lecon.statut_lecon || 'Non défini'}
                          </span>
                          <span className="ml-2 text-xs text-gray-500">{lecon.type_lecon}</span>
                        </div>
                        <p className="text-sm font-medium">
                          {formatDate(`${lecon.date}T${lecon.heure_debut}`)} - {formatDate(`${lecon.date}T${lecon.heure_fin}`).split(' ')[1]}
                        </p>
                      </div>
                      <div className="flex items-center text-xs text-gray-500">
                        <FiUser className="mr-1" />
                        <span>{lecon.prenom_moniteur} {lecon.nom_moniteur}</span>
                      </div>
                    </div>
                    {lecon.commentaire && (
                      <div className="mt-2 flex items-start">
                        <FiMessageSquare className="text-gray-400 mt-1 mr-1 flex-shrink-0" size={14} />
                        <p className="text-xs text-gray-600">{lecon.commentaire}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Derniers paiements */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
              <FiDollarSign className="mr-2 text-gray-500" />
              Derniers paiements
            </h4>
            
            {isLoadingPaiements ? (
              <div className="flex justify-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
              </div>
            ) : paiements.length === 0 ? (
              <p className="text-sm text-gray-500 italic">Aucun paiement enregistré</p>
            ) : (
              <div className="space-y-3">
                {paiements.map((paiement) => (
                  <div key={paiement.id_paiement} className="border border-gray-100 rounded-md p-3 hover:bg-gray-50 transition-colors">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center mb-1">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPaiementTypeColor(paiement.type_paiement)}`}>
                            {paiement.type_paiement || 'Non défini'}
                          </span>
                          <span className="ml-2 text-sm font-medium text-green-600">
                            {formatMontant(paiement.paiement_du_jour)}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <span className="text-xs text-gray-500">Reste à payer:</span>
                          <span className="ml-2 text-xs font-medium text-red-600">
                            {formatMontant(paiement.reste_a_payer)}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center text-xs text-gray-500">
                        <FiCreditCard className="mr-1" />
                        <span>Paiement #{paiement.id_paiement}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
