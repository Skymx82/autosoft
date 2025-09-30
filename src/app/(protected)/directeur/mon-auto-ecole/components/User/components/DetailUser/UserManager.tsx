'use client';

import { useState, useEffect } from 'react';
import UserModal from '../AjoutUser/UserModalDirect';
import { FiPlus, FiEdit2, FiTrash2, FiAlertTriangle } from 'react-icons/fi';

export default function UserManager() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentUser, setCurrentUser] = useState<any | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [idEcole, setIdEcole] = useState<number>(0);

  // Récupérer l'ID de l'école depuis le localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const userDataStr = localStorage.getItem('autosoft_user');
      if (userDataStr) {
        try {
          const userData = JSON.parse(userDataStr);
          setIdEcole(userData.id_ecole || 0);
        } catch (error) {
          console.error('Erreur lors de la récupération des données utilisateur:', error);
        }
      }
    }
  }, []);

  // Charger la liste des utilisateurs
  const loadUsers = async () => {
    if (!idEcole) return;
    
    setLoading(true);
    try {
      const response = await fetch(`/directeur/mon-auto-ecole/components/User/api/users?id_ecole=${idEcole}`);
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
      const data = await response.json();
      setUsers(data);
    } catch (err) {
      console.error('Erreur lors du chargement des utilisateurs:', err);
      setError('Erreur lors du chargement des utilisateurs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (idEcole) {
      loadUsers();
    }
  }, [idEcole]);

  // Gérer l'ajout d'un utilisateur
  const handleAddUser = () => {
    setCurrentUser(null);
    setShowModal(true);
  };

  // Gérer l'édition d'un utilisateur
  const handleEditUser = (user: any) => {
    setCurrentUser(user);
    setShowModal(true);
  };

  // Gérer la suppression d'un utilisateur
  const handleDeleteClick = (user: any) => {
    setCurrentUser(user);
    setShowDeleteModal(true);
  };

  // Sauvegarder un utilisateur (ajout ou modification)
  const handleSaveUser = async (userData: any) => {
    setIsSubmitting(true);
    setError(null);
    
    try {
      if (userData.id) {
        // Mise à jour d'un utilisateur existant
        const response = await fetch('/directeur/mon-auto-ecole/components/User/api/users', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(userData),
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Erreur lors de la mise à jour de l\'utilisateur');
        }
        
        setSuccess('Utilisateur mis à jour avec succès');
      } else {
        // Ajout d'un nouvel utilisateur
        const response = await fetch('/directeur/mon-auto-ecole/components/User/api/users', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(userData),
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Erreur lors de la création de l\'utilisateur');
        }
        
        setSuccess('Utilisateur créé avec succès');
      }
      
      // Fermer le modal et rafraîchir la liste
      setShowModal(false);
      loadUsers();
    } catch (err: any) {
      console.error('Erreur lors de la sauvegarde de l\'utilisateur:', err);
      setError(err.message || 'Erreur lors de la sauvegarde de l\'utilisateur');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Supprimer un utilisateur
  const handleDeleteUser = async () => {
    if (!currentUser) return;
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      const response = await fetch(`/directeur/mon-auto-ecole/components/User/api/users?id=${currentUser.id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de la suppression de l\'utilisateur');
      }
      
      setSuccess('Utilisateur supprimé avec succès');
      setShowDeleteModal(false);
      loadUsers();
    } catch (err: any) {
      console.error('Erreur lors de la suppression de l\'utilisateur:', err);
      setError(err.message || 'Erreur lors de la suppression de l\'utilisateur');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Formater le rôle pour l'affichage
  const formatRole = (role: string) => {
    switch (role) {
      case 'directeur': return 'Directeur';
      case 'moniteur': return 'Moniteur';
      case 'secretaire': return 'Secrétaire';
      case 'comptable': return 'Comptable';
      default: return role;
    }
  };

  // Obtenir la couleur du badge pour un rôle
  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'directeur': return 'bg-purple-100 text-purple-800';
      case 'moniteur': return 'bg-blue-100 text-blue-800';
      case 'secretaire': return 'bg-green-100 text-green-800';
      case 'comptable': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium text-gray-900">Gestion des utilisateurs</h2>
        <button
          onClick={handleAddUser}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <FiPlus className="mr-2" />
          Ajouter un utilisateur
        </button>
      </div>
      
      {error && (
        <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
          <p>{error}</p>
        </div>
      )}
      
      {success && (
        <div className="p-4 bg-green-50 border-l-4 border-green-500 text-green-700">
          <p>{success}</p>
        </div>
      )}
      
      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : users.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun utilisateur</h3>
          <p className="mt-1 text-sm text-gray-500">
            Commencez par ajouter un utilisateur pour votre auto-école.
          </p>
          <div className="mt-6">
            <button
              onClick={handleAddUser}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <FiPlus className="mr-2" />
              Ajouter un utilisateur
            </button>
          </div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Utilisateur
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rôle
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-500 font-medium">
                          {user.prenom.charAt(0)}{user.nom.charAt(0)}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {user.prenom} {user.nom}
                        </div>
                        <div className="text-sm text-gray-500">
                          Créé le {new Date(user.date_creation).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{user.email}</div>
                    {user.telephone && (
                      <div className="text-sm text-gray-500">{user.telephone}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getRoleBadgeColor(user.role)}`}>
                      {formatRole(user.role)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.statut === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {user.statut === 'active' ? 'Actif' : 'Inactif'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => handleEditUser(user)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <FiEdit2 className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(user)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <FiTrash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      {/* Modal pour ajouter/éditer un utilisateur */}
      <UserModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleSaveUser}
        user={currentUser}
        isLoading={isSubmitting}
      />
      
      {/* Modal de confirmation de suppression */}
      {showDeleteModal && currentUser && (
        <div className="fixed inset-0 z-[100] overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true" onClick={() => setShowDeleteModal(false)}>
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <FiAlertTriangle className="h-6 w-6 text-red-600" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Supprimer l'utilisateur
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Êtes-vous sûr de vouloir supprimer l'utilisateur {currentUser.prenom} {currentUser.nom} ? Cette action est irréversible.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={handleDeleteUser}
                  disabled={isSubmitting}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  {isSubmitting ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                      Chargement...
                    </div>
                  ) : (
                    'Supprimer'
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setShowDeleteModal(false)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Annuler
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
