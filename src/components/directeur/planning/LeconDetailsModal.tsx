'use client';

import { Lecon } from './PlanningGrid';

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
}

export default function LeconDetailsModal({ lecon, onClose }: LeconDetailsModalProps) {
  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-transparent flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white/95 rounded-lg shadow-xl p-6 max-w-md w-full border border-gray-200" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Détails de la leçon</h3>
          <button 
            className="text-gray-400 hover:text-gray-600 transition-colors"
            onClick={onClose}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
        
        <div className="space-y-4 bg-white/80 p-4 rounded-md">
          <div className="flex items-center">
            <span className="text-gray-500 w-20 flex-shrink-0">Date:</span> 
            <span className="font-medium">{new Date(lecon.date).toLocaleDateString('fr-FR')}</span>
          </div>
          <div className="flex items-center">
            <span className="text-gray-500 w-20 flex-shrink-0">Horaire:</span> 
            <span className="font-medium">{formatTimeToHHMM(lecon.heure_debut)} - {formatTimeToHHMM(lecon.heure_fin)}</span>
          </div>
          <div className="flex items-center">
            <span className="text-gray-500 w-20 flex-shrink-0">Type:</span> 
            <span className="font-medium">{lecon.type_lecon}</span>
          </div>
          <div className="flex items-center">
            <span className="text-gray-500 w-20 flex-shrink-0">Statut:</span> 
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
          {lecon.eleves && (
            <div className="mt-2 p-3 bg-gray-50 rounded-md">
              <div className="flex items-center">
                <span className="text-gray-500 w-20 flex-shrink-0">Élève:</span> 
                <span className="font-medium">{lecon.eleves.prenom} {lecon.eleves.nom}</span>
              </div>
              {lecon.eleves.tel && (
                <div className="flex items-center mt-2">
                  <span className="text-gray-500 w-20 flex-shrink-0">Tél:</span>
                  <a href={`tel:${lecon.eleves.tel}`} className="text-blue-600 hover:underline">{lecon.eleves.tel}</a>
                </div>
              )}
            </div>
          )}
        </div>
        
        <div className="mt-6 flex justify-end">
          <button
            className="px-4 py-2 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors font-medium"
            onClick={onClose}
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
}
