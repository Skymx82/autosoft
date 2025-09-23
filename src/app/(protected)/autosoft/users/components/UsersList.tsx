'use client';

import React, { useState, useEffect } from 'react';
import { 
  FiEdit2, 
  FiTrash2, 
  FiMoreVertical, 
  FiEye, 
  FiKey,
  FiAlertCircle,
  FiCheckCircle,
  FiXCircle,
  FiShield
} from 'react-icons/fi';

interface User {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  role: string;
  auto_ecole: string;
  id_auto_ecole: number;
  statut: 'active' | 'inactive' | 'pending';
  date_creation: string;
}

interface UsersListProps {
  searchTerm: string;
  filterRole: string;
  onEdit: (user: User) => void;
}

export default function UsersList({ searchTerm, filterRole, onEdit }: UsersListProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        // Construire l'URL avec les paramètres de recherche et de filtre
        let url = '/autosoft/users/api/users';
        const params = new URLSearchParams();
        
        if (searchTerm) {
          params.append('search', searchTerm);
        }
        
        if (filterRole && filterRole !== 'all') {
          params.append('role', filterRole);
        }
        
        if (params.toString()) {
          url += `?${params.toString()}`;
        }
        
        const response = await fetch(url);
        
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

    fetchUsers();
  }, [searchTerm, filterRole]);

  const handleDropdownToggle = (id: number) => {
    if (openDropdown === id) {
      setOpenDropdown(null);
    } else {
      setOpenDropdown(id);
      
      // Ajouter un petit délai pour s'assurer que le DOM est mis à jour
      setTimeout(() => {
        const button = document.getElementById(`dropdown-button-${id}`);
        const dropdown = document.getElementById(`dropdown-${id}`);
        
        if (button && dropdown) {
          const buttonRect = button.getBoundingClientRect();
          
          // Positionner le dropdown par rapport au bouton
          dropdown.style.top = `${buttonRect.bottom + window.scrollY + 8}px`;
          
          // Calculer la position horizontale du dropdown
          // S'assurer qu'il ne dépasse pas de la fenêtre à droite
          const windowWidth = window.innerWidth;
          const dropdownWidth = 224; // w-56 = 14rem = 224px
          
          // Pour les boutons dans la dernière colonne, toujours aligner à gauche
          // Cela garantit que le dropdown est visible même pour les lignes en bas du tableau
          dropdown.style.left = `${buttonRect.left + window.scrollX - dropdownWidth + 24}px`;
        }
      }, 0);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      return;
    }
    
    setLoading(true);
    try {
      const response = await fetch(`/autosoft/users/api/users/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Erreur HTTP: ${response.status}`);
      }
      
      // Mettre à jour l'état local après la suppression réussie
      setUsers(users.filter(user => user.id !== id));
      
      // Afficher un message de succès
      alert('Utilisateur supprimé avec succès');
    } catch (err) {
      console.error('Erreur lors de la suppression de l\'utilisateur:', err);
      alert(`Erreur: ${err instanceof Error ? err.message : 'Une erreur est survenue'}`);
      setError('Erreur lors de la suppression de l\'utilisateur');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (id: number) => {
    if (!confirm('Êtes-vous sûr de vouloir réinitialiser le mot de passe de cet utilisateur ?')) {
      return;
    }
    
    try {
      setLoading(true);
      const response = await fetch(`/autosoft/users/api/users/${id}/reset-password`, {
        method: 'POST',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Erreur HTTP: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Afficher le message de succès retourné par l'API
      alert(data.message || 'Un email de réinitialisation de mot de passe a été envoyé à l\'utilisateur');
    } catch (err) {
      console.error('Erreur lors de la réinitialisation du mot de passe:', err);
      alert(`Erreur: ${err instanceof Error ? err.message : 'Une erreur est survenue'}`);
    } finally {
      setLoading(false);
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
            <FiShield className="mr-1" /> Admin
          </span>
        );
      case 'directeur':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            <FiShield className="mr-1" /> Directeur
          </span>
        );
      case 'moniteur':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <FiShield className="mr-1" /> Moniteur
          </span>
        );
      case 'secretaire':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <FiShield className="mr-1" /> Secrétaire
          </span>
        );
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <FiCheckCircle className="mr-1" /> Actif
          </span>
        );
      case 'inactive':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <FiXCircle className="mr-1" /> Inactif
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <FiAlertCircle className="mr-1" /> En attente
          </span>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
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
    );
  }

  if (users.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500">Aucun utilisateur trouvé</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto overflow-y-hidden text-gray-800 w-full">
      <table className="w-full divide-y divide-gray-200">
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
              Auto-école
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Statut
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Date d'ajout
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
                    <span className="text-blue-600 font-medium">{user.prenom.charAt(0)}{user.nom.charAt(0)}</span>
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">{user.prenom} {user.nom}</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{user.email}</div>
                <div className="text-sm text-gray-500">{user.telephone}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {getRoleBadge(user.role)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{user.auto_ecole}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {getStatusBadge(user.statut)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {new Date(user.date_creation).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="relative">
                  <button
                    id={`dropdown-button-${user.id}`}
                    onClick={() => handleDropdownToggle(user.id)}
                    className="text-gray-400 hover:text-gray-500 focus:outline-none"
                  >
                    <FiMoreVertical className="h-5 w-5" />
                  </button>
                  {openDropdown === user.id && (
                    <div 
                      id={`dropdown-${user.id}`}
                      className="fixed mt-2 w-56 rounded-md shadow-xl bg-white ring-1 ring-black ring-opacity-5" 
                      style={{ 
                        zIndex: 9999,
                        position: 'fixed',
                        right: 'auto',
                        left: 'auto',
                        top: 'auto',
                        bottom: 'auto',
                        maxWidth: '90vw'
                      }}
                    >
                      <div className="py-1" role="menu" aria-orientation="vertical">
                        <button
                          onClick={() => onEdit(user)}
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                          role="menuitem"
                        >
                          <FiEdit2 className="mr-3 h-4 w-4" />
                          Modifier
                        </button>
                        <button
                          onClick={() => handleResetPassword(user.id)}
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                          role="menuitem"
                        >
                          <FiKey className="mr-3 h-4 w-4" />
                          Réinitialiser mot de passe
                        </button>
                        <button
                          onClick={() => handleDelete(user.id)}
                          className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full text-left"
                          role="menuitem"
                        >
                          <FiTrash2 className="mr-3 h-4 w-4" />
                          Supprimer
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
