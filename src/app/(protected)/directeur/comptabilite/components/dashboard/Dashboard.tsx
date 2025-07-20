'use client';

import React from 'react';
import { FiBarChart2, FiDollarSign, FiTrendingUp } from 'react-icons/fi';

interface DashboardProps {
  // Vous pouvez ajouter des props spécifiques ici
}

const Dashboard: React.FC<DashboardProps> = () => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Tableau de bord comptabilité</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Carte de statistiques - Recettes */}
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Recettes (mois courant)</p>
              <p className="text-2xl font-bold text-blue-600">0 €</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <FiTrendingUp className="text-blue-500 w-6 h-6" />
            </div>
          </div>
        </div>
        
        {/* Carte de statistiques - Dépenses */}
        <div className="bg-red-50 rounded-lg p-4 border border-red-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Dépenses (mois courant)</p>
              <p className="text-2xl font-bold text-red-600">0 €</p>
            </div>
            <div className="bg-red-100 p-3 rounded-full">
              <FiDollarSign className="text-red-500 w-6 h-6" />
            </div>
          </div>
        </div>
        
        {/* Carte de statistiques - Bénéfices */}
        <div className="bg-green-50 rounded-lg p-4 border border-green-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Bénéfices (mois courant)</p>
              <p className="text-2xl font-bold text-green-600">0 €</p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <FiBarChart2 className="text-green-500 w-6 h-6" />
            </div>
          </div>
        </div>
      </div>
      
      {/* Graphique ou tableau récapitulatif */}
      <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
        <h3 className="text-lg font-medium text-gray-700 mb-4">Aperçu financier</h3>
        <div className="h-64 flex items-center justify-center border border-dashed border-gray-300 rounded-lg bg-white">
          <p className="text-gray-500">Les graphiques seront affichés ici</p>
        </div>
      </div>
      
      {/* Transactions récentes */}
      <div className="mt-6">
        <h3 className="text-lg font-medium text-gray-700 mb-4">Transactions récentes</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-2 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="py-2 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                <th className="py-2 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Catégorie</th>
                <th className="py-2 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Montant</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr className="text-gray-500 text-center">
                <td colSpan={4} className="py-4">Aucune transaction récente</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
