'use client';

import { useState, useEffect } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiUserPlus, FiX, FiAlertTriangle, FiMail, FiLock, FiShield } from 'react-icons/fi';
// Import des fonctions API
import { Utilisateur, UtilisateurAffichage, fetchUtilisateurs, addUtilisateur, updateUtilisateur, deleteUtilisateur } from './api/ApiUtilisateurs';
import { Bureau, fetchBureaux } from './api/ApiBureaux';

export default function PersonnelUtilisateurs() {
  const [utilisateurs, setUtilisateurs] = useState<UtilisateurAffichage[]>([]);
  const [bureaux, setBureaux] = useState<Bureau[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentUtilisateur, setCurrentUtilisateur] = useState<Partial<UtilisateurAffichage> | null>(null);
  const [utilisateurToDelete, setUtilisateurToDelete] = useState<UtilisateurAffichage | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [password, setPassword] = useState('');

  const roles = [
    { value: 'directeur', label: 'Directeur' },
    { value: 'moniteur', label: 'Moniteur' },
    { value: 'secretaire', label: 'Secrétaire' },
    { value: 'comptable', label: 'Comptable' }
  ];

    // Récupérer l'ID de l'auto-école depuis le localStorage
    const getIdEcole = (): number => {
      const userDataStr = localStorage.getItem('autosoft_user');
      if (!userDataStr) {
        throw new Error('Utilisateur non connecté');
      }
      
      const userData = JSON.parse(userDataStr);
      const idEcole = userData.id_ecole;
      
      if (!idEcole) {
        throw new Error('ID auto-école non trouvé');
      }
      
      return idEcole;
    };

  // Charger la liste des utilisateurs et des bureaux en utilisant l'API
  const loadUtilisateurs = async () => {
    try {
      setLoading(true);
      
      // Charger les utilisateurs avec l'API
      const utilisateursData = await fetchUtilisateurs();
      setUtilisateurs(utilisateursData);
      
      // Charger la liste des bureaux pour le formulaire
      const bureauxData = await fetchBureaux();
      setBureaux(bureauxData);
    } catch (error: any) {
      console.error('Erreur lors du chargement des utilisateurs:', error);
      setError(error.message || 'Une erreur est survenue lors du chargement des utilisateurs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUtilisateurs();
  }, []);

  // Ouvrir le modal pour ajouter un nouvel utilisateur
  const handleAddUtilisateur = () => {
    setCurrentUtilisateur({
      role: 'secretaire', // Rôle par défaut
      id_ecole: getIdEcole()
    });
    setPassword('');
    setIsEditing(false);
    setShowModal(true);
  };

  // Ouvrir le modal pour éditer un utilisateur existant
  const handleEditUtilisateur = (utilisateur: UtilisateurAffichage) => {
    setCurrentUtilisateur(utilisateur);
    setPassword('');
    setIsEditing(true);
    setShowModal(true);
  };

  // Ouvrir le modal pour confirmer la suppression d'un utilisateur
  const handleDeleteClick = (utilisateur: UtilisateurAffichage) => {
    setUtilisateurToDelete(utilisateur);
    setShowDeleteModal(true);
  };

  // Gérer le changement des champs du formulaire
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (name === 'password') {
      setPassword(value);
    } else if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setCurrentUtilisateur(prev => ({ ...prev, [name]: checked }));
    } else {
      setCurrentUtilisateur(prev => ({ ...prev, [name]: value }));
    }
  };

  // Sauvegarder un utilisateur (ajout ou modification)
  const handleSaveUtilisateur = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (!currentUtilisateur) return;
      
      // Vérifier les champs obligatoires
      if (!currentUtilisateur.email || !currentUtilisateur.role) {
        setError('Veuillez remplir tous les champs obligatoires (email et rôle)');
        return;
      }
      
      // Vérifier que le mot de passe est fourni pour un nouvel utilisateur
      if (!isEditing && !password) {
        setError('Veuillez définir un mot de passe pour le nouvel utilisateur');
        return;
      }
      
      if (isEditing && currentUtilisateur.id_utilisateur) {
        // Mettre à jour un utilisateur existant
        const updateData: Partial<Utilisateur> & { id_utilisateur: string } = {
          id_utilisateur: currentUtilisateur.id_utilisateur,
          email: currentUtilisateur.email,
          role: currentUtilisateur.role,
          id_bureau: currentUtilisateur.id_bureau
        };
        
        // Ajouter le mot de passe uniquement s'il est fourni
        if (password) {
          // Dans une application réelle, il faudrait hasher le mot de passe côté serveur
          updateData.password = password;
        }
        
        await updateUtilisateur(updateData);
        setSuccess('L\'utilisateur a été mis à jour avec succès');
      } else {
        // Ajouter un nouvel utilisateur
        await addUtilisateur({
          email: currentUtilisateur.email,
          password: password,
          role: currentUtilisateur.role,
          id_bureau: currentUtilisateur.id_bureau || 0,
          id_ecole: getIdEcole() // Récupérer l'id_ecole depuis le localStorage
        });
        
        setSuccess('L\'utilisateur a été ajouté avec succès');
      }
      
      // Fermer le modal et rafraîchir la liste
      setShowModal(false);
      loadUtilisateurs();
    } catch (error: any) {
      console.error('Erreur lors de la sauvegarde de l\'utilisateur:', error);
      setError(error.message || 'Une erreur est survenue lors de la sauvegarde de l\'utilisateur');
    }
  };

  // Supprimer un utilisateur
  const handleDeleteUtilisateur = async () => {
    try {
      if (!utilisateurToDelete) return;
      
      await deleteUtilisateur(utilisateurToDelete.id_utilisateur);
      
      setSuccess('L\'utilisateur a été supprimé avec succès');
      setShowDeleteModal(false);
      loadUtilisateurs();
    } catch (error: any) {
      console.error('Erreur lors de la suppression de l\'utilisateur:', error);
      setError(error.message || 'Une erreur est survenue lors de la suppression de l\'utilisateur');
    }
  };

  // Obtenir la couleur de badge pour un rôle
  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'directeur':
        return 'bg-purple-100 text-purple-800';
      case 'moniteur':
        return 'bg-blue-100 text-blue-800';
      case 'secretaire':
        return 'bg-green-100 text-green-800';
      case 'comptable':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Formater le nom du rôle
  const formatRoleName = (role: string) => {
    switch (role) {
      case 'directeur':
        return 'Directeur';
      case 'moniteur':
        return 'Moniteur';
      case 'secretaire':
        return 'Secrétaire';
      case 'comptable':
        return 'Comptable';
      default:
        return role;
    }
  };

  if (loading && utilisateurs.length === 0) {
    return (
      <div className="flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="text-gray-800">
      <div className="flex justify-between items-center mb-6">
        <p className="text-gray-600">
          Gérez les utilisateurs ayant accès au système AutoSoft
        </p>
        <button
          onClick={handleAddUtilisateur}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <FiPlus className="mr-2" />
          Ajouter un utilisateur
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
      
      {utilisateurs.length === 0 && !loading ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <FiUserPlus className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun utilisateur</h3>
          <p className="mt-1 text-sm text-gray-500">
            Commencez par ajouter un utilisateur pour accéder au système.
          </p>
          <div className="mt-6">
            <button
              onClick={handleAddUtilisateur}
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
                  Rôle
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Bureau
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
              {utilisateurs.map((utilisateur) => (
                <tr key={utilisateur.id_utilisateur} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {utilisateur.prenom} {utilisateur.nom}
                        </div>
                        <div className="text-sm text-gray-500 flex items-center">
                          <FiMail className="mr-1 h-3 w-3" />
                          {utilisateur.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getRoleBadgeColor(utilisateur.role)}`}>
                      {formatRoleName(utilisateur.role)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {utilisateur.bureau?.nom || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${utilisateur.actif ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {utilisateur.actif ? 'Actif' : 'Inactif'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => handleEditUtilisateur(utilisateur)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <FiEdit2 className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(utilisateur)}
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
      {showModal && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/30 z-50 flex items-center justify-center p-4 overflow-hidden">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                {isEditing ? 'Modifier l\'utilisateur' : 'Ajouter un utilisateur'}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <FiX className="h-6 w-6" />
              </button>
            </div>
            
            <form onSubmit={handleSaveUtilisateur} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="nom" className="block text-sm font-medium text-gray-700 mb-1">
                    Nom *
                  </label>
                  <input
                    type="text"
                    id="nom"
                    name="nom"
                    value={currentUtilisateur?.nom || ''}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label htmlFor="prenom" className="block text-sm font-medium text-gray-700 mb-1">
                    Prénom *
                  </label>
                  <input
                    type="text"
                    id="prenom"
                    name="prenom"
                    value={currentUtilisateur?.prenom || ''}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={currentUtilisateur?.email || ''}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  {isEditing ? 'Mot de passe (laisser vide pour ne pas modifier)' : 'Mot de passe *'}
                </label>
                <div className="relative">
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={password}
                    onChange={handleChange}
                    required={!isEditing}
                    className="w-full px-3 py-2 pl-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                  <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
              </div>
              
              <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                  Rôle *
                </label>
                <div className="relative">
                  <select
                    id="role"
                    name="role"
                    value={currentUtilisateur?.role || ''}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 pl-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Sélectionner un rôle</option>
                    {roles.map((role) => (
                      <option key={role.value} value={role.value}>
                        {role.label}
                      </option>
                    ))}
                  </select>
                  <FiShield className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
              </div>
              
              <div>
                <label htmlFor="id_bureau" className="block text-sm font-medium text-gray-700 mb-1">
                  Bureau d'affectation
                </label>
                <select
                  id="id_bureau"
                  name="id_bureau"
                  value={currentUtilisateur?.id_bureau || ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Sélectionner un bureau</option>
                  {bureaux.map((bureau) => (
                    <option key={bureau.id_bureau} value={bureau.id_bureau}>
                      {bureau.nom}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="flex items-center">
                <input
                  id="actif"
                  name="actif"
                  type="checkbox"
                  checked={currentUtilisateur?.actif || false}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="actif" className="ml-2 block text-sm text-gray-900">
                  Compte actif
                </label>
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  {isEditing ? 'Mettre à jour' : 'Ajouter'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Modal de confirmation de suppression */}
      {showDeleteModal && utilisateurToDelete && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/30 z-50 flex items-center justify-center p-4 overflow-hidden">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 text-red-500">
                <FiAlertTriangle className="w-12 h-12" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Confirmation de suppression</h3>
              <p className="text-gray-600 mb-6">
                Êtes-vous sûr de vouloir supprimer l'utilisateur <span className="font-semibold">{utilisateurToDelete.prenom} {utilisateurToDelete.nom}</span> ?
                <br /><br />
                Cette action est irréversible et supprimera tous les accès de cet utilisateur au système.
              </p>
              <div className="flex space-x-3 w-full">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Annuler
                </button>
                <button
                  onClick={handleDeleteUtilisateur}
                  className="flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
