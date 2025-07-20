'use client';

import React, { useState } from 'react';
import { FiPlus, FiFilter, FiDownload, FiEye, FiEdit, FiTrash2 } from 'react-icons/fi';

interface VoituresProps {
  // Vous pouvez ajouter des props spécifiques ici
}

const Voitures: React.FC<VoituresProps> = () => {
  const [showFilters, setShowFilters] = useState(false);
  
  // Données fictives pour l'exemple
  const voitures = [];
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Gestion des voitures</h2>
        
        <div className="flex space-x-2">
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className="p-2 rounded-md bg-gray-100 text-gray-600 hover:bg-gray-200 focus:outline-none"
            title="Filtres avancés"
          >
            <FiFilter className="w-5 h-5" />
          </button>
          
          <button 
            className="p-2 rounded-md bg-gray-100 text-gray-600 hover:bg-gray-200 focus:outline-none"
            title="Exporter"
          >
            <FiDownload className="w-5 h-5" />
          </button>
          
          <button 
            className="p-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 focus:outline-none flex items-center"
          >
            <FiPlus className="w-5 h-5 mr-1" />
            <span>Ajouter un véhicule</span>
          </button>
        </div>
      </div>
      
      {/* Filtres avancés */}
      {showFilters && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
              <select className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Tous les statuts</option>
                <option value="actif">Actif</option>
                <option value="maintenance">En maintenance</option>
                <option value="vendu">Vendu</option>
                <option value="hors_service">Hors service</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Marque</label>
              <input 
                type="text" 
                placeholder="Marque du véhicule"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Modèle</label>
              <input 
                type="text" 
                placeholder="Modèle du véhicule"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          
          <div className="mt-4 flex justify-end">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none">
              Appliquer les filtres
            </button>
          </div>
        </div>
      )}
      
      {/* Tableau des voitures */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-50">
            <tr>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Immatriculation</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Marque</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Modèle</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date d'achat</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Coût d'achat</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Coûts d'entretien</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {voitures.length > 0 ? (
              voitures.map((voiture, index) => (
                <tr key={index}>
                  {/* Données de voitures */}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="py-4 text-center text-gray-500">
                  Aucun véhicule enregistré
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* Pagination */}
      <div className="mt-4 flex items-center justify-between">
        <div className="text-sm text-gray-500">
          Affichage de 0 véhicules
        </div>
        
        <div className="flex space-x-1">
          <button className="px-3 py-1 border border-gray-300 rounded-md bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50" disabled>
            Précédent
          </button>
          <button className="px-3 py-1 border border-gray-300 rounded-md bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50" disabled>
            Suivant
          </button>
        </div>
      </div>
      
      {/* Résumé des coûts */}
      <div className="mt-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <h3 className="text-lg font-medium text-gray-700 mb-4">Résumé des coûts</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <p className="text-sm text-gray-500">Coût total d'achat</p>
            <p className="text-xl font-bold text-gray-800">0,00 €</p>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <p className="text-sm text-gray-500">Coût total d'entretien</p>
            <p className="text-xl font-bold text-gray-800">0,00 €</p>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <p className="text-sm text-gray-500">Coût total</p>
            <p className="text-xl font-bold text-gray-800">0,00 €</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Voitures;
