'use client';

import React, { useState } from 'react';
import { FiPlus, FiFilter, FiDownload, FiEdit, FiTrash2 } from 'react-icons/fi';

interface Depense {
  id: string;
  date: string;
  categorie: string;
  description: string;
  montant: number;
  tva: number;
  fournisseur: string;
  modePaiement: string;
  statut: 'payé' | 'en attente' | 'annulé';
}

interface DepensesProps {
  // Vous pouvez ajouter des props spécifiques ici
}

const Depenses: React.FC<DepensesProps> = () => {
  const [showFilters, setShowFilters] = useState(false);
  
  // Données fictives pour l'exemple
  const depenses: Depense[] = [
    {
      id: 'DEP-001',
      date: '2025-07-01',
      categorie: 'Carburant',
      description: 'Essence véhicule école',
      montant: 85.50,
      tva: 17.10,
      fournisseur: 'Total Energies',
      modePaiement: 'Carte bancaire',
      statut: 'payé'
    },
    {
      id: 'DEP-002',
      date: '2025-07-05',
      categorie: 'Entretien véhicule',
      description: 'Révision Peugeot 208',
      montant: 320.75,
      tva: 64.15,
      fournisseur: 'Garage Martin',
      modePaiement: 'Virement',
      statut: 'payé'
    },
    {
      id: 'DEP-003',
      date: '2025-07-10',
      categorie: 'Fournitures bureau',
      description: 'Papeterie et cartouches imprimante',
      montant: 124.90,
      tva: 24.98,
      fournisseur: 'Bureau Center',
      modePaiement: 'Carte bancaire',
      statut: 'payé'
    },
    {
      id: 'DEP-004',
      date: '2025-07-15',
      categorie: 'Loyer',
      description: 'Loyer bureau juillet 2025',
      montant: 950.00,
      tva: 190.00,
      fournisseur: 'SCI Immobilière',
      modePaiement: 'Prélèvement',
      statut: 'payé'
    },
    {
      id: 'DEP-005',
      date: '2025-07-18',
      categorie: 'Assurance',
      description: 'Assurance flotte véhicules',
      montant: 450.30,
      tva: 0,
      fournisseur: 'Assur Auto',
      modePaiement: 'Prélèvement',
      statut: 'payé'
    },
    {
      id: 'DEP-006',
      date: '2025-07-20',
      categorie: 'Maintenance',
      description: 'Réparation climatisation',
      montant: 280.00,
      tva: 56.00,
      fournisseur: 'Clim Services',
      modePaiement: 'Chèque',
      statut: 'en attente'
    }
  ];
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Dépenses</h2>
        
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
            <span>Ajouter</span>
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
                <option value="loyer">Loyer</option>
                <option value="salaires">Salaires</option>
                <option value="fournitures">Fournitures</option>
                <option value="vehicules">Véhicules</option>
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
      
      {/* Tableau des dépenses */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-50">
            <tr>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Catégorie</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Montant HT</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">TVA</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Montant TTC</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fournisseur</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mode</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {depenses.length > 0 ? (
              depenses.map((depense, index) => (
                <tr key={depense.id} className="hover:bg-gray-50">
                  <td className="py-3 px-4 text-sm text-gray-500">{new Date(depense.date).toLocaleDateString('fr-FR')}</td>
                  <td className="py-3 px-4 text-sm text-gray-500">{depense.categorie}</td>
                  <td className="py-3 px-4 text-sm text-gray-500">{depense.description}</td>
                  <td className="py-3 px-4 text-sm text-gray-500">{depense.montant.toFixed(2)} €</td>
                  <td className="py-3 px-4 text-sm text-gray-500">{depense.tva.toFixed(2)} €</td>
                  <td className="py-3 px-4 text-sm font-medium text-gray-700">{(depense.montant + depense.tva).toFixed(2)} €</td>
                  <td className="py-3 px-4 text-sm text-gray-500">{depense.fournisseur}</td>
                  <td className="py-3 px-4 text-sm text-gray-500">{depense.modePaiement}</td>
                  <td className="py-3 px-4 text-sm">
                    <span 
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        depense.statut === 'payé' ? 'bg-green-100 text-green-800' : 
                        depense.statut === 'en attente' ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-red-100 text-red-800'
                      }`}
                    >
                      {depense.statut}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-500">
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-800">
                        <FiEdit className="w-4 h-4" />
                      </button>
                      <button className="text-red-600 hover:text-red-800">
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={10} className="py-4 text-center text-gray-500">
                  Aucune dépense enregistrée
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* Pagination */}
      <div className="mt-4 flex items-center justify-between">
        <div className="text-sm text-gray-500">
          Affichage de {depenses.length} dépenses
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
    </div>
  );
};

export default Depenses;
