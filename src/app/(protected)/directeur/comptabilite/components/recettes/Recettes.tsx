'use client';

import React, { useState } from 'react';
import { FiPlus, FiFilter, FiDownload, FiEye, FiEdit, FiTrash2 } from 'react-icons/fi';

interface Recette {
  id: string;
  date: string;
  categorie: string;
  description: string;
  montant: number;
  tva: number;
  client: string;
  modePaiement: string;
  statut: 'encaissé' | 'en attente' | 'annulé';
}

interface RecettesProps {
  // Vous pouvez ajouter des props spécifiques ici
}

const Recettes: React.FC<RecettesProps> = () => {
  const [showFilters, setShowFilters] = useState(false);
  
  // Données fictives pour l'exemple
  const recettes: Recette[] = [
    {
      id: 'REC-001',
      date: '2025-07-02',
      categorie: 'Forfait code',
      description: 'Forfait code de la route',
      montant: 250.00,
      tva: 50.00,
      client: 'Martin Sophie',
      modePaiement: 'Carte bancaire',
      statut: 'encaissé'
    },
    {
      id: 'REC-002',
      date: '2025-07-05',
      categorie: 'Forfait conduite',
      description: 'Forfait 20h de conduite',
      montant: 800.00,
      tva: 160.00,
      client: 'Dubois Thomas',
      modePaiement: 'Virement',
      statut: 'encaissé'
    },
    {
      id: 'REC-003',
      date: '2025-07-08',
      categorie: 'Heures supplémentaires',
      description: '5 heures supplémentaires',
      montant: 225.00,
      tva: 45.00,
      client: 'Leroy Julie',
      modePaiement: 'Chèque',
      statut: 'en attente'
    },
    {
      id: 'REC-004',
      date: '2025-07-12',
      categorie: 'Forfait complet',
      description: 'Permis B complet',
      montant: 1200.00,
      tva: 240.00,
      client: 'Moreau Lucas',
      modePaiement: 'Espèces',
      statut: 'encaissé'
    },
    {
      id: 'REC-005',
      date: '2025-07-15',
      categorie: 'Examen pratique',
      description: 'Présentation à l\'examen',
      montant: 70.00,
      tva: 14.00,
      client: 'Petit Emma',
      modePaiement: 'Carte bancaire',
      statut: 'encaissé'
    },
    {
      id: 'REC-006',
      date: '2025-07-18',
      categorie: 'Forfait accéléré',
      description: 'Stage intensif permis B',
      montant: 1500.00,
      tva: 300.00,
      client: 'Garcia Hugo',
      modePaiement: 'Virement',
      statut: 'en attente'
    }
  ];
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Recettes</h2>
        
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Source</label>
              <select className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Toutes les sources</option>
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
      
      {/* Tableau des recettes */}
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
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mode</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {recettes.length > 0 ? (
              recettes.map((recette) => (
                <tr key={recette.id} className="hover:bg-gray-50">
                  <td className="py-3 px-4 text-sm text-gray-500">{new Date(recette.date).toLocaleDateString('fr-FR')}</td>
                  <td className="py-3 px-4 text-sm text-gray-500">{recette.categorie}</td>
                  <td className="py-3 px-4 text-sm text-gray-500">{recette.description}</td>
                  <td className="py-3 px-4 text-sm text-gray-500">{recette.montant.toFixed(2)} €</td>
                  <td className="py-3 px-4 text-sm text-gray-500">{recette.tva.toFixed(2)} €</td>
                  <td className="py-3 px-4 text-sm font-medium text-gray-700">{(recette.montant + recette.tva).toFixed(2)} €</td>
                  <td className="py-3 px-4 text-sm text-gray-500">{recette.client}</td>
                  <td className="py-3 px-4 text-sm text-gray-500">{recette.modePaiement}</td>
                  <td className="py-3 px-4 text-sm">
                    <span 
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        recette.statut === 'encaissé' ? 'bg-green-100 text-green-800' : 
                        recette.statut === 'en attente' ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-red-100 text-red-800'
                      }`}
                    >
                      {recette.statut}
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
                  Aucune recette enregistrée
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* Pagination */}
      <div className="mt-4 flex items-center justify-between">
        <div className="text-sm text-gray-500">
          Affichage de {recettes.length} recettes
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

export default Recettes;
