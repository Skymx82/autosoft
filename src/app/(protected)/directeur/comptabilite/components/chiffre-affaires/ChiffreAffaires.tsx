'use client';

import React, { useState } from 'react';
import { FiFilter, FiDownload, FiCalendar } from 'react-icons/fi';

interface ChiffreAffairesProps {
  // Vous pouvez ajouter des props spécifiques ici
}

const ChiffreAffaires: React.FC<ChiffreAffairesProps> = () => {
  const [periode, setPeriode] = useState('mensuel');
  const [showFilters, setShowFilters] = useState(false);
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Chiffre d'affaires</h2>
        
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
      
      {/* Sélecteur de période */}
      <div className="mb-6">
        <div className="flex items-center space-x-2 mb-2">
          <FiCalendar className="text-gray-500" />
          <span className="text-sm font-medium text-gray-700">Période :</span>
        </div>
        
        <div className="flex space-x-2">
          <button 
            onClick={() => setPeriode('mensuel')}
            className={`px-4 py-2 rounded-md ${periode === 'mensuel' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          >
            Mensuel
          </button>
          <button 
            onClick={() => setPeriode('trimestriel')}
            className={`px-4 py-2 rounded-md ${periode === 'trimestriel' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          >
            Trimestriel
          </button>
          <button 
            onClick={() => setPeriode('annuel')}
            className={`px-4 py-2 rounded-md ${periode === 'annuel' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          >
            Annuel
          </button>
        </div>
      </div>
      
      {/* Filtres avancés */}
      {showFilters && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
              <select className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Toutes les catégories</option>
                <option value="formation">Formation</option>
                <option value="examen">Examen</option>
                <option value="vente">Vente de produits</option>
                <option value="autres">Autres</option>
              </select>
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
      
      {/* Graphique du chiffre d'affaires */}
      <div className="mb-8">
        <div className="h-80 border border-gray-200 rounded-lg bg-gray-50 flex items-center justify-center">
          <p className="text-gray-500">Le graphique du chiffre d'affaires sera affiché ici</p>
        </div>
      </div>
      
      {/* Tableau récapitulatif */}
      <div>
        <h3 className="text-lg font-medium text-gray-700 mb-4">Récapitulatif par catégorie</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Catégorie</th>
                <th className="py-3 px-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Montant HT</th>
                <th className="py-3 px-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider border-b">TVA</th>
                <th className="py-3 px-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Montant TTC</th>
                <th className="py-3 px-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider border-b">% du CA</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr>
                <td className="py-4 px-4 text-sm text-gray-500">Formation</td>
                <td className="py-4 px-4 text-sm text-gray-500 text-right">0,00 €</td>
                <td className="py-4 px-4 text-sm text-gray-500 text-right">0,00 €</td>
                <td className="py-4 px-4 text-sm text-gray-500 text-right">0,00 €</td>
                <td className="py-4 px-4 text-sm text-gray-500 text-right">0%</td>
              </tr>
              <tr>
                <td className="py-4 px-4 text-sm text-gray-500">Examen</td>
                <td className="py-4 px-4 text-sm text-gray-500 text-right">0,00 €</td>
                <td className="py-4 px-4 text-sm text-gray-500 text-right">0,00 €</td>
                <td className="py-4 px-4 text-sm text-gray-500 text-right">0,00 €</td>
                <td className="py-4 px-4 text-sm text-gray-500 text-right">0%</td>
              </tr>
              <tr>
                <td className="py-4 px-4 text-sm text-gray-500">Vente de produits</td>
                <td className="py-4 px-4 text-sm text-gray-500 text-right">0,00 €</td>
                <td className="py-4 px-4 text-sm text-gray-500 text-right">0,00 €</td>
                <td className="py-4 px-4 text-sm text-gray-500 text-right">0,00 €</td>
                <td className="py-4 px-4 text-sm text-gray-500 text-right">0%</td>
              </tr>
              <tr>
                <td className="py-4 px-4 text-sm text-gray-500">Autres</td>
                <td className="py-4 px-4 text-sm text-gray-500 text-right">0,00 €</td>
                <td className="py-4 px-4 text-sm text-gray-500 text-right">0,00 €</td>
                <td className="py-4 px-4 text-sm text-gray-500 text-right">0,00 €</td>
                <td className="py-4 px-4 text-sm text-gray-500 text-right">0%</td>
              </tr>
              <tr className="bg-gray-50 font-medium">
                <td className="py-4 px-4 text-sm text-gray-700">Total</td>
                <td className="py-4 px-4 text-sm text-gray-700 text-right">0,00 €</td>
                <td className="py-4 px-4 text-sm text-gray-700 text-right">0,00 €</td>
                <td className="py-4 px-4 text-sm text-gray-700 text-right">0,00 €</td>
                <td className="py-4 px-4 text-sm text-gray-700 text-right">100%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ChiffreAffaires;
