'use client';

import { useState, useEffect, useMemo } from 'react';
import { FiPlus, FiSearch, FiFilter, FiSliders, FiX, FiUsers } from 'react-icons/fi';
import UserModal from './components/AjoutUser/UserModalDirect';
import UserList from './components/UserList';

// Import des fonctions API
import { 
  fetchUtilisateurs, 
  fetchEnseignants, 
  fetchBureaux,
  UtilisateurAffichage,
  Enseignant,
  Bureau,
  PersonnelMember,
  combinePersonnel,
  filterPersonnel,
  sortPersonnel
} from './api';

// Le composant principal pour la gestion du personnel

export default function AutoEcolePersonnel() {
  // États pour les données
  const [utilisateurs, setUtilisateurs] = useState<UtilisateurAffichage[]>([]);
  const [enseignants, setEnseignants] = useState<Enseignant[]>([]);
  const [bureaux, setBureaux] = useState<Bureau[]>([]);
  const [idEcole, setIdEcole] = useState<number>(0); // Ajout de l'ID de l'école
  
  // États pour les modals
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentMember, setCurrentMember] = useState<PersonnelMember | null>(null);
  const [currentUser, setCurrentUser] = useState<any | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // États pour l'interface
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<string>('all');
  const [filterBureau, setFilterBureau] = useState<number | 'all'>('all');
  const [sortBy, setSortBy] = useState<string>('nom');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  
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
  
  // Personnel combiné et filtré
  const personnel = useMemo(() => {
    const combined = combinePersonnel(utilisateurs, enseignants);
    const filtered = filterPersonnel(combined, searchTerm, filterRole, filterBureau);
    return sortPersonnel(filtered, sortBy, sortOrder);
  }, [utilisateurs, enseignants, searchTerm, filterRole, filterBureau, sortBy, sortOrder]);
  
  // Gestionnaire pour l'édition d'un membre
  const handleEditMember = (member: PersonnelMember) => {
    setCurrentMember(member);
    setShowModal(true);
  };
  
  // Gestionnaire pour la suppression d'un membre
  const handleDeleteClick = (member: PersonnelMember) => {
    setCurrentMember(member);
    setShowDeleteModal(true);
  };
  
  // Gestionnaire pour l'ajout d'un nouveau membre
  const handleAddMember = () => {
    setCurrentMember(null);
    setCurrentUser(null); // Mettre à jour currentUser à null pour indiquer qu'il s'agit d'un nouvel utilisateur
    setShowModal(true);
  };

  // Charger les données
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // Charger les données en parallèle
        const [utilisateursData, enseignantsData, bureauxData] = await Promise.all([
          fetchUtilisateurs(),
          fetchEnseignants(),
          fetchBureaux()
        ]);
        
        setUtilisateurs(utilisateursData);
        setEnseignants(enseignantsData);
        setBureaux(bureauxData);
      } catch (error: any) {
        console.error('Erreur lors du chargement des données:', error);
        setError(error.message || 'Une erreur est survenue lors du chargement des données');
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);

  // Affichage pendant le chargement
  if (loading) {
    return (
      <div className="p-6 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6 text-gray-800">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Gestion du personnel</h2>
        <button
          onClick={handleAddMember}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <FiPlus className="mr-2" />
          Ajouter un membre
        </button>
      </div>
      
      {error && (
        <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
          <p>{error}</p>
        </div>
      )}
      
      {success && (
        <div className="mb-4 p-4 bg-green-50 border-l-4 border-green-500 text-green-700">
          <p>{success}</p>
        </div>
      )}
      
      {/* Barre de recherche et filtres */}
      <div className="mb-6 flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
        <div className="flex-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Rechercher par nom, email..."
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex space-x-4">
          <div className="relative">
            <select
              className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
            >
              <option value="all">Tous les rôles</option>
              <option value="moniteur">Moniteurs</option>
              <option value="directeur">Directeurs</option>
              <option value="secretaire">Secrétaires</option>
              <option value="comptable">Comptables</option>
            </select>
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <FiFilter className="h-5 w-5 text-gray-400" />
            </div>
          </div>
          
          <div className="relative">
            <select
              className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={filterBureau === 'all' ? 'all' : filterBureau.toString()}
              onChange={(e) => setFilterBureau(e.target.value === 'all' ? 'all' : parseInt(e.target.value))}
            >
              <option value="all">Tous les bureaux</option>
              {bureaux.map((bureau) => (
                <option key={bureau.id_bureau} value={bureau.id_bureau}>
                  {bureau.nom}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <FiSliders className="h-5 w-5 text-gray-400" />
            </div>
          </div>
        </div>
      </div>
      
      {/* Contenu principal - Liste du personnel */}
      <UserList
        personnel={personnel}
        loading={loading}
        onEdit={(member) => {
          setCurrentMember(member);
          
          // Pour les entrées fusionnées, nous devons extraire l'ID utilisateur correct
          if (member.original && typeof member.original === 'object' && 'utilisateur' in member.original) {
            // C'est une entrée fusionnée, utiliser l'ID de l'utilisateur
            const utilisateur = member.original.utilisateur;
            setCurrentUser({
              ...member,
              id: utilisateur.id_utilisateur // Utiliser l'ID de l'utilisateur pour l'édition
            });
          } else {
            // Entrée normale
            setCurrentUser(member);
          }
          
          setShowModal(true);
        }}
        onDelete={(member) => {
          setCurrentMember(member);
          
          // Pour les entrées fusionnées, nous devons extraire l'ID utilisateur correct
          if (member.original && typeof member.original === 'object' && 'utilisateur' in member.original) {
            // C'est une entrée fusionnée, utiliser l'ID de l'utilisateur
            const utilisateur = member.original.utilisateur;
            setCurrentUser({
              ...member,
              id: utilisateur.id_utilisateur // Utiliser l'ID de l'utilisateur pour la suppression
            });
          } else {
            // Entrée normale
            setCurrentUser(member);
          }
          
          setShowDeleteModal(true);
        }}
        searchTerm={searchTerm}
        filterRole={filterRole}
        filterBureau={filterBureau}
        sortBy={sortBy}
        sortOrder={sortOrder}
        setSortBy={setSortBy}
        setSortOrder={setSortOrder}
        bureaux={bureaux}
      />
      
      <UserModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSave={async (userData) => {
          setIsSubmitting(true);
          setError(null);
          
          try {
            // Déterminer si c'est une création ou une mise à jour
            const isCreating = !userData.id;
            const method = isCreating ? 'POST' : 'PUT';
            
            // Ajouter l'ID de l'école si nécessaire
            if (isCreating && !userData.id_ecole) {
              userData.id_ecole = idEcole;
            }
            
            // Appeler l'API pour créer ou mettre à jour l'utilisateur
            const response = await fetch('/directeur/mon-auto-ecole/components/User/components/AjoutUser/api/users', {
              method,
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(userData),
            });
            
            if (!response.ok) {
              const errorData = await response.json();
              throw new Error(errorData.error || `Erreur lors de ${isCreating ? 'la création' : 'la mise à jour'} de l'utilisateur`);
            }
            
            // Afficher un message de succès
            setSuccess(isCreating ? 'Utilisateur créé avec succès' : 'Utilisateur mis à jour avec succès');
            
            // Fermer le modal et rafraîchir la liste
            setShowModal(false);
          } catch (err: any) {
            console.error('Erreur lors de la sauvegarde de l\'utilisateur:', err);
            setError(err.message || 'Erreur lors de la sauvegarde de l\'utilisateur');
          } finally {
            setIsSubmitting(false);
          }
        }}
        user={currentUser}
        isLoading={isSubmitting}
      />
      
      {/* Modal de confirmation de suppression */}
      {showDeleteModal && currentUser && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/30 z-50 flex items-center justify-center p-4 overflow-hidden">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 text-red-500">
                <FiUsers className="w-12 h-12" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Confirmation de suppression</h3>
              <p className="text-gray-600 mb-6">
                Êtes-vous sûr de vouloir supprimer <span className="font-semibold">{currentUser.prenom} {currentUser.nom}</span> ?
                <br /><br />
                Cette action est irréversible.
              </p>
              <div className="flex space-x-3 w-full">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Annuler
                </button>
                <button
                  onClick={async () => {
                    // Logique de suppression
                    setIsSubmitting(true);
                    setError(null);
                    
                    try {
                      // Déterminer l'ID à utiliser pour la suppression
                      let userId = currentUser.id;
                      
                      // Si c'est une entrée fusionnée, nous devons utiliser l'ID de l'utilisateur
                      if (currentUser.original && typeof currentUser.original === 'object' && 'utilisateur' in currentUser.original) {
                        userId = currentUser.original.utilisateur.id_utilisateur;
                      }
                      
                      console.log('Suppression de l\'utilisateur avec ID:', userId);
                      
                      // Appeler l'API pour supprimer l'utilisateur
                      const response = await fetch(`/directeur/mon-auto-ecole/components/User/components/AjoutUser/api/users?id=${userId}`, {
                        method: 'DELETE',
                      });
                      
                      if (!response.ok) {
                        const errorData = await response.json();
                        throw new Error(errorData.error || 'Erreur lors de la suppression de l\'utilisateur');
                      }
                      
                      // Afficher un message de succès
                      setSuccess('Utilisateur supprimé avec succès');
                      
                      // Fermer le modal et rafraîchir la liste
                      setShowDeleteModal(false);
                      
                      // Recharger les données
                      const loadData = async () => {
                        setLoading(true);
                        try {
                          // Charger les données en parallèle
                          const [utilisateursData, enseignantsData, bureauxData] = await Promise.all([
                            fetchUtilisateurs(),
                            fetchEnseignants(),
                            fetchBureaux()
                          ]);
                          
                          setUtilisateurs(utilisateursData);
                          setEnseignants(enseignantsData);
                          setBureaux(bureauxData);
                        } catch (err) {
                          console.error('Erreur lors du chargement des données:', err);
                          setError('Erreur lors du chargement des données');
                        } finally {
                          setLoading(false);
                        }
                      };
                      
                      loadData();
                    } catch (err: any) {
                      console.error('Erreur lors de la suppression de l\'utilisateur:', err);
                      setError(err.message || 'Erreur lors de la suppression de l\'utilisateur');
                    } finally {
                      setIsSubmitting(false);
                    }
                  }}
                  disabled={isSubmitting}
                  className="flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                      Suppression...
                    </div>
                  ) : 'Supprimer'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
