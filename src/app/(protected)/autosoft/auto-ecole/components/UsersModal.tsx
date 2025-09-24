'use client';

import React, { useState, useEffect } from 'react';
import { FiX, FiUserPlus, FiTrash2, FiMail, FiEdit2, FiAlertCircle } from 'react-icons/fi';

interface User {
  id: string;
  email: string;
  nom: string;
  prenom: string;
  role: string;
  created_at: string;
  id_auto_ecole: number;
}

interface UsersModalProps {
  isOpen: boolean;
  onClose: () => void;
  autoEcoleId: number | null;
  autoEcoleName: string;
}

export default function UsersModal({ isOpen, onClose, autoEcoleId, autoEcoleName }: UsersModalProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState('moniteur');
  const [newUserNom, setNewUserNom] = useState('');
  const [newUserPrenom, setNewUserPrenom] = useState('');
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [addingUserLoading, setAddingUserLoading] = useState(false);
  const [addingUserError, setAddingUserError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && autoEcoleId) {
      fetchUsers();
    }
  }, [isOpen, autoEcoleId]);

  const fetchUsers = async () => {
    if (!autoEcoleId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // Utiliser le paramètre id_auto_ecole pour filtrer les utilisateurs côté serveur
      const response = await fetch(`/autosoft/users/api/users?id_auto_ecole=${autoEcoleId}`);
      
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
      
      const data = await response.json();
      setUsers(data);
      
      console.log(`Utilisateurs chargés pour l'auto-école ${autoEcoleId}:`, data.length);
    } catch (err) {
      console.error('Erreur lors du chargement des utilisateurs:', err);
      setError('Erreur lors du chargement des utilisateurs');
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!autoEcoleId) return;
    
    setAddingUserLoading(true);
    setAddingUserError(null);
    
    try {
      const response = await fetch('/autosoft/users/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: newUserEmail,
          role: newUserRole,
          id_auto_ecole: autoEcoleId,
          nom: newUserNom,
          prenom: newUserPrenom
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Erreur HTTP: ${response.status}`);
      }
      
      // Réinitialiser le formulaire
      setNewUserEmail('');
      setNewUserRole('moniteur');
      setNewUserNom('');
      setNewUserPrenom('');
      setIsAddingUser(false);
      
      // Rafraîchir la liste des utilisateurs
      fetchUsers();
    } catch (err: any) {
      console.error('Erreur lors de l\'ajout de l\'utilisateur:', err);
      setAddingUserError(err.message || 'Erreur lors de l\'ajout de l\'utilisateur');
    } finally {
      setAddingUserLoading(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      return;
    }
    
    try {
      const response = await fetch(`/autosoft/users/api/users/${userId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Erreur HTTP: ${response.status}`);
      }
      
      // Mettre à jour l'état local après la suppression réussie
      setUsers(users.filter(user => user.id !== userId));
      
      // Afficher un message de succès
      console.log('Utilisateur supprimé avec succès');
    } catch (err) {
      console.error('Erreur lors de la suppression de l\'utilisateur:', err);
      alert('Erreur lors de la suppression de l\'utilisateur');
    }
  };

  const handleResetPassword = async (userId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir réinitialiser le mot de passe de cet utilisateur ?')) {
      return;
    }
    
    try {
      const response = await fetch(`/autosoft/users/api/users/${userId}/reset-password`, {
        method: 'POST',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Erreur HTTP: ${response.status}`);
      }
      
      alert('Un email de réinitialisation de mot de passe a été envoyé à l\'utilisateur');
    } catch (err) {
      console.error('Erreur lors de la réinitialisation du mot de passe:', err);
      alert('Erreur lors de la réinitialisation du mot de passe');
    }
  };

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className={`fixed text-gray-800 inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50 p-4 transition-all duration-300 ease-in-out ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      <div className={`bg-white/95 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col border border-gray-200 backdrop-filter transition-all duration-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
        <div className="flex justify-between items-center border-b p-4">
          <h2 className="text-xl font-semibold text-gray-800">
            Gestion des utilisateurs - {autoEcoleName}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 focus:outline-none"
          >
            <FiX className="h-6 w-6" />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : error ? (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
              <div className="flex">
                <div className="flex-shrink-0">
                  <FiAlertCircle className="h-5 w-5 text-red-500" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <button
                  onClick={() => setIsAddingUser(!isAddingUser)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center hover:bg-blue-700 transition-colors"
                >
                  <FiUserPlus className="mr-2" /> Ajouter un utilisateur
                </button>
              </div>
              
              {isAddingUser && (
                <div className="bg-gray-50 p-4 rounded-md mb-6">
                  <h3 className="text-lg font-medium mb-4">Nouvel utilisateur</h3>
                  
                  {addingUserError && (
                    <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded-md mb-4">
                      <p className="text-sm text-red-700">{addingUserError}</p>
                    </div>
                  )}
                  
                  <form onSubmit={handleAddUser}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label htmlFor="nom" className="block text-sm font-medium text-gray-700 mb-1">
                          Nom
                        </label>
                        <input
                          type="text"
                          id="nom"
                          value={newUserNom}
                          onChange={(e) => setNewUserNom(e.target.value)}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="prenom" className="block text-sm font-medium text-gray-700 mb-1">
                          Prénom
                        </label>
                        <input
                          type="text"
                          id="prenom"
                          value={newUserPrenom}
                          onChange={(e) => setNewUserPrenom(e.target.value)}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        value={newUserEmail}
                        onChange={(e) => setNewUserEmail(e.target.value)}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    
                    <div className="mb-4">
                      <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                        Rôle
                      </label>
                      <select
                        id="role"
                        value={newUserRole}
                        onChange={(e) => setNewUserRole(e.target.value)}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      >
                        <option value="moniteur">Moniteur</option>
                        <option value="secretaire">Secrétaire</option>
                        <option value="admin">Administrateur</option>
                      </select>
                    </div>
                    
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setIsAddingUser(false)}
                        className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        Annuler
                      </button>
                      <button
                        type="submit"
                        disabled={addingUserLoading}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:bg-blue-400"
                      >
                        {addingUserLoading ? 'Ajout en cours...' : 'Ajouter'}
                      </button>
                    </div>
                  </form>
                </div>
              )}
              
              {users.length === 0 ? (
                <div className="text-center py-10">
                  <p className="text-gray-500">Aucun utilisateur trouvé</p>
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
                          Email
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Rôle
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date de création
                        </th>
                        <th scope="col" className="relative px-6 py-3">
                          <span className="sr-only">Actions</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {users.map((user) => (
                        <tr key={user.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                                <span className="text-blue-600 font-medium">
                                  {user.prenom.charAt(0)}{user.nom.charAt(0)}
                                </span>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {user.prenom} {user.nom}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{user.email}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                              ${user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 
                                user.role === 'moniteur' ? 'bg-green-100 text-green-800' : 
                                'bg-blue-100 text-blue-800'}`}>
                              {user.role === 'admin' ? 'Administrateur' : 
                               user.role === 'moniteur' ? 'Moniteur' : 'Secrétaire'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(user.created_at).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex justify-end gap-2">
                              <button
                                onClick={() => handleResetPassword(user.id)}
                                className="text-blue-600 hover:text-blue-900"
                                title="Réinitialiser le mot de passe"
                              >
                                <FiMail className="h-5 w-5" />
                              </button>
                              <button
                                onClick={() => handleDeleteUser(user.id)}
                                className="text-red-600 hover:text-red-900"
                                title="Supprimer"
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
            </>
          )}
        </div>
        
        <div className="border-t p-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
}
