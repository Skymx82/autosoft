'use client';

import React, { useState, useEffect } from 'react';
import { FiPlus, FiFilter, FiDownload, FiEye, FiEdit, FiTrash2, FiLoader } from 'react-icons/fi';
import { FaSpinner } from 'react-icons/fa';
import { BiBuildings } from 'react-icons/bi';
import { AjouterRecette } from './components/ajoutrecette';
import { DetailRecette } from './components/DetailRecette';

interface Recette {
  id: string;
  date: string;
  categorie: string;
  description: string;
  montant: number;
  tva: number;
  client: string;
  modePaiement: string;
  statut: 'encaissé' | 'en attente' | 'annulé';
}

interface RecettesProps {
  id_ecole?: string;
  id_bureau?: string;
}

const Recettes: React.FC<RecettesProps> = ({ id_ecole: propIdEcole, id_bureau: propIdBureau }) => {
  const [showFilters, setShowFilters] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showBureauWarning, setShowBureauWarning] = useState(false);
  const [recetteToEdit, setRecetteToEdit] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [recettes, setRecettes] = useState<Recette[]>([]);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
    filtres: {
      categorie: null,
      client: null,
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
  
  // État pour les filtres
  const [filtres, setFiltres] = useState({
    categorie: '',
    client: '',
    statut: '',
    dateDebut: '',
    dateFin: ''
  });
  
  // Fonction pour charger les recettes
  const fetchRecettes = async () => {
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
      let url = `/directeur/comptabilite/components/recettes/api?id_ecole=${id_ecole}`;
      
      // Toujours inclure id_bureau dans l'URL
      url += `&id_bureau=${id_bureau}`;
      
      // Ajouter les paramètres de pagination
      url += `&page=${pagination.page}&limit=${pagination.limit}`;
      
      // Ajouter les filtres s'ils sont définis
      if (filtres.categorie) url += `&categorie=${encodeURIComponent(filtres.categorie)}`;
      if (filtres.client) url += `&client=${encodeURIComponent(filtres.client)}`;
      if (filtres.statut) url += `&statut=${encodeURIComponent(filtres.statut)}`;
      if (filtres.dateDebut) url += `&dateDebut=${encodeURIComponent(filtres.dateDebut)}`;
      if (filtres.dateFin) url += `&dateFin=${encodeURIComponent(filtres.dateFin)}`;
      
      console.log(`Fetching recettes data from: ${url}`);
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
      
      const data = await response.json();
      
      setRecettes(data.recettes);
      setPagination(data.pagination);
      setStatistiques(data.statistiques);
      
    } catch (err) {
      console.error('Erreur lors de la récupération des recettes:', err);
      setError('Impossible de charger les recettes. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };
  
  // Charger les recettes au chargement du composant et lorsque les filtres changent
  useEffect(() => {
    fetchRecettes();
  }, [propIdEcole, propIdBureau, pagination.page, pagination.limit]);
  
  // Fonction pour appliquer les filtres
  const appliquerFiltres = () => {
    setPagination(prev => ({ ...prev, page: 1 })); // Revenir à la première page
    // fetchRecettes sera appelé via le useEffect quand pagination.page change
  };
  
  // Fonction pour réinitialiser les filtres
  const reinitialiserFiltres = () => {
    setFiltres({
      categorie: '',
      client: '',
      statut: '',
      dateDebut: '',
      dateFin: ''
    });
    setPagination(prev => ({ ...prev, page: 1 }));
    // fetchRecettes sera appelé via le useEffect quand pagination.page change
  };
  
  // Fonction pour changer de page
  const changerPage = (nouvellePage: number) => {
    if (nouvellePage > 0 && nouvellePage <= pagination.totalPages) {
      setPagination(prev => ({ ...prev, page: nouvellePage }));
      // fetchRecettes sera appelé via le useEffect quand pagination.page change
    }
  };
  
  // Afficher un indicateur de chargement
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center justify-center h-64">
        <FiLoader className="animate-spin text-blue-500 w-8 h-8 mb-4" />
        <p className="text-gray-500">Chargement des recettes...</p>
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
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          onClick={() => fetchRecettes()}
        >
          Réessayer
        </button>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Recettes</h2>
        
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
                // Ouvrir le modal d'ajout de recette
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Source</label>
              <select className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Toutes les sources</option>
                <option value="formation">Formation</option>
                <option value="examen">Examen</option>
                <option value="vente">Vente de produits</option>
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
      
      {/* Tableau des recettes */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-50">
            <tr>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Catégorie</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Montant HT</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">TVA</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Montant TTC</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mode</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {recettes.length > 0 ? (
              recettes.map((recette) => (
                <tr key={recette.id} className="hover:bg-gray-50">
                  <td className="py-3 px-4 text-sm text-gray-500">{new Date(recette.date).toLocaleDateString('fr-FR')}</td>
                  <td className="py-3 px-4 text-sm text-gray-500">{recette.categorie}</td>
                  <td className="py-3 px-4 text-sm text-gray-500">{recette.description}</td>
                  <td className="py-3 px-4 text-sm text-gray-500">{recette.montant.toFixed(2)} €</td>
                  <td className="py-3 px-4 text-sm text-gray-500">{recette.tva.toFixed(2)} €</td>
                  <td className="py-3 px-4 text-sm font-medium text-gray-700">{(recette.montant + recette.tva).toFixed(2)} €</td>
                  <td className="py-3 px-4 text-sm text-gray-500">{recette.client}</td>
                  <td className="py-3 px-4 text-sm text-gray-500">{recette.modePaiement}</td>
                  <td className="py-3 px-4 text-sm">
                    <span 
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        recette.statut === 'encaissé' ? 'bg-green-100 text-green-800' : 
                        recette.statut === 'en attente' ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-red-100 text-red-800'
                      }`}
                    >
                      {recette.statut}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-500">
                    <div className="flex space-x-2">
                      <button 
                        className="text-blue-600 hover:text-blue-800"
                        onClick={() => {
                          setRecetteToEdit(recette.id);
                          setShowEditModal(true);
                        }}
                      >
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
                <td colSpan={10} className="py-4 text-center text-gray-500">
                  Aucune recette enregistrée
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* Pagination */}
      <div className="mt-4 flex items-center justify-between">
        <div className="text-sm text-gray-500">
          Affichage de {recettes.length} recettes
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
                Veuillez sélectionner un bureau avant d'ajouter une recette. 
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
      
      {/* Modal de modification de recette */}
      <DetailRecette
        showModal={showEditModal}
        onClose={() => setShowEditModal(false)}
        recetteId={recetteToEdit || ''}
        id_ecole={propIdEcole}
        id_bureau={propIdBureau}
        onUpdate={fetchRecettes}
      />
      
      {/* Modal d'ajout de recette */}
      <AjouterRecette
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSave={async (nouvelleRecette) => {
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
            formData.append('date', nouvelleRecette.date);
            formData.append('categorie', nouvelleRecette.categorie);
            formData.append('description', nouvelleRecette.description);
            formData.append('montant', nouvelleRecette.montant.toString());
            formData.append('tva', nouvelleRecette.tva.toString());
            formData.append('client', nouvelleRecette.client || '');
            formData.append('modePaiement', nouvelleRecette.modePaiement);
            formData.append('statut', nouvelleRecette.statut);
            
            // Désactivé temporairement pour débogage
            // Ajouter le fichier justificatif s'il existe
            // if (nouvelleRecette.justificatif) {
            //   formData.append('justificatif', nouvelleRecette.justificatif);
            // }
            
            // Appel API pour enregistrer la nouvelle recette
            const response = await fetch(`/directeur/comptabilite/components/recettes/components/ajoutrecette/api`, {
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
            
            // Recharger les recettes après l'ajout
            await fetchRecettes();
            
          } catch (err) {
            console.error('Erreur lors de l\'ajout de la recette:', err);
            setError('Impossible d\'ajouter la recette. Veuillez réessayer.');
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

export default Recettes;
