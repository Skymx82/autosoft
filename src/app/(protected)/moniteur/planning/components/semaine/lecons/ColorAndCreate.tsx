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

// Fonction pour obtenir la couleur en fonction du type de leçon
export const getLeconTypeColor = (typeLecon: string, statutLecon: string) => {
  // Base de couleur en fonction du type d'événement
  let baseColor = '';
  
  // ===== LEÇONS DE CONDUITE (nuances de bleu) =====
  if (typeLecon === 'Conduite') {
    baseColor = 'bg-blue-100 text-blue-800 border-blue-400';
  } else if (typeLecon === 'Code') {
    baseColor = 'bg-blue-50 text-blue-700 border-blue-300';
  } else if (typeLecon === 'Évaluation') {
    baseColor = 'bg-blue-200 text-blue-900 border-blue-500';
  } 
  
  // ===== EXAMENS (nuances de rouge/violet) =====
  else if (typeLecon === 'Examen code') {
    baseColor = 'bg-red-100 text-red-800 border-red-400';
  } else if (typeLecon === 'Examen conduite') {
    baseColor = 'bg-red-200 text-red-900 border-red-500';
  } else if (typeLecon === 'Examen plateau') {
    baseColor = 'bg-red-300 text-red-900 border-red-600';
  } else if (typeLecon === 'Examen') {
    baseColor = 'bg-red-200 text-red-900 border-red-500';
  } else if (typeLecon === 'Examen blanc') {
    baseColor = 'bg-orange-100 text-orange-800 border-orange-400';
  } else if (typeLecon === 'Préparation examen') {
    baseColor = 'bg-purple-100 text-purple-800 border-purple-400';
  } 
  
  // ===== INDISPONIBILITÉS (nuances de gris) =====
  else if (typeLecon === 'Congé') {
    baseColor = 'bg-gray-100 text-gray-700 border-gray-300';
  } else if (typeLecon === 'Maladie') {
    baseColor = 'bg-gray-200 text-gray-800 border-gray-400';
  } else if (typeLecon === 'Formation') {
    baseColor = 'bg-gray-300 text-gray-800 border-gray-500';
  } else if (typeLecon === 'Réunion') {
    baseColor = 'bg-gray-200 text-gray-800 border-gray-400';
  } else if (typeLecon === 'Autre' || typeLecon === 'Indisponible') {
    baseColor = 'bg-gray-200 text-gray-700 border-gray-400';
  } 
  
  // ===== DISPONIBILITÉS (nuances de vert) =====
  else if (typeLecon === 'Disponible') {
    baseColor = 'bg-green-50 text-green-700 border-green-300';
  } 
  
  // Si aucune couleur spécifique n'est définie, utiliser la couleur du moniteur
  else {
    return '';
  }
  
  // ===== MODIFICATEURS DE STATUT =====
  if (statutLecon === 'Annulée') {
    // Pour les leçons annulées: version désaturée avec bordure pointillée
    return baseColor.replace('bg-', 'bg-opacity-50 bg-') + ' border-dashed';
  } else if (statutLecon === 'Réalisée') {
    // Pour les leçons réalisées: bordure plus épaisse avec motif de hachures
    return baseColor + ' border-2 lecon-realisee';
  }
  
  return baseColor;
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
  // Obtenir la couleur spécifique au type de leçon
  const typeColor = getLeconTypeColor(lecon.type_lecon, lecon.statut_lecon);
  
  // Si pas de couleur spécifique au type, utiliser la couleur du moniteur
  const moniteurColor = getMoniteurColor(moniteur.id_moniteur);
  
  // Utiliser la couleur du type si disponible, sinon celle du moniteur
  const color = typeColor || moniteurColor;
  
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
