'use client';

import React, { useState } from 'react';
import { FiPlus, FiFilter, FiDownload, FiEdit, FiTrash2, FiInfo } from 'react-icons/fi';

interface Voiture {
  id: string;
  immatriculation: string;
  marque: string;
  modele: string;
  dateAchat: string;
  prixAchat: number;
  kilometrage: number;
  prochaineRevision: string;
  statut: 'disponible' | 'en maintenance' | 'hors service';
}

interface VoituresProps {
  // Vous pouvez ajouter des props spécifiques ici
}

const Voitures: React.FC<VoituresProps> = () => {
  const [showFilters, setShowFilters] = useState(false);
  
  // Données fictives pour l'exemple
  const voitures: Voiture[] = [
    {
      id: 'V-001',
      immatriculation: 'AB-123-CD',
      marque: 'Peugeot',
      modele: '208',
      dateAchat: '2023-05-15',
      prixAchat: 18500.00,
      kilometrage: 15420,
      prochaineRevision: '2025-11-15',
      statut: 'disponible'
    },
    {
      id: 'V-002',
      immatriculation: 'EF-456-GH',
      marque: 'Renault',
      modele: 'Clio',
      dateAchat: '2023-08-22',
      prixAchat: 17800.00,
      kilometrage: 12850,
      prochaineRevision: '2025-08-22',
      statut: 'disponible'
    },
    {
      id: 'V-003',
      immatriculation: 'IJ-789-KL',
      marque: 'Citroën',
      modele: 'C3',
      dateAchat: '2022-11-10',
      prixAchat: 16900.00,
      kilometrage: 28750,
      prochaineRevision: '2025-09-10',
      statut: 'en maintenance'
    },
    {
      id: 'V-004',
      immatriculation: 'MN-012-OP',
      marque: 'Volkswagen',
      modele: 'Polo',
      dateAchat: '2024-01-05',
      prixAchat: 19200.00,
      kilometrage: 8540,
      prochaineRevision: '2026-01-05',
      statut: 'disponible'
    },
    {
      id: 'V-005',
      immatriculation: 'QR-345-ST',
      marque: 'Toyota',
      modele: 'Yaris',
      dateAchat: '2022-06-18',
      prixAchat: 17500.00,
      kilometrage: 32180,
      prochaineRevision: '2025-08-18',
      statut: 'disponible'
    },
    {
      id: 'V-006',
      immatriculation: 'UV-678-WX',
      marque: 'Dacia',
      modele: 'Sandero',
      dateAchat: '2021-09-30',
      prixAchat: 14800.00,
      kilometrage: 45620,
      prochaineRevision: '2025-07-30',
      statut: 'hors service'
    }
  ];
  
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
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Marque/Modèle</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date d'achat</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prix d'achat</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kilométrage</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prochaine révision</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {voitures.length > 0 ? (
              voitures.map((voiture) => (
                <tr key={voiture.id} className="hover:bg-gray-50">
                  <td className="py-3 px-4 text-sm text-gray-500">{voiture.immatriculation}</td>
                  <td className="py-3 px-4 text-sm text-gray-500">{voiture.marque} {voiture.modele}</td>
                  <td className="py-3 px-4 text-sm text-gray-500">{new Date(voiture.dateAchat).toLocaleDateString('fr-FR')}</td>
                  <td className="py-3 px-4 text-sm text-gray-500">{voiture.prixAchat.toLocaleString('fr-FR')} €</td>
                  <td className="py-3 px-4 text-sm text-gray-500">{voiture.kilometrage.toLocaleString('fr-FR')} km</td>
                  <td className="py-3 px-4 text-sm text-gray-500">{new Date(voiture.prochaineRevision).toLocaleDateString('fr-FR')}</td>
                  <td className="py-3 px-4 text-sm">
                    <span 
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        voiture.statut === 'disponible' ? 'bg-green-100 text-green-800' : 
                        voiture.statut === 'en maintenance' ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-red-100 text-red-800'
                      }`}
                    >
                      {voiture.statut}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-500">
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-800">
                        <FiInfo className="w-4 h-4" />
                      </button>
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
          Affichage de {voitures.length} véhicules
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
            <p className="text-xl font-bold text-gray-800">
              {voitures.reduce((total, voiture) => total + voiture.prixAchat, 0).toLocaleString('fr-FR')} €
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <p className="text-sm text-gray-500">Coût total d'entretien</p>
            <p className="text-xl font-bold text-gray-800">8 750,00 €</p>
            <p className="text-xs text-gray-500 mt-1">Estimation basée sur l'historique</p>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <p className="text-sm text-gray-500">Coût total</p>
            <p className="text-xl font-bold text-gray-800">
              {(voitures.reduce((total, voiture) => total + voiture.prixAchat, 0) + 8750).toLocaleString('fr-FR')} €
            </p>
            <p className="text-xs text-gray-500 mt-1">Achat + entretien</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Voitures;
