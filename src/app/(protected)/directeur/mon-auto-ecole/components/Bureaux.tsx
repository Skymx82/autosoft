'use client';

import { useState, useEffect } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiMapPin, FiX, FiCheck, FiAlertTriangle } from 'react-icons/fi';
// Import des fonctions API
import { Bureau, fetchBureaux, addBureau, updateBureau, deleteBureau } from '../api/ApiBureaux';

export default function AutoEcoleBureaux() {
  const [bureaux, setBureaux] = useState<Bureau[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentBureau, setCurrentBureau] = useState<Partial<Bureau> | null>(null);
  const [bureauToDelete, setBureauToDelete] = useState<Bureau | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // La fonction getIdEcole est maintenant importée depuis l'API

  // Charger la liste des bureaux en utilisant l'API
  const loadBureaux = async () => {
    try {
      setLoading(true);
      const data = await fetchBureaux();
      setBureaux(data);
    } catch (error: any) {
      console.error('Erreur lors du chargement des bureaux:', error);
      setError(error.message || 'Erreur lors du chargement des bureaux');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBureaux();
  }, []);

  // Ouvrir le modal pour ajouter un nouveau bureau
  const handleAddBureau = () => {
    setCurrentBureau({});
    setIsEditing(false);
    setShowModal(true);
  };

  // Ouvrir le modal pour éditer un bureau existant
  const handleEditBureau = (bureau: Bureau) => {
    setCurrentBureau(bureau);
    setIsEditing(true);
    setShowModal(true);
  };

  // Ouvrir le modal pour confirmer la suppression d'un bureau
  const handleDeleteClick = (bureau: Bureau) => {
    setBureauToDelete(bureau);
    setShowDeleteModal(true);
  };

  // Gérer le changement des champs du formulaire
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCurrentBureau(prev => ({ ...prev, [name]: value }));
  };

  // Sauvegarder un bureau (ajout ou modification) en utilisant l'API
  const handleSaveBureau = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (!currentBureau) return;
      
      // Vérifier les champs obligatoires
      if (!currentBureau.nom || !currentBureau.adresse) {
        setError('Veuillez remplir tous les champs obligatoires (nom et adresse)');
        return;
      }
      
      if (isEditing && currentBureau.id_bureau) {
        // Mettre à jour un bureau existant
        await updateBureau(currentBureau as Bureau);
        setSuccess('Le bureau a été mis à jour avec succès');
      } else {
        // Ajouter un nouveau bureau
        if (currentBureau.nom && currentBureau.adresse) {
          await addBureau({
            nom: currentBureau.nom,
            adresse: currentBureau.adresse,
            telephone: currentBureau.telephone || '',
            id_ecole: currentBureau.id_ecole || 0 // L'API gèrera la récupération de l'id_ecole si nécessaire
          });
          setSuccess('Le bureau a été ajouté avec succès');
        }
      }
      
      // Fermer le modal et rafraîchir la liste
      setShowModal(false);
      loadBureaux();
    } catch (error: any) {
      console.error('Erreur lors de la sauvegarde du bureau:', error);
      setError(error.message || 'Une erreur est survenue lors de la sauvegarde du bureau');
    }
  };

  // Supprimer un bureau en utilisant l'API
  const handleDeleteBureau = async () => {
    try {
      if (!bureauToDelete) return;
      
      await deleteBureau(bureauToDelete.id_bureau);
      
      setSuccess('Le bureau a été supprimé avec succès');
      setShowDeleteModal(false);
      loadBureaux();
    } catch (error: any) {
      console.error('Erreur lors de la suppression du bureau:', error);
      setError(error.message || 'Une erreur est survenue lors de la suppression du bureau');
    }
  };

  if (loading && bureaux.length === 0) {
    return (
      <div className="p-6 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6 text-gray-800">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Gestion des bureaux</h2>
        <button
          onClick={handleAddBureau}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <FiPlus className="mr-2" />
          Ajouter un bureau
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
      
      {bureaux.length === 0 && !loading ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <FiMapPin className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun bureau</h3>
          <p className="mt-1 text-sm text-gray-500">
            Commencez par ajouter un bureau pour votre auto-école.
          </p>
          <div className="mt-6">
            <button
              onClick={handleAddBureau}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <FiPlus className="mr-2" />
              Ajouter un bureau
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bureaux.map((bureau) => (
            <div key={bureau.id_bureau} className="bg-white border rounded-lg shadow-sm overflow-hidden">
              <div className="p-5">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-medium text-gray-900">{bureau.nom}</h3>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEditBureau(bureau)}
                      className="text-gray-400 hover:text-blue-500"
                    >
                      <FiEdit2 className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(bureau)}
                      className="text-gray-400 hover:text-red-500"
                    >
                      <FiTrash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
                
                <div className="mt-3 text-sm text-gray-600">
                  <p className="mb-1">{bureau.adresse}</p>
                  {bureau.telephone && <p className="mb-1">Tél: {bureau.telephone}</p>}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Modal pour ajouter/éditer un bureau */}
      {showModal && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/30 z-50 flex items-center justify-center p-4 overflow-hidden">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                {isEditing ? 'Modifier le bureau' : 'Ajouter un bureau'}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <FiX className="h-6 w-6" />
              </button>
            </div>
            
            <form onSubmit={handleSaveBureau} className="space-y-4">
              <div>
                <label htmlFor="nom" className="block text-sm font-medium text-gray-700 mb-1">
                  Nom du bureau *
                </label>
                <input
                  type="text"
                  id="nom"
                  name="nom"
                  value={currentBureau?.nom || ''}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label htmlFor="adresse" className="block text-sm font-medium text-gray-700 mb-1">
                  Adresse *
                </label>
                <input
                  type="text"
                  id="adresse"
                  name="adresse"
                  value={currentBureau?.adresse || ''}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              {/* Les champs code_postal et ville ont été supprimés car ils n'existent pas dans la table bureau */}
              
              <div>
                <label htmlFor="telephone" className="block text-sm font-medium text-gray-700 mb-1">
                  Téléphone
                </label>
                <input
                  type="tel"
                  id="telephone"
                  name="telephone"
                  value={currentBureau?.telephone || ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              {/* Les champs email, responsable et horaires ont été supprimés car ils n'existent pas dans la table bureau */}
              
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
      {showDeleteModal && bureauToDelete && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/30 z-50 flex items-center justify-center p-4 overflow-hidden">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 text-red-500">
                <FiAlertTriangle className="w-12 h-12" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Confirmation de suppression</h3>
              <p className="text-gray-600 mb-6">
                Êtes-vous sûr de vouloir supprimer le bureau <span className="font-semibold">{bureauToDelete.nom}</span> ?
                <br /><br />
                Cette action est irréversible et supprimera toutes les données associées à ce bureau.
              </p>
              <div className="flex space-x-3 w-full">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Annuler
                </button>
                <button
                  onClick={handleDeleteBureau}
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
