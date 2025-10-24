'use client';

import { useState, useEffect } from 'react';
import { FiX, FiCheckCircle, FiFileText, FiAlertTriangle, FiClock, FiEdit, FiArchive } from 'react-icons/fi';

interface StatusChangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentStatus: string;
  onConfirm: (newStatus: string) => void;
  eleveInfo?: {
    nom: string;
    prenom: string;
  };
}

// Configuration des transitions autorisées
const getAllowedTransitions = (currentStatus: string): string[] => {
  switch(currentStatus) {
    case 'Brouillon':
      return ['En attente', 'Archivé'];
    case 'En attente':
      return ['Complet', 'Incomplet', 'Brouillon', 'Archivé'];
    case 'Complet':
      return ['Actif', 'Incomplet', 'Archivé'];
    case 'Incomplet':
      return ['En attente', 'Archivé'];
    case 'Actif':
      return ['Archivé'];
    case 'Archivé':
      return [];
    default:
      return ['En attente', 'Brouillon', 'Archivé'];
  }
};

// Configuration des statuts
const statusConfig = {
  'Actif': { icon: FiCheckCircle, color: 'text-green-600', bgHover: 'hover:bg-green-50' },
  'Complet': { icon: FiFileText, color: 'text-blue-600', bgHover: 'hover:bg-blue-50' },
  'Incomplet': { icon: FiAlertTriangle, color: 'text-orange-600', bgHover: 'hover:bg-orange-50' },
  'En attente': { icon: FiClock, color: 'text-yellow-600', bgHover: 'hover:bg-yellow-50' },
  'Brouillon': { icon: FiEdit, color: 'text-gray-600', bgHover: 'hover:bg-gray-50' },
  'Archivé': { icon: FiArchive, color: 'text-red-600', bgHover: 'hover:bg-red-50' }
};

export default function StatusChangeModal({ 
  isOpen, 
  onClose, 
  currentStatus, 
  onConfirm,
  eleveInfo 
}: StatusChangeModalProps) {
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [showArchiveWarning, setShowArchiveWarning] = useState(false);

  // Réinitialiser la sélection quand la modal s'ouvre
  useEffect(() => {
    if (isOpen) {
      setSelectedStatus(null);
      setShowArchiveWarning(false);
    }
  }, [isOpen]);

  // Fermer avec Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const allowedTransitions = getAllowedTransitions(currentStatus);
  const normalTransitions = allowedTransitions.filter(s => s !== 'Archivé');
  const canArchive = allowedTransitions.includes('Archivé');

  const handleStatusClick = (status: string) => {
    if (status === 'Archivé') {
      setShowArchiveWarning(true);
    } else {
      setSelectedStatus(status);
    }
  };

  const handleConfirm = () => {
    if (selectedStatus) {
      onConfirm(selectedStatus);
      onClose();
    }
  };

  const handleArchiveConfirm = () => {
    onConfirm('Archivé');
    onClose();
  };

  // Modal d'avertissement pour l'archivage
  if (showArchiveWarning) {
    return (
      <div className="fixed inset-0 backdrop-blur-sm bg-black/30 z-[100] flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 animate-in fade-in zoom-in duration-200">
          <div className="flex flex-col items-center text-center">
            <div className="mb-4 text-red-500">
              <FiArchive className="w-12 h-12" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Archiver {eleveInfo ? `${eleveInfo.prenom} ${eleveInfo.nom}` : 'cet élève'} ?
            </h3>
            <p className="text-gray-600 mb-6">
              Cette action est <strong>définitive</strong>. L'élève sera déplacé dans les archives et ne pourra plus être utilisé dans le planning.
              <br /><br />
              Vous pourrez toujours consulter son dossier dans l'onglet "Archivé".
            </p>
            <div className="flex space-x-3 w-full">
              <button
                onClick={() => setShowArchiveWarning(false)}
                className="flex-1 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleArchiveConfirm}
                className="flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 transition-colors"
              >
                Archiver
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Modal principale de changement de statut
  return (
    <div 
      className="fixed inset-0 backdrop-blur-sm bg-black/30 z-[100] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-lg shadow-xl max-w-md w-full animate-in fade-in zoom-in duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Changer le statut</h3>
            {eleveInfo && (
              <p className="text-sm text-gray-600 mt-1">
                {eleveInfo.prenom} {eleveInfo.nom}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4">
          <div className="mb-4">
            <p className="text-sm text-gray-600">
              Statut actuel : <span className="font-semibold text-gray-900">{currentStatus}</span>
            </p>
          </div>

          {/* Liste des statuts disponibles */}
          {normalTransitions.length > 0 || canArchive ? (
            <div className="space-y-2">
              {normalTransitions.length > 0 && (
                <>
                  <p className="text-xs font-medium text-gray-700 mb-2">Sélectionnez un nouveau statut :</p>
                  {normalTransitions.map((status) => {
                const config = statusConfig[status as keyof typeof statusConfig];
                const Icon = config.icon;
                const isSelected = selectedStatus === status;

                return (
                  <button
                    key={status}
                    onClick={() => handleStatusClick(status)}
                    className={`
                      w-full text-left px-4 py-3 rounded-lg border-2 transition-all
                      ${isSelected 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                      }
                      ${config.bgHover}
                    `}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-5 h-5 ${config.color}`} />
                      <span className="font-medium text-gray-900">{status}</span>
                      {isSelected && (
                        <FiCheckCircle className="w-5 h-5 text-blue-600 ml-auto" />
                      )}
                    </div>
                  </button>
                );
              })}
                </>
              )}

              {/* Séparateur et option Archiver */}
              {canArchive && (
                <>
                  {normalTransitions.length > 0 && (
                    <div className="relative my-4">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300"></div>
                      </div>
                      <div className="relative flex justify-center text-xs">
                        <span className="bg-white px-2 text-gray-500">Action définitive</span>
                      </div>
                    </div>
                  )}
                  
                  {normalTransitions.length === 0 && (
                    <p className="text-xs font-medium text-gray-700 mb-2">Seule action possible :</p>
                  )}

                  <button
                    onClick={() => handleStatusClick('Archivé')}
                    className="w-full text-left px-4 py-3 rounded-lg border-2 border-red-200 bg-red-50 hover:bg-red-100 hover:border-red-300 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <FiArchive className="w-5 h-5 text-red-600" />
                      <div className="flex-1">
                        <span className="font-medium text-red-900 block">Archiver</span>
                        <span className="text-xs text-red-700">Action irréversible</span>
                      </div>
                    </div>
                  </button>
                </>
              )}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <FiAlertTriangle className="w-12 h-12 mx-auto mb-2 text-gray-400" />
              <p className="text-sm">Aucune transition possible depuis ce statut</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-4 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            Annuler
          </button>
          <button
            onClick={handleConfirm}
            disabled={!selectedStatus}
            className={`
              px-4 py-2 text-sm font-medium text-white rounded-md transition-colors
              ${selectedStatus
                ? 'bg-blue-600 hover:bg-blue-700'
                : 'bg-gray-300 cursor-not-allowed'
              }
            `}
          >
            Confirmer
          </button>
        </div>
      </div>
    </div>
  );
}
