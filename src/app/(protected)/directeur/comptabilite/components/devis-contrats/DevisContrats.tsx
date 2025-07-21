'use client';

import React, { useState } from 'react';
import { FiPlus, FiFilter, FiDownload, FiEye, FiEdit, FiTrash2, FiFileText, FiCheck, FiX } from 'react-icons/fi';

interface Devis {
  id: string;
  numero: string;
  date: string;
  dateExpiration: string;
  client: string;
  montantHT: number;
  tauxTVA: number;
  montantTVA: number;
  montantTTC: number;
  statut: 'en attente' | 'accepté' | 'refusé' | 'expiré';
  description?: string;
}

interface Contrat {
  id: string;
  numero: string;
  dateDebut: string;
  dateFin: string;
  client: string;
  montantHT: number;
  tauxTVA: number;
  montantTVA: number;
  montantTTC: number;
  statut: 'actif' | 'terminé' | 'résilié';
  description?: string;
}

interface DevisContratsProps {
  // Vous pouvez ajouter des props spécifiques ici
}

const DevisContrats: React.FC<DevisContratsProps> = () => {
  const [activeTab, setActiveTab] = useState('devis');
  const [showFilters, setShowFilters] = useState(false);
  
  // Données fictives pour l'exemple
  const devis: Devis[] = [
    {
      id: 'D001',
      numero: 'DEV-2025-001',
      date: '2025-07-01',
      dateExpiration: '2025-08-01',
      client: 'Martin Dupont',
      montantHT: 1200.00,
      tauxTVA: 20,
      montantTVA: 240.00,
      montantTTC: 1440.00,
      statut: 'en attente',
      description: 'Formation permis B - 20h de conduite'
    },
    {
      id: 'D002',
      numero: 'DEV-2025-002',
      date: '2025-07-05',
      dateExpiration: '2025-08-05',
      client: 'Sophie Martin',
      montantHT: 950.00,
      tauxTVA: 20,
      montantTVA: 190.00,
      montantTTC: 1140.00,
      statut: 'accepté',
      description: 'Formation permis B - 15h de conduite'
    },
    {
      id: 'D003',
      numero: 'DEV-2025-003',
      date: '2025-07-08',
      dateExpiration: '2025-08-08',
      client: 'Thomas Bernard',
      montantHT: 1500.00,
      tauxTVA: 20,
      montantTVA: 300.00,
      montantTTC: 1800.00,
      statut: 'refusé',
      description: 'Formation permis B - 25h de conduite + code'
    },
    {
      id: 'D004',
      numero: 'DEV-2025-004',
      date: '2025-06-15',
      dateExpiration: '2025-07-15',
      client: 'Julie Petit',
      montantHT: 1100.00,
      tauxTVA: 20,
      montantTVA: 220.00,
      montantTTC: 1320.00,
      statut: 'expiré',
      description: 'Formation permis B - 18h de conduite'
    },
    {
      id: 'D005',
      numero: 'DEV-2025-005',
      date: '2025-07-12',
      dateExpiration: '2025-08-12',
      client: 'Lucas Moreau',
      montantHT: 1350.00,
      tauxTVA: 20,
      montantTVA: 270.00,
      montantTTC: 1620.00,
      statut: 'en attente',
      description: 'Formation permis B - 22h de conduite'
    },
    {
      id: 'D006',
      numero: 'DEV-2025-006',
      date: '2025-07-15',
      dateExpiration: '2025-08-15',
      client: 'Emma Dubois',
      montantHT: 1050.00,
      tauxTVA: 20,
      montantTVA: 210.00,
      montantTTC: 1260.00,
      statut: 'accepté',
      description: 'Formation permis B - 17h de conduite'
    }
  ];
  
  const contrats: Contrat[] = [
    {
      id: 'C001',
      numero: 'CONT-2025-001',
      dateDebut: '2025-07-01',
      dateFin: '2025-12-31',
      client: 'Sophie Martin',
      montantHT: 950.00,
      tauxTVA: 20,
      montantTVA: 190.00,
      montantTTC: 1140.00,
      statut: 'actif',
      description: 'Formation permis B - 15h de conduite'
    },
    {
      id: 'C002',
      numero: 'CONT-2025-002',
      dateDebut: '2025-06-15',
      dateFin: '2025-12-15',
      client: 'Antoine Leroy',
      montantHT: 1250.00,
      tauxTVA: 20,
      montantTVA: 250.00,
      montantTTC: 1500.00,
      statut: 'actif',
      description: 'Formation permis B - 20h de conduite + code'
    },
    {
      id: 'C003',
      numero: 'CONT-2025-003',
      dateDebut: '2025-05-10',
      dateFin: '2025-11-10',
      client: 'Clara Roux',
      montantHT: 1150.00,
      tauxTVA: 20,
      montantTVA: 230.00,
      montantTTC: 1380.00,
      statut: 'terminé',
      description: 'Formation permis B - 18h de conduite'
    },
    {
      id: 'C004',
      numero: 'CONT-2025-004',
      dateDebut: '2025-06-01',
      dateFin: '2025-12-01',
      client: 'Hugo Blanc',
      montantHT: 1400.00,
      tauxTVA: 20,
      montantTVA: 280.00,
      montantTTC: 1680.00,
      statut: 'résilié',
      description: 'Formation permis B - 23h de conduite + code'
    },
    {
      id: 'C005',
      numero: 'CONT-2025-005',
      dateDebut: '2025-07-10',
      dateFin: '2026-01-10',
      client: 'Emma Dubois',
      montantHT: 1050.00,
      tauxTVA: 20,
      montantTVA: 210.00,
      montantTTC: 1260.00,
      statut: 'actif',
      description: 'Formation permis B - 17h de conduite'
    }
  ];
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Devis et Contrats</h2>
        
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
            <span>Créer {activeTab === 'devis' ? 'un devis' : 'un contrat'}</span>
          </button>
        </div>
      </div>
      
      {/* Sous-onglets */}
      <div className="border-b mb-6">
        <div className="flex">
          <button
            onClick={() => setActiveTab('devis')}
            className={`py-2 px-4 font-medium text-sm border-b-2 ${activeTab === 'devis' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
          >
            Devis
          </button>
          <button
            onClick={() => setActiveTab('contrats')}
            className={`py-2 px-4 font-medium text-sm border-b-2 ${activeTab === 'contrats' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
          >
            Contrats
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
                {activeTab === 'devis' ? (
                  <>
                    <option value="en_attente">En attente</option>
                    <option value="accepte">Accepté</option>
                    <option value="refuse">Refusé</option>
                    <option value="expire">Expiré</option>
                  </>
                ) : (
                  <>
                    <option value="actif">Actif</option>
                    <option value="termine">Terminé</option>
                    <option value="resilie">Résilié</option>
                  </>
                )}
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
      
      {/* Tableau des devis ou contrats */}
      <div className="overflow-x-auto">
        {activeTab === 'devis' ? (
          <table className="min-w-full bg-white">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">N° Devis</th>
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
              {devis.length > 0 ? (
                devis.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm text-gray-500">{item.numero}</td>
                    <td className="py-3 px-4 text-sm text-gray-500">{new Date(item.date).toLocaleDateString('fr-FR')}</td>
                    <td className="py-3 px-4 text-sm text-gray-500">{item.client}</td>
                    <td className="py-3 px-4 text-sm text-gray-500">{item.montantHT.toLocaleString('fr-FR')} €</td>
                    <td className="py-3 px-4 text-sm text-gray-500">{item.montantTVA.toLocaleString('fr-FR')} €</td>
                    <td className="py-3 px-4 text-sm text-gray-500">{item.montantTTC.toLocaleString('fr-FR')} €</td>
                    <td className="py-3 px-4 text-sm">
                      <span 
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          item.statut === 'accepté' ? 'bg-green-100 text-green-800' : 
                          item.statut === 'en attente' ? 'bg-yellow-100 text-yellow-800' : 
                          item.statut === 'refusé' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {item.statut}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-500">
                      <div className="flex space-x-2">
                        <button className="text-blue-600 hover:text-blue-800" title="Voir">
                          <FiEye className="w-4 h-4" />
                        </button>
                        <button className="text-blue-600 hover:text-blue-800" title="Modifier">
                          <FiEdit className="w-4 h-4" />
                        </button>
                        <button className="text-blue-600 hover:text-blue-800" title="Télécharger">
                          <FiDownload className="w-4 h-4" />
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
                    Aucun devis enregistré
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        ) : (
          <table className="min-w-full bg-white">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">N° Contrat</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date début</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date fin</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Montant HT</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">TVA</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Montant TTC</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {contrats.length > 0 ? (
                contrats.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm text-gray-500">{item.numero}</td>
                    <td className="py-3 px-4 text-sm text-gray-500">{new Date(item.dateDebut).toLocaleDateString('fr-FR')}</td>
                    <td className="py-3 px-4 text-sm text-gray-500">{new Date(item.dateFin).toLocaleDateString('fr-FR')}</td>
                    <td className="py-3 px-4 text-sm text-gray-500">{item.client}</td>
                    <td className="py-3 px-4 text-sm text-gray-500">{item.montantHT.toLocaleString('fr-FR')} €</td>
                    <td className="py-3 px-4 text-sm text-gray-500">{item.montantTVA.toLocaleString('fr-FR')} €</td>
                    <td className="py-3 px-4 text-sm text-gray-500">{item.montantTTC.toLocaleString('fr-FR')} €</td>
                    <td className="py-3 px-4 text-sm">
                      <span 
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          item.statut === 'actif' ? 'bg-green-100 text-green-800' : 
                          item.statut === 'terminé' ? 'bg-blue-100 text-blue-800' : 
                          'bg-red-100 text-red-800'
                        }`}
                      >
                        {item.statut}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-500">
                      <div className="flex space-x-2">
                        <button className="text-blue-600 hover:text-blue-800" title="Voir">
                          <FiEye className="w-4 h-4" />
                        </button>
                        <button className="text-blue-600 hover:text-blue-800" title="Modifier">
                          <FiEdit className="w-4 h-4" />
                        </button>
                        <button className="text-blue-600 hover:text-blue-800" title="Télécharger">
                          <FiDownload className="w-4 h-4" />
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
                  <td colSpan={9} className="py-4 text-center text-gray-500">
                    Aucun contrat enregistré
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
      
      {/* Pagination */}
      <div className="mt-4 flex items-center justify-between">
        <div className="text-sm text-gray-500">
          Affichage de {activeTab === 'devis' ? devis.length : contrats.length} {activeTab === 'devis' ? 'devis' : 'contrats'}
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

export default DevisContrats;
