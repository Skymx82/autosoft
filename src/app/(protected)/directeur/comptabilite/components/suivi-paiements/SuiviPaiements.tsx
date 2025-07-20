'use client';

import React, { useState } from 'react';
import { FiFilter, FiDownload, FiEye, FiAlertCircle, FiCheckCircle, FiClock } from 'react-icons/fi';

interface SuiviPaiementsProps {
  // Vous pouvez ajouter des props spécifiques ici
}

const SuiviPaiements: React.FC<SuiviPaiementsProps> = () => {
  const [showFilters, setShowFilters] = useState(false);
  
  // Données fictives pour l'exemple
  const paiements = [];
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Suivi des paiements élèves</h2>
        
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
        </div>
      </div>
      
      {/* Cartes de résumé */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-green-50 rounded-lg p-4 border border-green-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Paiements à jour</p>
              <p className="text-2xl font-bold text-green-600">0</p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <FiCheckCircle className="text-green-500 w-6 h-6" />
            </div>
          </div>
        </div>
        
        <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Paiements à venir</p>
              <p className="text-2xl font-bold text-yellow-600">0</p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-full">
              <FiClock className="text-yellow-500 w-6 h-6" />
            </div>
          </div>
        </div>
        
        <div className="bg-red-50 rounded-lg p-4 border border-red-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Paiements en retard</p>
              <p className="text-2xl font-bold text-red-600">0</p>
            </div>
            <div className="bg-red-100 p-3 rounded-full">
              <FiAlertCircle className="text-red-500 w-6 h-6" />
            </div>
          </div>
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
                <option value="a_jour">À jour</option>
                <option value="a_venir">À venir</option>
                <option value="retard">En retard</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mode de paiement</label>
              <select className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Tous les modes</option>
                <option value="cb">Carte bancaire</option>
                <option value="especes">Espèces</option>
                <option value="cheque">Chèque</option>
                <option value="virement">Virement</option>
                <option value="prelevement">Prélèvement</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Recherche élève</label>
              <input 
                type="text" 
                placeholder="Nom ou prénom de l'élève"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date de début</label>
              <input 
                type="date" 
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date de fin</label>
              <input 
                type="date" 
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
      
      {/* Tableau des paiements */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-50">
            <tr>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Élève</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Formation</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Échéance</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Montant</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mode</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {paiements.length > 0 ? (
              paiements.map((paiement, index) => (
                <tr key={index}>
                  {/* Données de paiements */}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="py-4 text-center text-gray-500">
                  Aucun paiement à afficher
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* Pagination */}
      <div className="mt-4 flex items-center justify-between">
        <div className="text-sm text-gray-500">
          Affichage de 0 paiements
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
      
      {/* Résumé financier */}
      <div className="mt-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <h3 className="text-lg font-medium text-gray-700 mb-4">Résumé financier</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <p className="text-sm text-gray-500">Total des paiements à recevoir</p>
            <p className="text-xl font-bold text-gray-800">0,00 €</p>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <p className="text-sm text-gray-500">Total des paiements reçus</p>
            <p className="text-xl font-bold text-gray-800">0,00 €</p>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <p className="text-sm text-gray-500">Total des paiements en retard</p>
            <p className="text-xl font-bold text-gray-800">0,00 €</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuiviPaiements;
