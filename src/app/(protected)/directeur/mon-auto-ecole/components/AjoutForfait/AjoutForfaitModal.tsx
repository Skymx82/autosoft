import React, { useState, useEffect } from 'react';
import { FiX } from 'react-icons/fi';
import { Forfait } from '../../api/ApiForfaits';

interface AjoutForfaitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (e: React.FormEvent) => void;
  currentForfait: Partial<Forfait> | null;
  setCurrentForfait: React.Dispatch<React.SetStateAction<Partial<Forfait> | null>>;
  isEditing: boolean;
  typesPermis?: string[];
}

const AjoutForfaitModal: React.FC<AjoutForfaitModalProps> = ({
  isOpen,
  onClose,
  onSave,
  currentForfait,
  setCurrentForfait,
  isEditing,
  typesPermis = ['A', 'A1', 'A2', 'B', 'B1', 'BE', 'C', 'CE', 'D', 'DE']
}) => {

  if (!isOpen) return null;

  // Gérer le changement des champs du formulaire
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCurrentForfait(prev => ({
      ...prev,
      [name]: ['tarif_base', 'nb_heures_incluses', 'prix_heure_supp', 'prix_presentation_examen', 'frais_inscription', 'duree_validite_jours', 'nb_max_echeances'].includes(name) 
        ? parseFloat(value) || 0 
        : value
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-800">
            {isEditing ? 'Modifier le forfait' : 'Ajouter un nouveau forfait'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            <FiX className="h-6 w-6" />
          </button>
        </div>
        
        <div className="p-6">
          <form onSubmit={onSave} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="nom" className="block text-sm font-medium text-gray-700 mb-1">
                  Nom du forfait *
                </label>
                <input
                  type="text"
                  id="nom"
                  name="nom"
                  value={currentForfait?.nom || ''}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Ex: Permis B - Formule Standard"
                />
              </div>
              
              <div>
                <label htmlFor="type_permis" className="block text-sm font-medium text-gray-700 mb-1">
                  Type de permis *
                </label>
                <select
                  id="type_permis"
                  name="type_permis"
                  value={currentForfait?.type_permis || ''}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Sélectionnez un type</option>
                  {typesPermis.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label htmlFor="tarif_base" className="block text-sm font-medium text-gray-700 mb-1">
                  Tarif de base (€) *
                </label>
                <input
                  type="number"
                  id="tarif_base"
                  name="tarif_base"
                  value={currentForfait?.tarif_base || ''}
                  onChange={handleChange}
                  required
                  min="0"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label htmlFor="nb_heures_incluses" className="block text-sm font-medium text-gray-700 mb-1">
                  Heures incluses *
                </label>
                <input
                  type="number"
                  id="nb_heures_incluses"
                  name="nb_heures_incluses"
                  value={currentForfait?.nb_heures_incluses || ''}
                  onChange={handleChange}
                  required
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label htmlFor="prix_heure_supp" className="block text-sm font-medium text-gray-700 mb-1">
                  Prix heure supplémentaire (€) *
                </label>
                <input
                  type="number"
                  id="prix_heure_supp"
                  name="prix_heure_supp"
                  value={currentForfait?.prix_heure_supp || ''}
                  onChange={handleChange}
                  required
                  min="0"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label htmlFor="prix_presentation_examen" className="block text-sm font-medium text-gray-700 mb-1">
                  Prix présentation examen (€)
                </label>
                <input
                  type="number"
                  id="prix_presentation_examen"
                  name="prix_presentation_examen"
                  value={currentForfait?.prix_presentation_examen || ''}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label htmlFor="frais_inscription" className="block text-sm font-medium text-gray-700 mb-1">
                  Frais d'inscription (€)
                </label>
                <input
                  type="number"
                  id="frais_inscription"
                  name="frais_inscription"
                  value={currentForfait?.frais_inscription || ''}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label htmlFor="duree_validite_jours" className="block text-sm font-medium text-gray-700 mb-1">
                  Durée de validité (jours)
                </label>
                <input
                  type="number"
                  id="duree_validite_jours"
                  name="duree_validite_jours"
                  value={currentForfait?.duree_validite_jours || ''}
                  onChange={handleChange}
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="paiement_fractionnable"
                  name="paiement_fractionnable"
                  checked={currentForfait?.paiement_fractionnable || false}
                  onChange={(e) => setCurrentForfait(prev => ({ ...prev, paiement_fractionnable: e.target.checked }))}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="paiement_fractionnable" className="ml-2 block text-sm text-gray-700">
                  Paiement fractionnable
                </label>
              </div>
              
              <div>
                <label htmlFor="nb_max_echeances" className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre max d'échéances
                </label>
                <input
                  type="number"
                  id="nb_max_echeances"
                  name="nb_max_echeances"
                  value={currentForfait?.nb_max_echeances || ''}
                  onChange={handleChange}
                  min="1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  disabled={!currentForfait?.paiement_fractionnable}
                />
              </div>
            </div>
            
            <div className="mt-4">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={currentForfait?.description || ''}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Décrivez le contenu et les avantages de ce forfait..."
              />
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {isEditing ? 'Mettre à jour' : 'Ajouter'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AjoutForfaitModal;
