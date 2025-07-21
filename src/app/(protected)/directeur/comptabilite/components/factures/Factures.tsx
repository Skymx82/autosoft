'use client';

import React, { useState } from 'react';
import { FiPlus, FiFilter, FiDownload, FiEye, FiEdit, FiTrash2 } from 'react-icons/fi';

interface Facture {
  id: string;
  numero: string;
  date: string;
  client: string;
  montantHT: number;
  tauxTVA: number;
  montantTVA: number;
  montantTTC: number;
  statut: 'payée' | 'en attente' | 'en retard' | 'annulée';
  echeance: string;
}

interface FacturesProps {
  // Vous pouvez ajouter des props spécifiques ici
}

const Factures: React.FC<FacturesProps> = () => {
  const [showFilters, setShowFilters] = useState(false);
  
  // Données fictives pour l'exemple
  const factures: Facture[] = [
    {
      id: 'f001',
      numero: 'F-2025-001',
      date: '2025-01-15',
      client: 'Martin Dupont',
      montantHT: 750.00,
      tauxTVA: 20,
      montantTVA: 150.00,
      montantTTC: 900.00,
      statut: 'payée',
      echeance: '2025-02-15'
    },
    {
      id: 'f002',
      numero: 'F-2025-002',
      date: '2025-01-20',
      client: 'Sophie Lefebvre',
      montantHT: 1250.00,
      tauxTVA: 20,
      montantTVA: 250.00,
      montantTTC: 1500.00,
      statut: 'payée',
      echeance: '2025-02-20'
    },
    {
      id: 'f003',
      numero: 'F-2025-003',
      date: '2025-02-05',
      client: 'Thomas Bernard',
      montantHT: 833.33,
      tauxTVA: 20,
      montantTVA: 166.67,
      montantTTC: 1000.00,
      statut: 'en attente',
      echeance: '2025-03-05'
    },
    {
      id: 'f004',
      numero: 'F-2025-004',
      date: '2025-02-12',
      client: 'Julie Moreau',
      montantHT: 625.00,
      tauxTVA: 20,
      montantTVA: 125.00,
      montantTTC: 750.00,
      statut: 'en attente',
      echeance: '2025-03-12'
    },
    {
      id: 'f005',
      numero: 'F-2025-005',
      date: '2025-01-05',
      client: 'Lucas Petit',
      montantHT: 416.67,
      tauxTVA: 20,
      montantTVA: 83.33,
      montantTTC: 500.00,
      statut: 'en retard',
      echeance: '2025-02-05'
    },
    {
      id: 'f006',
      numero: 'F-2025-006',
      date: '2025-01-10',
      client: 'Emma Dubois',
      montantHT: 1666.67,
      tauxTVA: 20,
      montantTVA: 333.33,
      montantTTC: 2000.00,
      statut: 'annulée',
      echeance: '2025-02-10'
    },
    {
      id: 'f007',
      numero: 'F-2025-007',
      date: '2025-02-18',
      client: 'Antoine Richard',
      montantHT: 2083.33,
      tauxTVA: 20,
      montantTVA: 416.67,
      montantTTC: 2500.00,
      statut: 'payée',
      echeance: '2025-03-18'
    },
    {
      id: 'f008',
      numero: 'F-2025-008',
      date: '2025-02-22',
      client: 'Clara Simon',
      montantHT: 1041.67,
      tauxTVA: 20,
      montantTVA: 208.33,
      montantTTC: 1250.00,
      statut: 'en attente',
      echeance: '2025-03-22'
    }
  ];
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Factures</h2>
        
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
            <span>Créer une facture</span>
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
                <option value="payee">Payée</option>
                <option value="en_attente">En attente</option>
                <option value="retard">En retard</option>
                <option value="annulee">Annulée</option>
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
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Client</label>
              <input 
                type="text" 
                placeholder="Nom du client"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Montant minimum</label>
              <input 
                type="number" 
                placeholder="0,00 €"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Montant maximum</label>
              <input 
                type="number" 
                placeholder="0,00 €"
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
      
      {/* Tableau des factures */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-50">
            <tr>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">N° Facture</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Montant HT</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">TVA</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Montant TTC</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {factures.length > 0 ? (
              factures.map((facture, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="py-3 px-4 text-sm text-gray-500">{facture.numero}</td>
                  <td className="py-3 px-4 text-sm text-gray-500">{new Date(facture.date).toLocaleDateString('fr-FR')}</td>
                  <td className="py-3 px-4 text-sm text-gray-500">{facture.client}</td>
                  <td className="py-3 px-4 text-sm text-gray-500">{facture.montantHT.toLocaleString('fr-FR')} €</td>
                  <td className="py-3 px-4 text-sm text-gray-500">{facture.montantTVA.toLocaleString('fr-FR')} €</td>
                  <td className="py-3 px-4 text-sm text-gray-500">{facture.montantTTC.toLocaleString('fr-FR')} €</td>
                  <td className="py-3 px-4 text-sm">
                    <span className={
                      `px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        facture.statut === 'payée' ? 'bg-green-100 text-green-800' : 
                        facture.statut === 'en attente' ? 'bg-yellow-100 text-yellow-800' : 
                        facture.statut === 'en retard' ? 'bg-red-100 text-red-800' : 
                        'bg-gray-100 text-gray-800'
                      }`
                    }>
                      {facture.statut.charAt(0).toUpperCase() + facture.statut.slice(1)}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-500">
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-800" title="Voir">
                        <FiEye className="w-4 h-4" />
                      </button>
                      <button className="text-green-600 hover:text-green-800" title="Éditer">
                        <FiEdit className="w-4 h-4" />
                      </button>
                      <button className="text-red-600 hover:text-red-800" title="Supprimer">
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="py-4 text-center text-gray-500">
                  Aucune facture enregistrée
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* Pagination */}
      <div className="mt-4 flex items-center justify-between">
        <div className="text-sm text-gray-500">
          Affichage de {factures.length} factures
        </div>
        
        <div className="flex space-x-1">
          <button className="px-3 py-1 border border-gray-300 rounded-md bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50" disabled={factures.length === 0}>
            Précédent
          </button>
          <button className="px-3 py-1 border border-gray-300 rounded-md bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50" disabled={factures.length === 0}>
            Suivant
          </button>
        </div>
      </div>
    </div>
  );
};

export default Factures;
