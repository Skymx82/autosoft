'use client';

import React, { useState, useEffect } from 'react';
import { FiPlus, FiSearch, FiRefreshCw, FiFilter } from 'react-icons/fi';
import AdminLayout from '../components/AdminLayout';
import UsersList from './components/UsersList';
import UserModal from './components/UserModal';

export default function UsersPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [filterRole, setFilterRole] = useState('all');

  const handleAddUser = () => {
    setEditingUser(null);
    setIsModalOpen(true);
  };

  const handleEditUser = (user: any) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
  };

  const handleSaveUser = async (userData: any) => {
    setIsLoading(true);
    try {
      // Déterminer si c'est une création ou une mise à jour
      const isEditing = !!userData.id;
      
      let response;
      if (isEditing) {
        // Mise à jour d'un utilisateur existant
        response = await fetch(`/autosoft/users/api/users/${userData.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(userData),
        });
      } else {
        // Création d'un nouvel utilisateur
        response = await fetch('/autosoft/users/api/users', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(userData),
        });
      }
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Erreur HTTP: ${response.status}`);
      }
      
      const result = await response.json();
      
      // Fermer le modal après la sauvegarde
      setIsModalOpen(false);
      setEditingUser(null);
      
      // Rafraîchir la liste
      handleRefresh();
      
      // Afficher un message de succès
      alert(`Utilisateur ${isEditing ? 'mis à jour' : 'créé'} avec succès`);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde de l\'utilisateur:', error);
      alert(`Erreur: ${error instanceof Error ? error.message : 'Une erreur est survenue'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = () => {
    // Pour rafraîchir la liste, nous allons simplement modifier l'état searchTerm
    // ce qui déclenchera un nouvel appel API dans le composant UsersList
    // grâce à la dépendance [searchTerm, filterRole] dans le useEffect
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
          <h1 className="text-2xl font-bold text-gray-800">Gestion des utilisateurs</h1>
          <button
            onClick={handleAddUser}
            className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center hover:bg-blue-700 transition-colors"
          >
            <FiPlus className="mr-2" /> Ajouter un utilisateur
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
                placeholder="Rechercher un utilisateur..."
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
                  value={filterRole}
                  onChange={(e) => setFilterRole(e.target.value)}
                >
                  <option value="all">Tous les rôles</option>
                  <option value="admin">Administrateur</option>
                  <option value="directeur">Directeur</option>
                  <option value="moniteur">Moniteur</option>
                  <option value="secretaire">Secrétaire</option>
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

          <UsersList
            searchTerm={searchTerm}
            filterRole={filterRole}
            onEdit={handleEditUser}
          />
        </div>
      </div>

      <UserModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveUser}
        user={editingUser}
        isLoading={isLoading}
      />
    </AdminLayout>
  );
}
