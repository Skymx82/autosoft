import React from 'react';
import { FiX, FiAlertTriangle } from 'react-icons/fi';
import { Forfait } from '../api/ApiForfaits';

interface SuppressionForfaitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  forfait: Forfait | null;
}

const SuppressionForfaitModal: React.FC<SuppressionForfaitModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  forfait
}) => {
  if (!isOpen || !forfait) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center">
            <FiAlertTriangle className="text-red-500 mr-2" />
            Confirmer la suppression
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            <FiX className="h-6 w-6" />
          </button>
        </div>
        
        <div className="p-6">
          <p className="text-gray-700 mb-4">
            Êtes-vous sûr de vouloir supprimer le forfait <strong>{forfait.nom}</strong> ?
          </p>
          <p className="text-gray-500 text-sm mb-6">
            Cette action est irréversible et supprimera définitivement ce forfait.
          </p>
          
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Annuler
            </button>
            <button
              type="button"
              onClick={onConfirm}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Supprimer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuppressionForfaitModal;
