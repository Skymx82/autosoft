'use client';

import React, { useState } from 'react';
import { FiPlus, FiFilter, FiDownload, FiUpload, FiEye, FiTrash2, FiFileText } from 'react-icons/fi';

interface Justificatif {
  id: string;
  nom: string;
  type: string;
  date: string;
  taille: string;
  categorie: string;
  statut: 'validé' | 'en attente' | 'rejeté';
}

interface JustificatifsProps {
  // Vous pouvez ajouter des props spécifiques ici
}

const Justificatifs: React.FC<JustificatifsProps> = () => {
  const [showFilters, setShowFilters] = useState(false);
  
  // Données fictives pour l'exemple
  const justificatifs: Justificatif[] = [
    {
      id: 'J-001',
      nom: 'Facture_carburant_juillet.pdf',
      type: 'PDF',
      date: '2025-07-05',
      taille: '1.2 Mo',
      categorie: 'Carburant',
      statut: 'validé'
    },
    {
      id: 'J-002',
      nom: 'Facture_loyer_juillet.pdf',
      type: 'PDF',
      date: '2025-07-01',
      taille: '850 Ko',
      categorie: 'Loyer',
      statut: 'validé'
    },
    {
      id: 'J-003',
      nom: 'Facture_assurance_Q3.pdf',
      type: 'PDF',
      date: '2025-07-10',
      taille: '1.5 Mo',
      categorie: 'Assurance',
      statut: 'validé'
    },
    {
      id: 'J-004',
      nom: 'Recu_fournitures.jpg',
      type: 'JPG',
      date: '2025-07-12',
      taille: '2.8 Mo',
      categorie: 'Fournitures',
      statut: 'en attente'
    },
    {
      id: 'J-005',
      nom: 'Facture_reparation_clim.pdf',
      type: 'PDF',
      date: '2025-07-18',
      taille: '1.1 Mo',
      categorie: 'Maintenance',
      statut: 'en attente'
    },
    {
      id: 'J-006',
      nom: 'Note_frais_deplacement.xlsx',
      type: 'XLSX',
      date: '2025-07-15',
      taille: '450 Ko',
      categorie: 'Déplacement',
      statut: 'rejeté'
    }
  ];
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Dépôts de justificatifs</h2>
        
        <div className="flex space-x-2">
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className="p-2 rounded-md bg-gray-100 text-gray-600 hover:bg-gray-200 focus:outline-none"
            title="Filtres avancés"
          >
            <FiFilter className="w-5 h-5" />
          </button>
          
          <button 
            className="p-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 focus:outline-none flex items-center"
          >
            <FiPlus className="w-5 h-5 mr-1" />
            <span>Ajouter un justificatif</span>
          </button>
        </div>
      </div>
      
      {/* Filtres avancés */}
      {showFilters && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type de document</label>
              <select className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Tous les types</option>
                <option value="facture">Facture</option>
                <option value="recu">Reçu</option>
                <option value="note_frais">Note de frais</option>
                <option value="autre">Autre</option>
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
      
      {/* Zone de dépôt de fichiers */}
      <div className="mb-6 p-6 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 flex flex-col items-center justify-center">
        <FiUpload className="w-10 h-10 text-gray-400 mb-2" />
        <p className="text-gray-600 mb-2">Glissez et déposez vos fichiers ici</p>
        <p className="text-gray-500 text-sm mb-4">ou</p>
        <label className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none cursor-pointer">
          Parcourir les fichiers
          <input type="file" className="hidden" multiple />
        </label>
        <p className="text-gray-500 text-xs mt-2">Formats acceptés: PDF, JPG, PNG (max 10 Mo)</p>
      </div>
      
      {/* Tableau des justificatifs */}
      <div className="overflow-x-auto mt-6">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-50">
            <tr>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom du fichier</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Taille</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Catégorie</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {justificatifs.length > 0 ? (
              justificatifs.map((justificatif) => (
                <tr key={justificatif.id} className="hover:bg-gray-50">
                  <td className="py-3 px-4 text-sm text-gray-500">
                    <div className="flex items-center">
                      <FiFileText className="mr-2 text-blue-500" />
                      {justificatif.nom}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-500">{justificatif.type}</td>
                  <td className="py-3 px-4 text-sm text-gray-500">{new Date(justificatif.date).toLocaleDateString('fr-FR')}</td>
                  <td className="py-3 px-4 text-sm text-gray-500">{justificatif.taille}</td>
                  <td className="py-3 px-4 text-sm text-gray-500">{justificatif.categorie}</td>
                  <td className="py-3 px-4 text-sm">
                    <span 
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        justificatif.statut === 'validé' ? 'bg-green-100 text-green-800' : 
                        justificatif.statut === 'en attente' ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-red-100 text-red-800'
                      }`}
                    >
                      {justificatif.statut}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-500">
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-800">
                        <FiEye className="w-4 h-4" />
                      </button>
                      <button className="text-blue-600 hover:text-blue-800">
                        <FiDownload className="w-4 h-4" />
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
                <td colSpan={7} className="py-4 text-center text-gray-500">
                  Aucun justificatif enregistré
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* Pagination */}
      <div className="mt-4 flex items-center justify-between">
        <div className="text-sm text-gray-500">
          Affichage de {justificatifs.length} justificatifs
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
      
      {/* Indicateur d'espace de stockage */}
      <div className="mt-6 bg-gray-50 p-4 rounded-lg">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Espace de stockage</h3>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '7.9%' }}></div>
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>79 Mo utilisés</span>
          <span>1000 Mo disponibles</span>
        </div>
      </div>
    </div>
  );
};

export default Justificatifs;
