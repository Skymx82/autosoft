'use client';

import React, { useState, useEffect } from 'react';
import { FiPlus, FiFilter, FiDownload, FiEdit, FiTrash2, FiLoader, FiX } from 'react-icons/fi';
import { FaSpinner } from 'react-icons/fa';
import { BiBuildings } from 'react-icons/bi';
import { AjouterDepense } from './components/ajoutdepense';
import { ModifierDepense } from './components/DetailDepense';

interface Depense {
  id: string;
  date: string;
  categorie: string;
  description: string;
  montant: number;
  tva: number;
  fournisseur: string;
  modePaiement: string;
  statut: 'payé' | 'en attente' | 'annulé';
}

interface DepensesProps {
  id_ecole?: string;
  id_bureau?: string;
}

const Depenses: React.FC<DepensesProps> = ({ id_ecole: propIdEcole, id_bureau: propIdBureau }) => {
  const [showFilters, setShowFilters] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showBureauWarning, setShowBureauWarning] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [depenseToDelete, setDepenseToDelete] = useState<string | null>(null);
  const [depenseToEdit, setDepenseToEdit] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [depenses, setDepenses] = useState<Depense[]>([]);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
    filtres: {
      categorie: null,
      fournisseur: null,
      statut: null,
      dateDebut: null,
      dateFin: null
    }
  });
  const [statistiques, setStatistiques] = useState({
    totalHT: 0,
    totalTVA: 0,
    totalTTC: 0
  });
  
  // Filtres pour la recherche
  const [filtres, setFiltres] = useState({
    categorie: '',
    fournisseur: '',
    statut: '',
    dateDebut: '',
    dateFin: ''
  });
  
  // Fonction pour charger les dépenses
  const fetchDepenses = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Récupérer les informations utilisateur depuis le localStorage ou les props
      let id_ecole = propIdEcole;
      let id_bureau = propIdBureau;
      
      if (!id_ecole || !id_bureau) {
        try {
          const userData = localStorage.getItem('autosoft_user');
          if (userData) {
            const user = JSON.parse(userData);
            id_ecole = id_ecole || user.id_ecole;
            id_bureau = id_bureau || user.id_bureau;
          }
        } catch (err) {
          console.error('Erreur lors de la récupération des informations utilisateur:', err);
        }
      }
      
      // Valeurs par défaut si toujours undefined
      id_ecole = id_ecole || '1';
      id_bureau = id_bureau || '0';
      
      // Construire l'URL avec les paramètres
      let url = `/directeur/comptabilite/components/depenses/api?id_ecole=${id_ecole}`;
      
      // Toujours inclure id_bureau dans l'URL
      url += `&id_bureau=${id_bureau}`;
      
      // Ajouter les paramètres de pagination
      url += `&page=${pagination.page}&limit=${pagination.limit}`;
      
      // Ajouter les filtres s'ils sont définis
      if (filtres.categorie) url += `&categorie=${encodeURIComponent(filtres.categorie)}`;
      if (filtres.fournisseur) url += `&fournisseur=${encodeURIComponent(filtres.fournisseur)}`;
      if (filtres.statut) url += `&statut=${encodeURIComponent(filtres.statut)}`;
      if (filtres.dateDebut) url += `&dateDebut=${encodeURIComponent(filtres.dateDebut)}`;
      if (filtres.dateFin) url += `&dateFin=${encodeURIComponent(filtres.dateFin)}`;
      
      console.log(`Fetching depenses data from: ${url}`);
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
      
      const data = await response.json();
      
      setDepenses(data.depenses);
      setPagination(data.pagination);
      setStatistiques(data.statistiques);
      
    } catch (err) {
      console.error('Erreur lors de la récupération des dépenses:', err);
      setError('Impossible de charger les dépenses. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };
  
  // Charger les dépenses au chargement du composant et lorsque les filtres changent
  useEffect(() => {
    fetchDepenses();
  }, [propIdEcole, propIdBureau, pagination.page, pagination.limit]);
  
  // Fonction pour appliquer les filtres
  const appliquerFiltres = () => {
    setPagination(prev => ({ ...prev, page: 1 })); // Revenir à la première page
    // fetchDepenses sera appelé via le useEffect quand pagination.page change
  };
  
  // Fonction pour réinitialiser les filtres
  const reinitialiserFiltres = () => {
    setFiltres({
      categorie: '',
      fournisseur: '',
      statut: '',
      dateDebut: '',
      dateFin: ''
    });
    setPagination(prev => ({ ...prev, page: 1 }));
    // fetchDepenses sera appelé via le useEffect quand pagination.page change
  };
  
  // Fonction pour supprimer une dépense
  const handleDeleteDepense = async () => {
    if (!depenseToDelete) return;
    
    try {
      setDeleteLoading(true);
      
      // Récupérer les informations de l'utilisateur pour l'id_ecole et l'id_bureau
      const userDataStr = localStorage.getItem('autosoft_user');
      if (!userDataStr) {
        throw new Error("Informations utilisateur non disponibles");
      }
      
      const userData = JSON.parse(userDataStr);
      const id_ecole_user = userData.id_ecole || propIdEcole;
      const id_bureau_user = userData.id_bureau || propIdBureau;
      
      if (!id_ecole_user) {
        throw new Error("ID de l'auto-école non disponible");
      }
      
      // Appel à l'API pour supprimer la dépense
      const response = await fetch(`/directeur/comptabilite/components/depenses/api/supprimerdepense`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id_depense: depenseToDelete,
          id_ecole: id_ecole_user,
          id_bureau: id_bureau_user
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Erreur HTTP: ${response.status}`);
      }
      
      // Mettre à jour la liste des dépenses après la suppression
      setDepenses(prevDepenses => prevDepenses.filter(depense => depense.id !== depenseToDelete));
      
      // Fermer le modal de confirmation
      setShowDeleteConfirm(false);
      setDepenseToDelete(null);
      
    } catch (err) {
      console.error('Erreur lors de la suppression de la dépense:', err);
      setError(err instanceof Error ? err.message : 'Erreur lors de la suppression de la dépense');
    } finally {
      setDeleteLoading(false);
    }
  };
  
  // Fonction pour changer de page
  const changerPage = (nouvellePage: number) => {
    if (nouvellePage > 0 && nouvellePage <= pagination.totalPages) {
      setPagination(prev => ({ ...prev, page: nouvellePage }));
      // fetchDepenses sera appelé via le useEffect quand pagination.page change
    }
  };
  
  // Afficher un indicateur de chargement
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center justify-center h-64">
        <FiLoader className="animate-spin text-blue-500 w-8 h-8 mb-4" />
        <p className="text-gray-500">Chargement des dépenses...</p>
      </div>
    );
  }
  
  // Afficher un message d'erreur
  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center justify-center h-64">
        <div className="text-red-500 mb-4">⚠️</div>
        <p className="text-red-500">{error}</p>
        <button
          onClick={() => {
            // Vérifier si un bureau est sélectionné
            const userDataStr = localStorage.getItem('autosoft_user');
            const userData = userDataStr ? JSON.parse(userDataStr) : null;
            const id_bureau = userData?.id_bureau || propIdBureau || '0';
            
            if (id_bureau === '0') {
              // Afficher le modal d'avertissement
              setShowBureauWarning(true);
            } else {
              // Ouvrir le modal d'ajout de dépense
              setShowAddModal(true);
            }
          }}
          className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <FiPlus className="mr-1" />
          Ajouter une dépense
        </button>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Dépenses</h2>
        
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
            onClick={() => {
              // Vérifier si un bureau est sélectionné
              const userDataStr = localStorage.getItem('autosoft_user');
              const userData = userDataStr ? JSON.parse(userDataStr) : null;
              const id_bureau = userData?.id_bureau || propIdBureau || '0';
              
              if (id_bureau === '0') {
                // Afficher le modal d'avertissement
                setShowBureauWarning(true);
              } else {
                // Ouvrir le modal d'ajout de dépense
                setShowAddModal(true);
              }
            }}
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
              <select className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Toutes les catégories</option>
                <option value="loyer">Loyer</option>
                <option value="salaires">Salaires</option>
                <option value="fournitures">Fournitures</option>
                <option value="vehicules">Véhicules</option>
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
      
      {/* Tableau des dépenses */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-50">
            <tr>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Catégorie</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Montant HT</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">TVA</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Montant TTC</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fournisseur</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mode</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {depenses.length > 0 ? (
              depenses.map((depense, index) => (
                <tr key={depense.id} className="hover:bg-gray-50">
                  <td className="py-3 px-4 text-sm text-gray-500">{new Date(depense.date).toLocaleDateString('fr-FR')}</td>
                  <td className="py-3 px-4 text-sm text-gray-500">{depense.categorie}</td>
                  <td className="py-3 px-4 text-sm text-gray-500">{depense.description}</td>
                  <td className="py-3 px-4 text-sm text-gray-500">{depense.montant.toFixed(2)} €</td>
                  <td className="py-3 px-4 text-sm text-gray-500 font-medium w-24">{depense.tva.toFixed(2)} €</td>
                  <td className="py-3 px-4 text-sm font-medium text-gray-700">{(depense.montant + depense.tva).toFixed(2)} €</td>
                  <td className="py-3 px-4 text-sm text-gray-500">{depense.fournisseur}</td>
                  <td className="py-3 px-4 text-sm text-gray-500">{depense.modePaiement}</td>
                  <td className="py-3 px-4 text-sm text-gray-500">
                    <div className="flex space-x-2">
                      <button 
                        className="text-blue-600 hover:text-blue-800"
                        onClick={() => {
                          setDepenseToEdit(depense.id);
                          setShowEditModal(true);
                        }}
                      >
                        <FiEdit className="w-4 h-4" />
                      </button>
                      <button 
                        className="text-red-600 hover:text-red-800"
                        onClick={() => {
                          setDepenseToDelete(depense.id);
                          setShowDeleteConfirm(true);
                        }}
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={10} className="py-4 text-center text-gray-500">
                  Aucune dépense enregistrée
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* Pagination */}
      <div className="mt-4 flex items-center justify-between">
        <div className="text-sm text-gray-500">
          Affichage de {depenses.length} dépenses
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
      
      {/* Modal d'avertissement pour sélection de bureau */}
      {showBureauWarning && (
        <div className="fixed inset-0 backdrop-blur-sm bg-transparent z-50 flex items-center justify-center p-4 overflow-hidden">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 text-yellow-500">
                <FiFilter className="w-12 h-12" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Sélection de bureau requise</h3>
              <p className="text-gray-600 mb-6">
                Veuillez sélectionner un bureau avant d'ajouter une dépense. 
                Pour changer de bureau, cliquez sur l'icône <BiBuildings className="inline h-5 w-5" /> dans la barre de navigation.
              </p>
              <button
                onClick={() => setShowBureauWarning(false)}
                className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Compris
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Modal de confirmation de suppression */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 backdrop-blur-sm bg-transparent z-50 flex items-center justify-center p-4 overflow-hidden">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 text-red-500">
                <FiTrash2 className="w-12 h-12" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Confirmer la suppression</h3>
              <p className="text-gray-600 mb-6">
                Êtes-vous sûr de vouloir supprimer cette dépense ? Cette action est irréversible.
              </p>
              <div className="flex w-full space-x-3">
                <button
                  onClick={() => {
                    setShowDeleteConfirm(false);
                    setDepenseToDelete(null);
                  }}
                  className="flex-1 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Annuler
                </button>
                <button
                  onClick={handleDeleteDepense}
                  disabled={deleteLoading}
                  className="flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:bg-red-300 disabled:cursor-not-allowed"
                >
                  {deleteLoading ? (
                    <span className="flex items-center justify-center">
                      <FaSpinner className="animate-spin mr-2" />
                      Suppression...
                    </span>
                  ) : (
                    'Supprimer'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Modal d'ajout de dépense */}
      {/* Modal de modification de dépense */}
      <ModifierDepense
        showModal={showEditModal}
        onClose={() => setShowEditModal(false)}
        depenseId={depenseToEdit || ''}
        id_ecole={propIdEcole}
        id_bureau={propIdBureau}
        onUpdate={fetchDepenses}
      />
      
      {/* Modal d'ajout de dépense */}
      <AjouterDepense
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSave={async (nouvelleDépense) => {
          try {
            setLoading(true);
            
            // Récupérer les informations utilisateur
            let id_ecole = propIdEcole;
            let id_bureau = propIdBureau;
            
            if (!id_ecole || !id_bureau) {
              try {
                const userData = localStorage.getItem('autosoft_user');
                if (userData) {
                  const user = JSON.parse(userData);
                  id_ecole = id_ecole || user.id_ecole;
                  id_bureau = id_bureau || user.id_bureau;
                }
              } catch (err) {
                console.error('Erreur lors de la récupération des informations utilisateur:', err);
              }
            }
            
            // Valeurs par défaut si toujours undefined
            id_ecole = id_ecole || '1';
            id_bureau = id_bureau || '0';
            
            // Créer un FormData pour l'envoi des données (compatible avec l'upload de fichier)
            const formData = new FormData();
            
            // Ajouter les champs de base
            formData.append('id_ecole', id_ecole);
            formData.append('id_bureau', id_bureau);
            formData.append('date', nouvelleDépense.date);
            formData.append('categorie', nouvelleDépense.categorie);
            formData.append('description', nouvelleDépense.description);
            formData.append('montant', nouvelleDépense.montant.toString());
            formData.append('tva', nouvelleDépense.tva.toString());
            formData.append('fournisseur', nouvelleDépense.fournisseur || '');
            formData.append('modePaiement', nouvelleDépense.modePaiement);
            formData.append('statut', nouvelleDépense.statut);
            
            // Désactivé temporairement pour débogage
            // Ajouter le fichier justificatif s'il existe
            // if (nouvelleDépense.justificatif) {
            //   formData.append('justificatif', nouvelleDépense.justificatif);
            // }
            
            // Appel API pour enregistrer la nouvelle dépense
            const response = await fetch(`/directeur/comptabilite/components/depenses/components/ajoutdepense/api`, {
              method: 'POST',
              body: formData, // Pas besoin de spécifier Content-Type, il sera automatiquement défini
            });
            
            if (!response.ok) {
              // Récupérer les détails de l'erreur
              const errorData = await response.json();
              
              if (response.status === 400 && errorData.error) {
                // Erreur spécifique retournée par l'API
                throw new Error(errorData.error);
              } else {
                // Erreur générique
                throw new Error(`Erreur HTTP: ${response.status}`);
              }
            }
            
            // Recharger les dépenses après l'ajout
            await fetchDepenses();
            
          } catch (err) {
            console.error('Erreur lors de l\'ajout de la dépense:', err);
            setError('Impossible d\'ajouter la dépense. Veuillez réessayer.');
          } finally {
            setLoading(false);
          }
        }}
        id_ecole={propIdEcole}
        id_bureau={propIdBureau}
      />
    </div>
  );
};

export default Depenses;
