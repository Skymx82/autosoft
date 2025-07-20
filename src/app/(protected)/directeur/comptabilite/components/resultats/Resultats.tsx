'use client';

import React, { useState } from 'react';
import { FiFilter, FiDownload, FiCalendar } from 'react-icons/fi';

interface ResultatsProps {
  // Vous pouvez ajouter des props spécifiques ici
}

const Resultats: React.FC<ResultatsProps> = () => {
  const [periode, setPeriode] = useState('mensuel');
  const [showFilters, setShowFilters] = useState(false);
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Résultats financiers</h2>
        
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
      
      {/* Cartes de résumé */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
          <p className="text-sm text-gray-500">Chiffre d'affaires</p>
          <p className="text-2xl font-bold text-blue-600">0,00 €</p>
          <div className="mt-2 text-xs text-gray-500">
            <span>Période précédente: 0,00 €</span>
            <span className="ml-2 text-gray-400">0%</span>
          </div>
        </div>
        
        <div className="bg-red-50 rounded-lg p-4 border border-red-100">
          <p className="text-sm text-gray-500">Dépenses</p>
          <p className="text-2xl font-bold text-red-600">0,00 €</p>
          <div className="mt-2 text-xs text-gray-500">
            <span>Période précédente: 0,00 €</span>
            <span className="ml-2 text-gray-400">0%</span>
          </div>
        </div>
        
        <div className="bg-green-50 rounded-lg p-4 border border-green-100">
          <p className="text-sm text-gray-500">Résultat net</p>
          <p className="text-2xl font-bold text-green-600">0,00 €</p>
          <div className="mt-2 text-xs text-gray-500">
            <span>Période précédente: 0,00 €</span>
            <span className="ml-2 text-gray-400">0%</span>
          </div>
        </div>
      </div>
      
      {/* Graphique d'évolution */}
      <div className="mb-8">
        <h3 className="text-lg font-medium text-gray-700 mb-4">Évolution des résultats</h3>
        <div className="h-80 border border-gray-200 rounded-lg bg-gray-50 flex items-center justify-center">
          <p className="text-gray-500">Le graphique d'évolution sera affiché ici</p>
        </div>
      </div>
      
      {/* Tableau détaillé */}
      <div>
        <h3 className="text-lg font-medium text-gray-700 mb-4">Détail des résultats</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Période</th>
                <th className="py-3 px-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Chiffre d'affaires</th>
                <th className="py-3 px-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Dépenses</th>
                <th className="py-3 px-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Résultat net</th>
                <th className="py-3 px-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Marge (%)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr>
                <td className="py-4 px-4 text-sm text-gray-500">Janvier 2025</td>
                <td className="py-4 px-4 text-sm text-gray-500 text-right">0,00 €</td>
                <td className="py-4 px-4 text-sm text-gray-500 text-right">0,00 €</td>
                <td className="py-4 px-4 text-sm text-gray-500 text-right">0,00 €</td>
                <td className="py-4 px-4 text-sm text-gray-500 text-right">0%</td>
              </tr>
              <tr>
                <td className="py-4 px-4 text-sm text-gray-500">Février 2025</td>
                <td className="py-4 px-4 text-sm text-gray-500 text-right">0,00 €</td>
                <td className="py-4 px-4 text-sm text-gray-500 text-right">0,00 €</td>
                <td className="py-4 px-4 text-sm text-gray-500 text-right">0,00 €</td>
                <td className="py-4 px-4 text-sm text-gray-500 text-right">0%</td>
              </tr>
              <tr>
                <td className="py-4 px-4 text-sm text-gray-500">Mars 2025</td>
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
                <td className="py-4 px-4 text-sm text-gray-700 text-right">0%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Resultats;
