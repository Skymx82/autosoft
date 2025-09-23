'use client';

import React, { useState, useEffect } from 'react';
import { 
  FiEdit2, 
  FiTrash2, 
  FiMoreVertical, 
  FiEye, 
  FiUserPlus,
  FiAlertCircle,
  FiCheckCircle,
  FiXCircle
} from 'react-icons/fi';

interface AutoEcole {
  id: number;
  nom: string;
  adresse: string;
  ville: string;
  code_postal: string;
  telephone: string;
  email: string;
  responsable: string;
  statut: 'active' | 'inactive' | 'pending';
  date_creation: string;
  nb_moniteurs: number;
  nb_eleves: number;
}

interface AutoEcolesListProps {
  searchTerm: string;
  filterStatus: string;
  onEdit: (autoEcole: AutoEcole) => void;
}

export default function AutoEcolesList({ searchTerm, filterStatus, onEdit }: AutoEcolesListProps) {
  const [autoEcoles, setAutoEcoles] = useState<AutoEcole[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);

  // Fermer le dropdown lorsqu'on clique en dehors
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (openDropdown !== null) {
        const dropdownElement = document.getElementById(`dropdown-${openDropdown}`);
        const buttonElement = document.getElementById(`dropdown-button-${openDropdown}`);
        
        // Vérifier si le clic est en dehors du dropdown et du bouton
        const isOutsideDropdown = dropdownElement && !dropdownElement.contains(event.target as Node);
        const isOutsideButton = buttonElement && !buttonElement.contains(event.target as Node);
        
        if (isOutsideDropdown && isOutsideButton) {
          setOpenDropdown(null);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openDropdown]);

  useEffect(() => {
    const fetchAutoEcoles = async () => {
      setLoading(true);
      try {
        // Construire l'URL avec les paramètres de recherche et de filtre
        let url = '/autosoft/dashboard/api/auto-ecoles';
        const params = new URLSearchParams();
        
        if (searchTerm) {
          params.append('search', searchTerm);
        }
        
        if (filterStatus && filterStatus !== 'all') {
          params.append('status', filterStatus);
        }
        
        if (params.toString()) {
          url += `?${params.toString()}`;
        }
        
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error(`Erreur HTTP: ${response.status}`);
        }
        
        const data = await response.json();
        setAutoEcoles(data);
        setLoading(false);
      } catch (err) {
        console.error('Erreur lors du chargement des auto-écoles:', err);
        setError('Erreur lors du chargement des auto-écoles');
        setLoading(false);
      }
    };

    fetchAutoEcoles();
  }, [searchTerm, filterStatus]);

  // Filtrer les auto-écoles en fonction de la recherche et du filtre de statut
  const filteredAutoEcoles = autoEcoles.filter(autoEcole => {
    const matchesSearch = searchTerm === '' || 
      autoEcole.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      autoEcole.ville.toLowerCase().includes(searchTerm.toLowerCase()) ||
      autoEcole.responsable.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || autoEcole.statut === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

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
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette auto-école ?')) {
      return;
    }
    
    setLoading(true);
    try {
      const response = await fetch(`/autosoft/dashboard/api/auto-ecoles/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Erreur HTTP: ${response.status}`);
      }
      
      // Mettre à jour l'état local après la suppression réussie
      setAutoEcoles(autoEcoles.filter(autoEcole => autoEcole.id !== id));
      
      // Afficher un message de succès (vous pourriez utiliser un système de notification)
      console.log('Auto-école supprimée avec succès');
    } catch (err) {
      console.error('Erreur lors de la suppression de l\'auto-école:', err);
      setError('Erreur lors de la suppression de l\'auto-école');
    } finally {
      setLoading(false);
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

  if (filteredAutoEcoles.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500">Aucune auto-école trouvée</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto overflow-y-hidden text-gray-800 w-full">
      <table className="w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Auto-école
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Responsable
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Contact
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Statut
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Utilisateurs
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
          {filteredAutoEcoles.map((autoEcole) => (
            <tr key={autoEcole.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-medium">{autoEcole.nom.charAt(0)}</span>
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">{autoEcole.nom}</div>
                    <div className="text-sm text-gray-500">{autoEcole.ville}, {autoEcole.code_postal}</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{autoEcole.responsable}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{autoEcole.telephone}</div>
                <div className="text-sm text-gray-500">{autoEcole.email}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {getStatusBadge(autoEcole.statut)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <div>{autoEcole.nb_moniteurs} moniteurs</div>
                <div>{autoEcole.nb_eleves} élèves</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {new Date(autoEcole.date_creation).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div style={{ position: 'relative' }}>
                  <button
                    id={`dropdown-button-${autoEcole.id}`}
                    onClick={() => handleDropdownToggle(autoEcole.id)}
                    className="text-gray-400 hover:text-gray-500 focus:outline-none"
                  >
                    <FiMoreVertical className="h-5 w-5" />
                  </button>
                  {openDropdown === autoEcole.id && (
                    <div 
                      id={`dropdown-${autoEcole.id}`}
                      className="fixed mt-2 w-56 rounded-md shadow-xl bg-white ring-1 ring-black ring-opacity-5" 
                      style={{ 
                        zIndex: 9999,
                        position: 'fixed',
                        right: 'auto',
                        left: 'auto',
                        top: 'auto',
                        bottom: 'auto',
                        maxWidth: '90vw'
                      }}>
                    
                      <div className="py-1" role="menu" aria-orientation="vertical">
                        <button
                          onClick={() => onEdit(autoEcole)}
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                          role="menuitem"
                        >
                          <FiEdit2 className="mr-3 h-4 w-4" />
                          Modifier
                        </button>
                        <button
                          onClick={() => console.log('Voir détails:', autoEcole.id)}
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                          role="menuitem"
                        >
                          <FiEye className="mr-3 h-4 w-4" />
                          Voir détails
                        </button>
                        <button
                          onClick={() => console.log('Gérer utilisateurs:', autoEcole.id)}
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                          role="menuitem"
                        >
                          <FiUserPlus className="mr-3 h-4 w-4" />
                          Gérer utilisateurs
                        </button>
                        <button
                          onClick={() => handleDelete(autoEcole.id)}
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
