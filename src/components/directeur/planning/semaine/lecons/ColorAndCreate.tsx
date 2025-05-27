'use client';

import { Lecon, Moniteur } from '../../PlanningGrid';

// Fonction pour générer une couleur unique pour chaque moniteur
export const getMoniteurColor = (moniteurId: number) => {
  // Liste de classes de couleurs Tailwind pour les moniteurs - couleurs pastel
  const colors = [
    'bg-blue-100 text-blue-800 border-blue-300',
    'bg-green-100 text-green-800 border-green-300',
    'bg-yellow-100 text-yellow-800 border-yellow-300',
    'bg-red-100 text-red-800 border-red-300',
    'bg-purple-100 text-purple-800 border-purple-300',
    'bg-indigo-100 text-indigo-800 border-indigo-300',
    'bg-pink-100 text-pink-800 border-pink-300',
    'bg-gray-100 text-gray-800 border-gray-300',
    'bg-teal-100 text-teal-800 border-teal-300',
    'bg-orange-100 text-orange-800 border-orange-300',
    'bg-lime-100 text-lime-800 border-lime-300',
    'bg-cyan-100 text-cyan-800 border-cyan-300',
    'bg-amber-100 text-amber-800 border-amber-300',
  ];
  
  // Utiliser l'ID du moniteur pour sélectionner une couleur de manière déterministe
  const colorIndex = moniteurId % colors.length;
  return colors[colorIndex];
};

interface LeconItemProps {
  lecon: Lecon;
  moniteur: Moniteur;
  position: {
    top: string;
    height: string;
  };
  moniteurCount: number;
  onClick: (lecon: Lecon) => void;
}

export default function LeconItem({ 
  lecon, 
  moniteur, 
  position, 
  moniteurCount, 
  onClick 
}: LeconItemProps) {
  const color = getMoniteurColor(moniteur.id_moniteur);
  
  return (
    <div
      className={`absolute p-1 rounded ${color} text-xs overflow-hidden shadow-sm cursor-pointer hover:shadow transition-shadow`}
      style={{
        ...position,
        width: moniteurCount > 10 ? 'calc(100% - 2px)' : 'calc(100% - 4px)',
        left: moniteurCount > 10 ? '1px' : '2px',
        right: moniteurCount > 10 ? '1px' : '2px',
        // Réduire la taille de police pour les auto-écoles avec beaucoup de moniteurs
        fontSize: moniteurCount > 8 ? '0.65rem' : undefined,
        // Bordure fine mais visible
        borderWidth: '1px'
      }}
      onClick={() => onClick(lecon)}
    >
      {/* Affichage adapté au nombre de moniteurs */}
      <>
        <div className="font-medium truncate">
          {/* Toujours afficher le nom complet pour 6 moniteurs ou moins */}
          {moniteurCount <= 6 
            ? `${moniteur.prenom} ${moniteur.nom.charAt(0)}.`
            : (moniteurCount > 10 
                ? `${moniteur.prenom.charAt(0)}${moniteur.nom.charAt(0)}` 
                : `${moniteur.prenom.charAt(0)}. ${moniteur.nom.charAt(0)}.`)
          }
        </div>
        {lecon.eleves && (
          <div className="truncate">
            {/* Toujours afficher le nom complet de l'élève pour 6 moniteurs ou moins */}
            {moniteurCount <= 6 
              ? `${lecon.eleves.prenom} ${lecon.eleves.nom}`
              : (moniteurCount > 10 
                  ? `${lecon.eleves.prenom.charAt(0)}${lecon.eleves.nom.charAt(0)}` 
                  : `${lecon.eleves.prenom.charAt(0)}. ${lecon.eleves.nom.charAt(0)}.`)
            }
          </div>
        )}
        {/* Afficher le type de leçon pour 6 moniteurs ou moins */}
        {moniteurCount <= 6 && (
          <div className="truncate text-[10px] text-gray-600">{lecon.type_lecon}</div>
        )}
      </>
    </div>
  );
}
