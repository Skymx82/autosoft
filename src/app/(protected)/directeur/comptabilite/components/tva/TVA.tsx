'use client';

import React, { useState } from 'react';
import { FiFilter, FiDownload, FiCalendar } from 'react-icons/fi';

interface TVAProps {
  // Vous pouvez ajouter des props spécifiques ici
}

const TVA: React.FC<TVAProps> = () => {
  const [periode, setPeriode] = useState('trimestriel');
  const [showFilters, setShowFilters] = useState(false);
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Déclaration de TVA</h2>
        
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
          <span className="text-sm font-medium text-gray-700">Période de déclaration :</span>
        </div>
        
        <div className="flex space-x-2">
          <button 
            onClick={() => setPeriode('mensuel')}
            className={`px-4 py-2 rounded-md ${periode === 'mensuel' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          >
            Mensuelle
          </button>
          <button 
            onClick={() => setPeriode('trimestriel')}
            className={`px-4 py-2 rounded-md ${periode === 'trimestriel' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          >
            Trimestrielle
          </button>
          <button 
            onClick={() => setPeriode('annuel')}
            className={`px-4 py-2 rounded-md ${periode === 'annuel' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          >
            Annuelle
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
          <p className="text-sm text-gray-500">TVA collectée</p>
          <p className="text-2xl font-bold text-blue-600">0,00 €</p>
        </div>
        
        <div className="bg-green-50 rounded-lg p-4 border border-green-100">
          <p className="text-sm text-gray-500">TVA déductible</p>
          <p className="text-2xl font-bold text-green-600">0,00 €</p>
        </div>
        
        <div className="bg-purple-50 rounded-lg p-4 border border-purple-100">
          <p className="text-sm text-gray-500">TVA à payer</p>
          <p className="text-2xl font-bold text-purple-600">0,00 €</p>
        </div>
      </div>
      
      {/* Tableau détaillé TVA collectée */}
      <div className="mb-8">
        <h3 className="text-lg font-medium text-gray-700 mb-4">TVA collectée (sur les ventes)</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Taux de TVA</th>
                <th className="py-3 px-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Base HT</th>
                <th className="py-3 px-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Montant TVA</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr>
                <td className="py-4 px-4 text-sm text-gray-500">20%</td>
                <td className="py-4 px-4 text-sm text-gray-500 text-right">0,00 €</td>
                <td className="py-4 px-4 text-sm text-gray-500 text-right">0,00 €</td>
              </tr>
              <tr>
                <td className="py-4 px-4 text-sm text-gray-500">10%</td>
                <td className="py-4 px-4 text-sm text-gray-500 text-right">0,00 €</td>
                <td className="py-4 px-4 text-sm text-gray-500 text-right">0,00 €</td>
              </tr>
              <tr>
                <td className="py-4 px-4 text-sm text-gray-500">5.5%</td>
                <td className="py-4 px-4 text-sm text-gray-500 text-right">0,00 €</td>
                <td className="py-4 px-4 text-sm text-gray-500 text-right">0,00 €</td>
              </tr>
              <tr className="bg-gray-50 font-medium">
                <td className="py-4 px-4 text-sm text-gray-700">Total</td>
                <td className="py-4 px-4 text-sm text-gray-700 text-right">0,00 €</td>
                <td className="py-4 px-4 text-sm text-gray-700 text-right">0,00 €</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Tableau détaillé TVA déductible */}
      <div className="mb-8">
        <h3 className="text-lg font-medium text-gray-700 mb-4">TVA déductible (sur les achats)</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Taux de TVA</th>
                <th className="py-3 px-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Base HT</th>
                <th className="py-3 px-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Montant TVA</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr>
                <td className="py-4 px-4 text-sm text-gray-500">20%</td>
                <td className="py-4 px-4 text-sm text-gray-500 text-right">0,00 €</td>
                <td className="py-4 px-4 text-sm text-gray-500 text-right">0,00 €</td>
              </tr>
              <tr>
                <td className="py-4 px-4 text-sm text-gray-500">10%</td>
                <td className="py-4 px-4 text-sm text-gray-500 text-right">0,00 €</td>
                <td className="py-4 px-4 text-sm text-gray-500 text-right">0,00 €</td>
              </tr>
              <tr>
                <td className="py-4 px-4 text-sm text-gray-500">5.5%</td>
                <td className="py-4 px-4 text-sm text-gray-500 text-right">0,00 €</td>
                <td className="py-4 px-4 text-sm text-gray-500 text-right">0,00 €</td>
              </tr>
              <tr className="bg-gray-50 font-medium">
                <td className="py-4 px-4 text-sm text-gray-700">Total</td>
                <td className="py-4 px-4 text-sm text-gray-700 text-right">0,00 €</td>
                <td className="py-4 px-4 text-sm text-gray-700 text-right">0,00 €</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Récapitulatif et actions */}
      <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-700">Récapitulatif de la période</h3>
          <div className="text-sm text-gray-500">
            {periode === 'trimestriel' ? '3ème trimestre 2025' : periode === 'mensuel' ? 'Juillet 2025' : 'Année 2025'}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="flex justify-between py-2 border-b border-gray-200">
              <span className="text-gray-600">TVA collectée</span>
              <span className="font-medium">0,00 €</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-200">
              <span className="text-gray-600">TVA déductible</span>
              <span className="font-medium">0,00 €</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-200">
              <span className="text-gray-600">Crédit de TVA antérieur</span>
              <span className="font-medium">0,00 €</span>
            </div>
            <div className="flex justify-between py-2 mt-2">
              <span className="text-gray-800 font-medium">TVA à payer</span>
              <span className="text-lg font-bold text-purple-600">0,00 €</span>
            </div>
          </div>
          
          <div className="flex flex-col justify-end">
            <div className="mb-4">
              <p className="text-sm text-gray-500 mb-2">Date limite de déclaration</p>
              <p className="font-medium">20 octobre 2025</p>
            </div>
            
            <div className="flex space-x-2">
              <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 focus:outline-none flex-1">
                Prévisualiser
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none flex-1">
                Générer la déclaration
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TVA;
