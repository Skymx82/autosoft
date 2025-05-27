'use client';

import React from 'react';
import { DetailsViewProps } from './types';

// Fonction utilitaire pour formater une heure au format HH:MM:SS en HH:MM
const formatTimeToHHMM = (time: string): string => {
  // Si le format est déjà HH:MM, on le retourne tel quel
  if (time.length === 5) return time;
  
  // Sinon on extrait les heures et minutes
  const [hours, minutes] = time.split(':');
  return `${hours}:${minutes}`;
};

export default function DetailsView({ lecon }: DetailsViewProps) {
  // Déterminer les informations du moniteur à afficher
  const moniteurNom = lecon.moniteur?.nom || '';
  const moniteurPrenom = lecon.moniteur?.prenom || '';
  
  // Initiales du moniteur pour l'avatar
  const initiales = moniteurPrenom && moniteurNom 
    ? `${moniteurPrenom.charAt(0)}${moniteurNom.charAt(0)}`.toUpperCase() 
    : `M${lecon.id_moniteur}`;
  
  // Nom complet du moniteur ou texte par défaut
  const nomComplet = moniteurPrenom && moniteurNom 
    ? `${moniteurPrenom} ${moniteurNom}` 
    : `Moniteur #${lecon.id_moniteur}`;
  
  return (
    <div className="space-y-4">
      {/* Informations sur le moniteur */}
      <div className="flex items-center space-x-3 mb-4 bg-blue-50 p-4 rounded-md">
        <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium text-lg">
          {initiales}
        </div>
        <div>
          <p className="font-medium text-lg">{nomComplet}</p>
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
  );
}
