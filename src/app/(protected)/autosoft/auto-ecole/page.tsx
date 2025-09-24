'use client';

import React, { useState } from 'react';
import { FiPlus, FiSearch, FiRefreshCw, FiFilter } from 'react-icons/fi';
import AdminLayout from '../components/AdminLayout';
import AutoEcolesList from './components/AutoEcolesList';
import AutoEcoleModal from './components/AutoEcoleModal';
import UsersModal from './components/UsersModal';

export default function DashboardPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAutoEcole, setEditingAutoEcole] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  
  // États pour le modal de gestion des utilisateurs
  const [isUsersModalOpen, setIsUsersModalOpen] = useState(false);
  const [selectedAutoEcoleId, setSelectedAutoEcoleId] = useState<number | null>(null);
  const [selectedAutoEcoleName, setSelectedAutoEcoleName] = useState('');

  const handleAddAutoEcole = () => {
    setEditingAutoEcole(null);
    setIsModalOpen(true);
  };

  const handleEditAutoEcole = (autoEcole: any) => {
    setEditingAutoEcole(autoEcole);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingAutoEcole(null);
  };

  const handleManageUsers = (autoEcoleId: number, autoEcoleName: string) => {
    setSelectedAutoEcoleId(autoEcoleId);
    setSelectedAutoEcoleName(autoEcoleName);
    setIsUsersModalOpen(true);
  };

  const handleCloseUsersModal = () => {
    setIsUsersModalOpen(false);
    setSelectedAutoEcoleId(null);
    setSelectedAutoEcoleName('');
  };

  const handleSaveAutoEcole = async (autoEcoleData: any) => {
    setIsLoading(true);
    try {
      // Déterminer si c'est une création ou une mise à jour
      const isEditing = !!autoEcoleData.id;
      
      let response;
      if (isEditing) {
        // Mise à jour d'une auto-école existante
        response = await fetch(`/autosoft/auto-ecole/api/auto-ecoles/${autoEcoleData.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(autoEcoleData),
        });
      } else {
        // Création d'une nouvelle auto-école
        response = await fetch('/autosoft/auto-ecole/api/auto-ecoles', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(autoEcoleData),
        });
      }
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Erreur HTTP: ${response.status}`);
      }
      
      // Fermer le modal après la sauvegarde
      setIsModalOpen(false);
      setEditingAutoEcole(null);
      
      // Rafraîchir la liste
      handleRefresh();
      
      // Afficher un message de succès (vous pourriez utiliser un système de notification)
      console.log(`Auto-école ${isEditing ? 'mise à jour' : 'créée'} avec succès`);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde de l\'auto-école:', error);
      alert(`Erreur: ${error instanceof Error ? error.message : 'Une erreur est survenue'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = () => {
    // Pour rafraîchir la liste, nous allons simplement modifier l'état searchTerm
    // ce qui déclenchera un nouvel appel API dans le composant AutoEcolesList
    // grâce à la dépendance [searchTerm, filterStatus] dans le useEffect
    const currentSearchTerm = searchTerm;
    setSearchTerm('');
    setTimeout(() => {
      setSearchTerm(currentSearchTerm);
    }, 100);
  };

  return (
    <AdminLayout>
      <div className="p-6 text-gray-800 w-full overflow-x-hidden">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Gestion des auto-écoles</h1>
          <button
            onClick={handleAddAutoEcole}
            className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center hover:bg-blue-700 transition-colors"
          >
            <FiPlus className="mr-2" /> Ajouter une auto-école
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6 overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6 w-full">
            <div className="relative w-full md:max-w-md">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <FiSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Rechercher une auto-école..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center flex-grow md:flex-grow-0">
                <FiFilter className="text-gray-400 mr-2" />
                <select
                  className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full md:w-auto"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="all">Tous les statuts</option>
                  <option value="active">Actif</option>
                  <option value="inactive">Inactif</option>
                  <option value="pending">En attente</option>
                </select>
              </div>
              
              <button
                onClick={handleRefresh}
                className="p-2 rounded-md border border-gray-300 hover:bg-gray-100 transition-colors"
                title="Rafraîchir"
              >
                <FiRefreshCw />
              </button>
            </div>
          </div>

          <AutoEcolesList
            searchTerm={searchTerm}
            filterStatus={filterStatus}
            onEdit={handleEditAutoEcole}
            onManageUsers={handleManageUsers}
          />
        </div>
      </div>

      <AutoEcoleModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveAutoEcole}
        autoEcole={editingAutoEcole}
        isLoading={isLoading}
      />

      <UsersModal
        isOpen={isUsersModalOpen}
        onClose={handleCloseUsersModal}
        autoEcoleId={selectedAutoEcoleId}
        autoEcoleName={selectedAutoEcoleName}
      />
    </AdminLayout>
  );
}
