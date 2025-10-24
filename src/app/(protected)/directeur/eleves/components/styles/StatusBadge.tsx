'use client';

import { FiCheckCircle, FiFileText, FiAlertTriangle, FiClock, FiEdit, FiArchive, FiHelpCircle } from 'react-icons/fi';

interface StatusBadgeProps {
  status: string;
  showIcon?: boolean;
  showTooltip?: boolean;
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  isClickable?: boolean;
}

// Configuration des statuts
const statusConfig = {
  'Actif': {
    icon: FiCheckCircle,
    color: 'bg-green-100 text-green-800',
    borderColor: 'border-green-300',
    tooltip: 'Dossier validé - Utilisable dans le planning',
    emoji: '✅'
  },
  'Complet': {
    icon: FiFileText,
    color: 'bg-blue-100 text-blue-800',
    borderColor: 'border-blue-300',
    tooltip: 'Documents complets - En attente d\'activation',
    emoji: '📋'
  },
  'Incomplet': {
    icon: FiAlertTriangle,
    color: 'bg-orange-100 text-orange-800',
    borderColor: 'border-orange-300',
    tooltip: 'Documents manquants - À compléter',
    emoji: '⚠️'
  },
  'En attente': {
    icon: FiClock,
    color: 'bg-yellow-100 text-yellow-800',
    borderColor: 'border-yellow-300',
    tooltip: 'En attente de vérification par un administrateur',
    emoji: '⏳'
  },
  'Brouillon': {
    icon: FiEdit,
    color: 'bg-gray-100 text-gray-800',
    borderColor: 'border-gray-300',
    tooltip: 'Dossier en cours de création - Non finalisé',
    emoji: '📝'
  },
  'Archivé': {
    icon: FiArchive,
    color: 'bg-gray-200 text-gray-700',
    borderColor: 'border-gray-400',
    tooltip: 'Élève inactif - Formation terminée ou abandon',
    emoji: '🗄️'
  }
};

export default function StatusBadge({ 
  status, 
  showIcon = true, 
  showTooltip = true,
  size = 'md',
  onClick,
  isClickable = false
}: StatusBadgeProps) {
  const config = statusConfig[status as keyof typeof statusConfig] || {
    icon: FiHelpCircle,
    color: 'bg-gray-100 text-gray-800',
    borderColor: 'border-gray-300',
    tooltip: 'Statut non défini',
    emoji: '❓'
  };

  const Icon = config.icon;

  // Tailles
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-xs',
    lg: 'px-3 py-1.5 text-sm'
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-3.5 h-3.5',
    lg: 'w-4 h-4'
  };

  const BadgeContent = (
    <span 
      className={`
        inline-flex items-center gap-1.5 font-semibold rounded-full border
        ${config.color} ${config.borderColor} ${sizeClasses[size]}
        transition-all duration-200
        ${isClickable ? 'cursor-pointer hover:shadow-lg hover:scale-105 active:scale-95' : 'hover:shadow-md'}
      `}
      onClick={isClickable ? onClick : undefined}
    >
      {showIcon && <Icon className={iconSizes[size]} />}
      <span>{status || 'Non défini'}</span>
      {isClickable && (
        <FiEdit className={`${iconSizes[size]} opacity-0 group-hover:opacity-100 transition-opacity`} />
      )}
    </span>
  );

  return (
    <div className="relative inline-block group">
      {BadgeContent}
      
      {/* Tooltip au survol */}
      {showTooltip && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50 pointer-events-none">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <span className="text-lg">{config.emoji}</span>
              <span>{config.tooltip}</span>
            </div>
            {isClickable && (
              <div className="text-xs text-gray-300 italic border-t border-gray-700 pt-1 mt-1">
                💡 Cliquez pour modifier le statut
              </div>
            )}
          </div>
          {/* Flèche du tooltip */}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
            <div className="border-4 border-transparent border-t-gray-900"></div>
          </div>
        </div>
      )}
    </div>
  );
}

// Export de la configuration pour réutilisation
export { statusConfig };
